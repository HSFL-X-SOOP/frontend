export interface CreateApiKeyRequest {
    name?: string;
}

export interface CreateApiKeyResponse {
    id: string;
    key: string;
    prefix: string;
    name: string | null;
    createdAt: string;
}

export interface ApiKeyInfo {
    id: string;
    prefix: string;
    name: string | null;
    isActive: boolean;
    lastUsedAt: string | null;
    createdAt: string;
}

export interface RevokeApiKeyResponse {
    revoked: boolean;
}
