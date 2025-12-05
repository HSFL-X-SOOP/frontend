import { AxiosInstance } from 'axios';
import { BaseRepository } from './base.repository';
import { LocationWithBoxes } from '@/api/models/sensor';
import { ChartDataPoint } from '@/types/chart';
import { useMemo } from 'react';
import { useHttpClient } from '@/api/client';

/**
 * Sensor Repository
 * Handles all sensor data and measurement-related API operations
 */
export class SensorRepository extends BaseRepository {
  constructor(httpClient: AxiosInstance) {
    super(httpClient);
  }

  /**
   * Get all sensor data (current measurements)
   */
  async getSensorDataNew(): Promise<LocationWithBoxes[]> {
    const data = await this.get<LocationWithBoxes[]>(
      '/sensors/new',
      'SensorRepository.getSensorDataNew'
    );
    return data || [];
  }

  /**
   * Get sensor data for a specific time range
   * @param locationId - Location/sensor ID
   * @param timeRange - Time range string (e.g., '24h', '7d', '30d')
   */
  async getSensorDataTimeRange(
    locationId: number,
    timeRange: string
  ): Promise<LocationWithBoxes | null> {
    return this.get<LocationWithBoxes>(
      `/sensors/${locationId}/${timeRange}`,
      'SensorRepository.getSensorDataTimeRange'
    );
  }

  /**
   * Get chart data for a specific measurement
   * @param locationId - Location/sensor ID
   * @param measurementType - Type of measurement
   * @param timeRange - Time range string
   */
  async getChartData(
    locationId: number,
    measurementType: string,
    timeRange: string
  ): Promise<ChartDataPoint[]> {
    const data = await this.get<ChartDataPoint[]>(
      `/sensors/${locationId}/chart/${measurementType}/${timeRange}`,
      'SensorRepository.getChartData'
    );
    return data || [];
  }

  /**
   * Get historical data for location
   * @param locationId - Location ID
   * @param from - Start date (ISO string)
   * @param to - End date (ISO string)
   */
  async getHistoricalData(
    locationId: number,
    from: string,
    to: string
  ): Promise<LocationWithBoxes | null> {
    return this.get<LocationWithBoxes>(
      `/sensors/${locationId}/history?from=${from}&to=${to}`,
      'SensorRepository.getHistoricalData'
    );
  }

  /**
   * Get sensor by ID
   */
  async getSensorById(sensorId: number): Promise<LocationWithBoxes | null> {
    return this.get<LocationWithBoxes>(
      `/sensors/${sensorId}`,
      'SensorRepository.getSensorById'
    );
  }

  /**
   * Register sensor device
   */
  async registerSensorDevice(data: any): Promise<any> {
    return this.post(
      '/sensors/device/register',
      data,
      'SensorRepository.registerSensorDevice'
    );
  }
}

/**
 * Hook to use SensorRepository
 * Memoizes repository instance based on httpClient
 */
export const useSensorRepository = () => {
  const httpClient = useHttpClient();
  return useMemo(
    () => new SensorRepository(httpClient),
    [httpClient]
  );
};
