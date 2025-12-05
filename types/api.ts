import { AxiosError } from 'axios';

/**
 * Typed Axios error response format
 */
export interface ApiErrorResponse {
    message: string;
    code: string;
    statusCode?: number;
}

/**
 * Typed Axios error specifically for API responses
 */
export type AxiosErrorType = AxiosError<ApiErrorResponse>;
