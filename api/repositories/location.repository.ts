import { AxiosInstance } from 'axios';
import { BaseRepository } from './base.repository';
import { DetailedLocationDTO, UpdateLocationRequest } from '@/api/models/location';
import { useMemo } from 'react';
import { useHttpClient } from '@/api/client';

/**
 * Location Repository
 * Handles all location-related API operations
 * Separates data access logic from components
 */
export class LocationRepository extends BaseRepository {
  constructor(httpClient: AxiosInstance) {
    super(httpClient);
  }

  /**
   * Get all locations
   */
  async getAllLocations(): Promise<DetailedLocationDTO[]> {
    const data = await this.get<DetailedLocationDTO[]>(
      '/locations',
      'LocationRepository.getAllLocations'
    );
    return data || [];
  }

  /**
   * Get location by ID
   */
  async getLocationById(id: number): Promise<DetailedLocationDTO | null> {
    return this.get<DetailedLocationDTO>(
      `/location/${id}`,
      'LocationRepository.getLocationById'
    );
  }

  /**
   * Get harbor master location (for users with authority role)
   */
  async getHarborMasterLocation(): Promise<DetailedLocationDTO | null> {
    return this.get<DetailedLocationDTO>(
      '/location/harbormaster',
      'LocationRepository.getHarborMasterLocation'
    );
  }

  /**
   * Get location info with detailed data
   */
  async getLocationInfo(id: number): Promise<DetailedLocationDTO | null> {
    return this.get<DetailedLocationDTO>(
      `/location/${id}/info`,
      'LocationRepository.getLocationInfo'
    );
  }

  /**
   * Update location information
   */
  async updateLocation(
    id: number,
    data: UpdateLocationRequest
  ): Promise<DetailedLocationDTO> {
    return this.put<DetailedLocationDTO>(
      `/location/${id}`,
      data,
      'LocationRepository.updateLocation'
    );
  }

  /**
   * Delete location
   */
  async deleteLocation(id: number): Promise<void> {
    await this.delete(
      `/location/${id}`,
      'LocationRepository.deleteLocation'
    );
  }

  /**
   * Get location image
   */
  getLocationImageUrl(locationId: number): string {
    return `${this.httpClient.defaults.baseURL}/location/${locationId}/image`;
  }
}

/**
 * Hook to use LocationRepository
 * Memoizes repository instance based on httpClient
 */
export const useLocationRepository = () => {
  const httpClient = useHttpClient();
  return useMemo(
    () => new LocationRepository(httpClient),
    [httpClient]
  );
};
