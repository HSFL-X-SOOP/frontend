import { AxiosInstance } from 'axios';
import { BaseRepository } from './base.repository';
import { UserProfile, UpdateProfileRequest } from '@/api/models/profile';
import { useMemo } from 'react';
import { useHttpClient } from '@/api/client';

/**
 * User Repository
 * Handles all user profile and account-related API operations
 */
export class UserRepository extends BaseRepository {
  constructor(httpClient: AxiosInstance) {
    super(httpClient);
  }

  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    return this.get<UserProfile>(
      '/user/profile',
      'UserRepository.getCurrentProfile'
    );
  }

  /**
   * Get user profile by ID
   */
  async getUserProfileById(userId: number): Promise<UserProfile | null> {
    return this.get<UserProfile>(
      `/user/${userId}/profile`,
      'UserRepository.getUserProfileById'
    );
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return this.put<UserProfile>(
      '/user/profile',
      data,
      'UserRepository.updateProfile'
    );
  }

  /**
   * Change user password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await this.post(
      '/user/password/change',
      { currentPassword, newPassword },
      'UserRepository.changePassword'
    );
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    await this.delete(
      '/user/account',
      'UserRepository.deleteAccount'
    );
  }

  /**
   * Get user's saved locations
   */
  async getSavedLocations(): Promise<any[]> {
    const data = await this.get<any[]>(
      '/user/locations',
      'UserRepository.getSavedLocations'
    );
    return data || [];
  }

  /**
   * Save a location for the user
   */
  async saveLocation(locationId: number): Promise<void> {
    await this.post(
      '/user/locations',
      { locationId },
      'UserRepository.saveLocation'
    );
  }

  /**
   * Remove a saved location
   */
  async removeSavedLocation(locationId: number): Promise<void> {
    await this.delete(
      `/user/locations/${locationId}`,
      'UserRepository.removeSavedLocation'
    );
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<any> {
    return this.get(
      '/user/preferences',
      'UserRepository.getPreferences'
    );
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: any): Promise<any> {
    return this.put(
      '/user/preferences',
      preferences,
      'UserRepository.updatePreferences'
    );
  }
}

/**
 * Hook to use UserRepository
 * Memoizes repository instance based on httpClient
 */
export const useUserRepository = () => {
  const httpClient = useHttpClient();
  return useMemo(
    () => new UserRepository(httpClient),
    [httpClient]
  );
};
