import {AxiosResponse} from 'axios';
import {handleApiError, Result, Ok, Err, APIError} from './errors';

/**
 * Utility for handling API requests with automatic error handling
 * Eliminates boilerplate try-catch blocks in stores and hooks
 */
export const api = {
    /**
     * Execute an API request with automatic error handling (throws on error)
     *
     * @param request - The axios request promise
     * @param context - Context string for error tracking (e.g., 'StoreName:methodName')
     * @returns The response data
     * @throws APIError with proper context
     *
     * @example
     * ```typescript
     * // In a store:
     * getUser: (id: number): Promise<User> => {
     *     return api.request(
     *         httpClient.get<User>(`/users/${id}`),
     *         'UserStore:getUser'
     *     );
     * }
     * ```
     */
    request: async <T>(
        request: Promise<AxiosResponse<T>>,
        context: string
    ): Promise<T> => {
        try {
            const response = await request;
            return response.data;
        } catch (error) {
            throw handleApiError(error, context);
        }
    },

    /**
     * Execute an API request that returns void with automatic error handling (throws on error)
     *
     * @param request - The axios request promise
     * @param context - Context string for error tracking
     * @throws APIError with proper context
     *
     * @example
     * ```typescript
     * // In a store:
     * deleteUser: (id: number): Promise<void> => {
     *     return api.requestVoid(
     *         httpClient.delete(`/users/${id}`),
     *         'UserStore:deleteUser'
     *     );
     * }
     * ```
     */
    requestVoid: async (
        request: Promise<AxiosResponse<void>>,
        context: string
    ): Promise<void> => {
        try {
            await request;
        } catch (error) {
            throw handleApiError(error, context);
        }
    },

    /**
     * Execute an API request with Result pattern (never throws)
     *
     * @param request - The axios request promise
     * @param context - Context string for error tracking
     * @returns Result<T, AppError> - Either { ok: true, value: T } or { ok: false, error: AppError }
     *
     * @example
     * ```typescript
     * // In a store or hook:
     * getUser: async (id: number): Promise<Result<User>> => {
     *     return api.requestSafe(
     *         httpClient.get<User>(`/users/${id}`),
     *         'UserStore:getUser'
     *     );
     * }
     *
     * // Usage:
     * const result = await store.getUser(123);
     * if (result.ok) {
     *     console.log('User:', result.value);
     * } else {
     *     console.error('Error:', result.error.message);
     * }
     * ```
     */
    requestSafe: async <T>(
        request: Promise<AxiosResponse<T>>,
        context: string,
    ): Promise<Result<T>> => {
        try {
            const response = await request;
            return Ok(response.data);
        } catch (error) {
            return Err(handleApiError(error, context));
        }
    },

    /**
     * Execute an API request returning void with Result pattern (never throws)
     *
     * @param request - The axios request promise
     * @param context - Context string for error tracking
     * @returns Result<void, AppError>
     *
     * @example
     * ```typescript
     * // In a store:
     * deleteUser: async (id: number): Promise<Result<void>> => {
     *     return api.requestVoidSafe(
     *         httpClient.delete(`/users/${id}`),
     *         'UserStore:deleteUser'
     *     );
     * }
     * ```
     */
    requestVoidSafe: async (
        request: Promise<AxiosResponse<void>>,
        context: string
    ): Promise<Result<void>> => {
        try {
            await request;
            return Ok(undefined);
        } catch (error) {
            return Err(handleApiError(error, context));
        }
    },

    /**
     * Unwraps a Result<T> to T, throwing the error if Result is Err
     * Use this to bridge Result pattern with code that expects thrown errors (e.g., AsyncHandler)
     *
     * @param resultPromise - Promise that resolves to Result<T>
     * @returns Promise<T> - The unwrapped value
     * @throws APIError if Result is Err
     *
     * @example
     * ```typescript
     * // Bridge Result pattern with AsyncHandler:
     * const [getProfile, getProfileStatus] = AsyncHandler.useAsync<[], UserProfile>(
     *     () => api.unwrapResult(userStore.getProfile())
     * );
     * ```
     */
    unwrapResult: async <T>(resultPromise: Promise<Result<T>>): Promise<T> => {
        const result = await resultPromise;
        if (result.ok) {
            return result.value;
        } else {
            throw result.error;
        }
    }
};
