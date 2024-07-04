package keycloak

type ClientDto struct {
	Id                   string              `json:"id,omitempty"`
	Secret               string              `json:"secret,omitempty"`
	ClientId             string              `json:"clientId"`
	RedirectUris         []string            `json:"redirectUris,omitempty"`
	StandardFlowEnabled  bool                `json:"standardFlowEnabled"`
	ProtocolMappers      []ProtocolMapperDto `json:"protocolMappers,omitempty"`
	DefaultClientScopes  []string            `json:"defaultClientScopes"`
	OptionalClientScopes []string            `json:"optionalClientScopes"`
}

type ProtocolMapperDto struct {
	Name           string               `json:"name"`
	Protocol       string               `json:"protocol"`
	ProtocolMapper string               `json:"protocolMapper"`
	Config         ProtocolMapperConfig `json:"config"`
}

type ProtocolMapperConfig struct {
	IncludedClientAudience string `json:"included.client.audience"`
	IdTokenClaim           bool   `json:"id.token.claim"`
	AccessTokenClaim       bool   `json:"access.token.claim"`
}

type RoleDto struct {
	Id   string `json:"id,omitempty"`
	Name string `json:"name"`
}

type GroupDto struct {
	Id   string `json:"id,omitempty"`
	Name string `json:"name"`
}
