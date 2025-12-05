import { AxiosInstance } from 'axios';
import { BaseRepository } from './base.repository';
import { useMemo } from 'react';
import { useHttpClient } from '@/api/client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  MagicLinkRequest,
  MagicLinkLoginRequest,
  VerifyEmailRequest,
  GoogleLoginRequest,
} from '@/api/models/auth';

/**
 * Auth Repository
 * Handles all authentication-related API operations
 */
export class AuthRepository extends BaseRepository {
  constructor(httpClient: AxiosInstance) {
    super(httpClient);
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>(
      '/auth/login',
      credentials,
      'AuthRepository.login'
    );
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>(
      '/auth/register',
      data,
      'AuthRepository.register'
    );
  }

  /**
   * Request magic link for passwordless login
   */
  async requestMagicLink(data: MagicLinkRequest): Promise<void> {
    await this.post(
      '/auth/magic-link',
      data,
      'AuthRepository.requestMagicLink'
    );
  }

  /**
   * Login with magic link token
   */
  async loginWithMagicLink(data: MagicLinkLoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>(
      '/auth/magic-link/login',
      data,
      'AuthRepository.loginWithMagicLink'
    );
  }

  /**
   * Verify email address
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<void> {
    await this.post(
      '/auth/verify-email',
      data,
      'AuthRepository.verifyEmail'
    );
  }

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle(data: GoogleLoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>(
      '/auth/google/login',
      data,
      'AuthRepository.loginWithGoogle'
    );
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    return this.post<LoginResponse>(
      '/auth/refresh',
      { refreshToken },
      'AuthRepository.refreshToken'
    );
  }

  /**
   * Logout (invalidate token on server if needed)
   */
  async logout(): Promise<void> {
    await this.post(
      '/auth/logout',
      {},
      'AuthRepository.logout'
    ).catch(() => {
      // Logout failure should not throw - just clear local storage
    });
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await this.post(
      '/auth/password-reset/request',
      { email },
      'AuthRepository.requestPasswordReset'
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.post(
      '/auth/password-reset',
      { token, newPassword },
      'AuthRepository.resetPassword'
    );
  }
}

/**
 * Hook to use AuthRepository
 * Memoizes repository instance based on httpClient
 */
export const useAuthRepository = () => {
  const httpClient = useHttpClient();
  return useMemo(
    () => new AuthRepository(httpClient),
    [httpClient]
  );
};
