package keycloak

import (
	"context"
	"errors"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/activadigital/plancia/configs"
	"github.com/activadigital/plancia/configs/logger"
	"github.com/activadigital/plancia/internal/api/server/middleware"
	"github.com/activadigital/plancia/internal/domain/types"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"k8s.io/utils/ptr"
	"strings"
	"time"
)

type KeycloakAdapter struct {
	client                 *gocloak.GoCloak
	jwt                    *gocloak.JWT
	accessTokenExpiration  time.Time
	refreshTokenExpiration time.Time
}

var conflictErr = &gocloak.APIError{
	Code:    409,
	Message: "409 Conflict: Role with name skafos1-dev_admin already exists",
	Type:    "unknown",
}

func NewKeycloakAdapter(client *gocloak.GoCloak) *KeycloakAdapter {
	return &KeycloakAdapter{
		client: client,
	}
}

func (k *KeycloakAdapter) CreateAuthResources(ctx context.Context, skafos types.Skafos) error {
	realm := configs.Global().Keycloak.Realm
	if err := k.validateToken(ctx, realm); err != nil {
		return err
	}
	clusterClient := newSkafosClient(skafos)
	_, err := k.client.CreateClient(ctx, k.jwt.AccessToken, realm, clusterClient)
	if err != nil {
		if !errors.As(err, &conflictErr) {
			return err
		}
	}

	usersClient := newUserClientDto(skafos)
	_, err = k.client.CreateClient(ctx, k.jwt.AccessToken, realm, usersClient)
	if err != nil {
		if !errors.As(err, &conflictErr) {
			return err
		}
	}

	adminRole := newRole(fmt.Sprintf(adminRoleFmt, skafos.GetId()))
	_, err = k.client.CreateRealmRole(ctx, k.jwt.AccessToken, realm, adminRole)
	if err != nil {
		if !errors.As(err, &conflictErr) {
			return err
		}
	}

	ownerRole := newRole(fmt.Sprintf(ownerRoleFmt, skafos.GetId()))
	_, err = k.client.CreateRealmRole(ctx, k.jwt.AccessToken, realm, ownerRole)
	if err != nil {
		if !errors.As(err, &conflictErr) {
			return err
		}
	}

	devRole := newRole(fmt.Sprintf(devRoleFmt, skafos.GetId()))
	_, err = k.client.CreateRealmRole(ctx, k.jwt.AccessToken, realm, devRole)
	if err != nil {
		if !errors.As(err, &conflictErr) {
			return err
		}
	}

	err = k.setRoleIDs(ctx, realm, &adminRole, &ownerRole, &devRole)
	if err != nil {
		return err
	}

	devGroup := newGroup(fmt.Sprintf(devGroupFmt, skafos.GetId()))
	devGroupId, err := k.createGroup(ctx, realm, nil, devGroup)
	if err != nil {
		return err
	}

	ownerGroup := newGroup(fmt.Sprintf(ownerGroupFmt, skafos.GetId()))
	ownerGroupId, err := k.createGroup(ctx, realm, &devGroupId, ownerGroup)
	if err != nil {
		return err
	}

	adminGroup := newGroup(fmt.Sprintf(adminGroupFmt, skafos.GetId()))
	adminGroupId, err := k.createGroup(ctx, realm, &ownerGroupId, adminGroup)
	if err != nil {
		return err
	}
	if err = k.client.AddRealmRoleToGroup(ctx, k.jwt.AccessToken, realm, adminGroupId, []gocloak.Role{adminRole}); err != nil {
		return err
	}
	if err = k.client.AddRealmRoleToGroup(ctx, k.jwt.AccessToken, realm, ownerGroupId, []gocloak.Role{ownerRole}); err != nil {
		return err
	}
	if err = k.client.AddRealmRoleToGroup(ctx, k.jwt.AccessToken, realm, devGroupId, []gocloak.Role{devRole}); err != nil {
		return err
	}
	token := ctx.Value(middleware.Token("token")).(*jwt.Token)
	userId, err := token.Claims.GetSubject()
	if err != nil {
		return err
	}
	if err = k.client.AddUserToGroup(ctx, k.jwt.AccessToken, realm, userId, adminGroupId); err != nil {
		return err
	}
	return nil
}

func (k *KeycloakAdapter) createGroup(ctx context.Context, realm string, parentId *string, group gocloak.Group) (string, error) {
	var groupId string
	var err error
	if parentId != nil {
		groupId, err = k.client.CreateChildGroup(ctx, k.jwt.AccessToken, realm, *parentId, group)
	} else {
		groupId, err = k.client.CreateGroup(ctx, k.jwt.AccessToken, realm, group)
	}
	if err == nil {
		return groupId, nil
	}
	if !errors.As(err, &conflictErr) {
		return "", err
	}
	groups, getErr := k.client.GetGroups(ctx, k.jwt.AccessToken, realm, gocloak.GetGroupsParams{
		BriefRepresentation: ptr.To(true),
		Exact:               ptr.To(true),
		Search:              group.Name,
	})
	if getErr != nil || len(groups) != 1 {
		return "", fmt.Errorf("error creating group: %w", getErr)
	}
	return *groups[0].ID, nil

}

func (k *KeycloakAdapter) setRoleIDs(ctx context.Context, realm string, adminRole *gocloak.Role, ownerRole *gocloak.Role, devRole *gocloak.Role) error {
	roles, err := k.client.GetRealmRoles(ctx, k.jwt.AccessToken, realm, gocloak.GetRoleParams{
		BriefRepresentation: gocloak.BoolP(true),
	})
	if err != nil {
		return err
	}

	for _, role := range roles {
		if *role.Name == *adminRole.Name {
			adminRole.ID = role.ID
		}
		if *role.Name == *ownerRole.Name {
			ownerRole.ID = role.ID
		}
		if *role.Name == *devRole.Name {
			devRole.ID = role.ID
		}
	}
	return nil
}

