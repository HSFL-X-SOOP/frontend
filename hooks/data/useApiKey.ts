import {useCallback, useState} from 'react';
import {AppError} from '@/utils/errors';
import {
    ApiKeyInfo,
    CreateApiKeyRequest,
    CreateApiKeyResponse,
    RevokeApiKeyResponse,
} from '@/api/models/apiKey';
import {useApiKeyStore} from '@/api/stores/apiKey';

export const useApiKey = () => {
    const apiKeyStore = useApiKeyStore();
    const [loading, setLoading] = useState(false);

    const listApiKeys = useCallback(async (
        onSuccess: (data: ApiKeyInfo[]) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await apiKeyStore.listApiKeys();

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [apiKeyStore]);

    const createApiKey = useCallback(async (
        body: CreateApiKeyRequest,
        onSuccess: (data: CreateApiKeyResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await apiKeyStore.createApiKey(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [apiKeyStore]);

    const revokeApiKey = useCallback(async (
        id: string,
        onSuccess: (data: RevokeApiKeyResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await apiKeyStore.revokeApiKey(id);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [apiKeyStore]);

    return {
        loading,
        listApiKeys,
        createApiKey,
        revokeApiKey,
    };
};
