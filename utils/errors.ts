import { AxiosError } from 'axios';
import { createLogger } from './logger';

/**
 * Error codes for standardized error handling
 */
export enum ErrorCode {
    NETWORK = 'NETWORK',
    AUTH = 'AUTH',
    VALIDATION = 'VALIDATION',
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN'
}

/**
 * Unified error class for the application
 */
export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode?: number;
    public readonly originalError?: unknown;

    constructor(
        message: string,
        code: ErrorCode = ErrorCode.UNKNOWN,
        statusCode?: number,
        originalError?: unknown
    ) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.originalError = originalError;

        // Maintain proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, AppError.prototype);
    }

    /**
     * Check if this is a 404 (not found) error
     */
    isNotFound(): boolean {
        return this.statusCode === 404 || this.code === ErrorCode.NOT_FOUND;
    }

    /**
     * Check if this is an auth-related error (401/403)
     */
    isAuthError(): boolean {
        return this.code === ErrorCode.AUTH ||
               this.statusCode === 401 ||
               this.statusCode === 403;
    }

    /**
     * Check if this is a server error (5xx)
     */
    isServerError(): boolean {
        return this.code === ErrorCode.SERVER ||
               (this.statusCode ? this.statusCode >= 500 : false);
    }

    /**
     * Check if this is a network error
     */
    isNetworkError(): boolean {
        return this.code === ErrorCode.NETWORK;
    }
}

/**
 * Map HTTP status codes to error codes
 */
function mapStatusToErrorCode(status?: number): ErrorCode {
    if (!status) return ErrorCode.UNKNOWN;

    if (status === 400) return ErrorCode.VALIDATION;
    if (status === 401 || status === 403) return ErrorCode.AUTH;
    if (status === 404) return ErrorCode.NOT_FOUND;
    if (status === 409) return ErrorCode.CONFLICT;
    if (status >= 500) return ErrorCode.SERVER;

    return ErrorCode.UNKNOWN;
}

/**
 * Extract error message from various error types
 */
function extractErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        // Try to get message from API response first
        if (typeof error.response?.data === 'object' && error.response.data !== null) {
            const data = error.response.data as any;
            if (typeof data.message === 'string') {
                return data.message;
            }
            if (typeof data.error === 'string') {
                return data.error;
            }
        }
        return error.message || 'Network request failed';
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unknown error occurred';
}

/**
 * Centralized error handler for API calls
 * @param error - The error to handle
 * @param context - Context string for logging (e.g., component or function name)
 * @returns AppError instance
 */
export function handleApiError(error: unknown, context: string): AppError {
    const logger = createLogger(context);

    // Handle Axios errors
    if (error instanceof AxiosError) {
        const message = extractErrorMessage(error);
        const statusCode = error.response?.status;
        const errorCode = mapStatusToErrorCode(statusCode);

        logger.error('API Error', {
            status: statusCode,
            message,
            url: error.config?.url,
            method: error.config?.method
        });

        return new AppError(message, errorCode, statusCode, error);
    }

    // Handle regular errors
    if (error instanceof Error) {
        logger.error('Error', error.message);
        return new AppError(error.message, ErrorCode.UNKNOWN, undefined, error);
    }

    // Handle string errors
    if (typeof error === 'string') {
        logger.error('Error', error);
        return new AppError(error, ErrorCode.UNKNOWN, undefined, error);
    }

    // Handle unknown errors
    const unknownError = `Unknown error: ${JSON.stringify(error)}`;
    logger.error('Unknown Error', unknownError);
    return new AppError('An unknown error occurred', ErrorCode.UNKNOWN, undefined, error);
}

/**
 * Get user-friendly error message for UI display
 */
export function getErrorMessage(error: AppError | unknown): string {
    if (error instanceof AppError) {
        // For 404 errors, use a generic message
        if (error.isNotFound()) {
            return 'The requested resource was not found';
        }
        // For auth errors, don't expose details
        if (error.isAuthError()) {
            return 'You do not have permission to perform this action';
        }
        // For server errors
        if (error.isServerError()) {
            return 'Server error. Please try again later';
        }
        // Return the original message for other errors
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
}

/**
 * Utility type for Result pattern (success or error)
 */
export type Result<T, E = AppError> =
    | { ok: true; value: T }
    | { ok: false; error: E };

/**
 * Create a successful result
 */
export function Ok<T>(value: T): Result<T> {
    return { ok: true, value };
}

/**
 * Create a failed result
 */
export function Err<E>(error: E): Result<any, E> {
    return { ok: false, error };
}
