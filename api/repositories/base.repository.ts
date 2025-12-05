import { AxiosInstance } from 'axios';
import { handleApiError, AppError } from '@/utils/errors';

/**
 * Base Repository class for all API repositories
 * Provides common error handling and HTTP client access
 */
export abstract class BaseRepository {
  constructor(protected httpClient: AxiosInstance) {}

  /**
   * Handle API errors in a consistent way
   */
  protected handleError(error: unknown, context: string): AppError {
    return handleApiError(error, context);
  }

  /**
   * Get request with error handling
   */
  protected async get<T>(url: string, context: string): Promise<T | null> {
    try {
      const response = await this.httpClient.get<T>(url);
      return response.data;
    } catch (error) {
      const appError = this.handleError(error, context);
      if (appError.isNotFound?.()) {
        return null;
      }
      throw appError;
    }
  }

  /**
   * Post request with error handling
   */
  protected async post<T>(url: string, data: any, context: string): Promise<T> {
    try {
      const response = await this.httpClient.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, context);
    }
  }

  /**
   * Put request with error handling
   */
  protected async put<T>(url: string, data: any, context: string): Promise<T> {
    try {
      const response = await this.httpClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, context);
    }
  }

  /**
   * Delete request with error handling
   */
  protected async delete<T>(url: string, context: string): Promise<T | null> {
    try {
      const response = await this.httpClient.delete<T>(url);
      return response.data;
    } catch (error) {
      const appError = this.handleError(error, context);
      if (appError.isNotFound?.()) {
        return null;
      }
      throw appError;
    }
  }
}