func toDeleteGroup(group *gocloak.Group, skafosName string) bool {
	return strings.EqualFold(*group.Name, fmt.Sprintf(adminGroupFmt, skafosName)) ||
		strings.EqualFold(*group.Name, fmt.Sprintf(ownerGroupFmt, skafosName)) ||
		strings.EqualFold(*group.Name, fmt.Sprintf(devGroupFmt, skafosName))
}

func (k *KeycloakAdapter) DeleteAuthResources(ctx context.Context, namespace, skafosName string) error {
	realm := configs.Global().Keycloak.Realm
	if err := k.validateToken(ctx, realm); err != nil {
		return err
	}
	go k.deleteRealmRoles(ctx, realm, skafosName)
	go k.deleteGroups(ctx, realm, skafosName)
	go k.deleteClients(ctx, realm, skafosName)
	return nil
}

func (k *KeycloakAdapter) deleteRealmRoles(ctx context.Context, realm string, skafosName string) {
	adminRole := fmt.Sprintf(adminRoleFmt, skafosName)
	err := k.client.DeleteRealmRole(ctx, k.jwt.AccessToken, realm, adminRole)
	if err != nil {
		logger.Warn(ctx, "Error deleting realm roles",
			zap.String("realm", realm),
			zap.String("role", adminRole),
			zap.Error(err))
	}

	ownerRole := fmt.Sprintf(ownerRoleFmt, skafosName)
	err = k.client.DeleteRealmRole(ctx, k.jwt.AccessToken, realm, ownerRole)
	if err != nil {
		logger.Warn(ctx, "Error deleting realm roles",
			zap.String("realm", realm),
			zap.String("role", ownerRole),
			zap.Error(err))
	}

	devRole := fmt.Sprintf(devRoleFmt, skafosName)
	err = k.client.DeleteRealmRole(ctx, k.jwt.AccessToken, realm, devRole)
	if err != nil {
		logger.Warn(ctx, "Error deleting realm roles",
			zap.String("realm", realm),
			zap.String("role", devRole),
			zap.Error(err))
	}
}

func (k *KeycloakAdapter) deleteGroups(ctx context.Context, realm string, skafosName string) {
	params := gocloak.GetGroupsParams{BriefRepresentation: ptr.To(true)}
	groups, err := k.client.GetGroups(ctx, k.jwt.AccessToken, realm, params)
	if err != nil {
		logger.Warn(ctx, "Error getting groups",
			zap.String("realm", realm),
			zap.Error(err))
	}
	for _, group := range groups {
		if toDeleteGroup(group, skafosName) {
			err = k.client.DeleteGroup(ctx, k.jwt.AccessToken, realm, *group.ID)
			if err != nil {
				logger.Warn(ctx, "Error deleting realm roles",
					zap.String("realm", realm),
					zap.String("groupName", *group.Name),
					zap.String("groupId", *group.ID),
					zap.Error(err))
			}
		}
	}
}

func (k *KeycloakAdapter) deleteClients(ctx context.Context, realm string, skafosName string) {
	clients, err := k.client.GetClients(ctx, k.jwt.AccessToken, realm, gocloak.GetClientsParams{})
	if err != nil {
		logger.Warn(ctx, "Error getting clients",
			zap.String("realm", realm),
			zap.Error(err))
	}
	for _, client := range clients {
		if toDeleteClient(client, skafosName) {
			err = k.client.DeleteClient(ctx, k.jwt.AccessToken, realm, *client.ID)
			if err != nil {
				logger.Warn(ctx, "Error deleting keycloak client",
					zap.String("realm", realm),
					zap.String("clientId", *client.ClientID),
					zap.String("id", *client.ID),
					zap.Error(err))
			}
		}
	}
}

func toDeleteClient(client *gocloak.Client, skafosName string) bool {
	return strings.EqualFold(*client.ClientID, skafosName) ||
		strings.EqualFold(*client.ClientID, fmt.Sprintf(clientUsersFmt, skafosName))
}

func (k *KeycloakAdapter) validateToken(ctx context.Context, realm string) error {
	keycloakClient := configs.Global().Keycloak.ServiceAccount
	if expired(k.accessTokenExpiration) && !expired(k.refreshTokenExpiration) {
		return k.refreshToken(ctx, "master", keycloakClient.ClientId, keycloakClient.Secret)
	}
	return k.login(ctx, "master", keycloakClient.ClientId, keycloakClient.Secret)
}

func expired(expirationTime time.Time) bool {
	return expirationTime.Before(time.Now())
}

func (k *KeycloakAdapter) login(ctx context.Context, realm string, id, secret string) error {
	jwt, err := k.client.LoginClient(ctx, id, secret, realm)
	if err != nil {
		return err
	}
	k.jwt = jwt
	k.accessTokenExpiration = time.Now().Add(time.Duration(jwt.ExpiresIn) * time.Second)
	k.refreshTokenExpiration = time.Now().Add(time.Duration(jwt.RefreshExpiresIn) * time.Second)
	return nil
}

func (k *KeycloakAdapter) refreshToken(ctx context.Context, realm string, id, secret string) error {
	jwt, err := k.client.RefreshToken(ctx, k.jwt.RefreshToken, id, secret, realm)
	if err != nil {
		return err
	}
	k.jwt = jwt
	k.accessTokenExpiration = time.Now().Add(time.Duration(jwt.ExpiresIn) * time.Second)
	k.refreshTokenExpiration = time.Now().Add(time.Duration(jwt.RefreshExpiresIn) * time.Second)
	return nil
}
