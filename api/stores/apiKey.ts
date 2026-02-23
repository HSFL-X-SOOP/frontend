import {useHttpClient} from '@/api/client';
import {
    ApiKeyInfo,
    CreateApiKeyRequest,
    CreateApiKeyResponse,
    RevokeApiKeyResponse,
} from '@/api/models/apiKey';
import {Result} from '@/utils/errors';
import {api} from '@/utils/api';

export function useApiKeyStore() {
    const httpClient = useHttpClient();

    return {
        listApiKeys: (): Promise<Result<ApiKeyInfo[]>> => {
            return api.requestSafe(
                httpClient.get<ApiKeyInfo[]>('/api-keys'),
                'ApiKeyStore:listApiKeys'
            );
        },

        createApiKey: (body: CreateApiKeyRequest): Promise<Result<CreateApiKeyResponse>> => {
            return api.requestSafe(
                httpClient.post<CreateApiKeyResponse>('/api-keys', body),
                'ApiKeyStore:createApiKey'
            );
        },

        revokeApiKey: (id: string): Promise<Result<RevokeApiKeyResponse>> => {
            return api.requestSafe(
                httpClient.delete<RevokeApiKeyResponse>(`/api-keys/${id}`),
                'ApiKeyStore:revokeApiKey'
            );
        },
    };
}
