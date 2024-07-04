package keycloak

import (
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/activadigital/plancia/internal/domain/types"
	"github.com/google/uuid"
)

func clusterClientDefaultClientScopes() *[]string {
	return &[]string{"microprofile-jwt", "acr", "email", "profile", "roles", "web-origins"}
}

func clusterClientOptionalClientScopes() *[]string {
	return &[]string{"address", "offline-access", "phone"}
}

func clusterClientValidRedirectUri() *[]string {
	return &[]string{"http://localhost:18000", "http://localhost:8000"}
}

func newSkafosClient(skafos types.Skafos) gocloak.Client {
	return gocloak.Client{
		ClientID:             gocloak.StringP(skafos.GetId()),
		DefaultClientScopes:  clusterClientDefaultClientScopes(),
		Secret:               gocloak.StringP(uuid.NewString()),
		StandardFlowEnabled:  gocloak.BoolP(true),
		OptionalClientScopes: clusterClientOptionalClientScopes(),
	}
}

func newUserClientDto(skafos types.Skafos) gocloak.Client {
	return gocloak.Client{
		ClientID:            gocloak.StringP(fmt.Sprintf(clientUsersFmt, skafos.GetId())),
		Secret:              gocloak.StringP(uuid.NewString()),
		StandardFlowEnabled: gocloak.BoolP(true),
		RedirectURIs:        clusterClientValidRedirectUri(),
		ProtocolMappers: &[]gocloak.ProtocolMapperRepresentation{
			newProtocolMapper(skafos),
		},
		DefaultClientScopes:  clusterClientDefaultClientScopes(),
		OptionalClientScopes: clusterClientOptionalClientScopes(),
	}
}

func newProtocolMapper(skafos types.Skafos) gocloak.ProtocolMapperRepresentation {
	return gocloak.ProtocolMapperRepresentation{
		Name:           gocloak.StringP(fmt.Sprintf("%s-audience", skafos.GetId())),
		Protocol:       gocloak.StringP("openid-connect"),
		ProtocolMapper: gocloak.StringP("oidc-audience-mapper"),
		Config:         newProtocolMapperConfig(skafos),
	}
}

func newProtocolMapperConfig(skafos types.Skafos) *map[string]string {
	return &map[string]string{
		"includedClientAudience": skafos.GetId(),
		"idTokenClaim":           fmt.Sprintf("%v", true),
		"accessTokenClaim":       fmt.Sprintf("%v", true),
	}
}

func newRole(name string) gocloak.Role {
	return gocloak.Role{
		Name: gocloak.StringP(name),
	}
}

func newGroup(name string) gocloak.Group {
	return gocloak.Group{
		Name: gocloak.StringP(name),
	}
}
