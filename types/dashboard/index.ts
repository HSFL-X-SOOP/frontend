import { Animated, LayoutChangeEvent } from 'react-native';
import { ChartTimeRange } from '@/components/dashboard/chart/TimeRangeDropdown';
import { DetailedLocationDTO } from '@/api/models/location';
import { UserLocation } from '@/api/models/userLocation';
import { ChartDataPoint } from '@/types/chart';
import { LocationWithBoxes } from '@/api/models/sensor';
import { LatestMeasurement } from '@/api/models/sensor';

export type { ChartTimeRange, LayoutChangeEvent };

/**
 * Base props shared by all dashboard components
 */
export interface DashboardComponentProps {
  isDark: boolean;
  media: any;
  userID: number;
  isHarborMaster: boolean;
}

/**
 * Props for DashboardHeader component
 */
export interface DashboardHeaderProps extends DashboardComponentProps {
  locationImageUrl: string;
  harbourName: string;
  sensorLocations: Array<{ id: number; name: string }>;
  userLocation: UserLocation | undefined;
  marinaID: number | null;
  onCreateOrDeleteUserLocation: () => Promise<void>;
  onUpdateHarborNotifications: () => Promise<void>;
}

/**
 * Props for HarborInfoCard component
 */
export interface HarborInfoCardProps extends DashboardComponentProps {
  harbourName: string;
  detailedLocation: DetailedLocationDTO | null;
  showInfo: boolean;
  toggleInfo: () => void;
  handleInfoLayout: (event: LayoutChangeEvent) => void;
  infoHeight: Animated.Value;
}

/**
 * Props for CurrentMeasurements component
 */
export interface CurrentMeasurementsProps extends DashboardComponentProps {
  filteredMeasurements: LatestMeasurement[];
  latestTime: string;
  timeRange: ChartTimeRange;
  marinaID: number | null;
  userLocation: UserLocation | undefined;
  onUpdateNotifications: () => Promise<void>;
}

/**
 * Props for HistoricalDataSection component
 */
export interface HistoricalDataSectionProps extends DashboardComponentProps {
  timeRange: ChartTimeRange;
  setTimeRange: (range: ChartTimeRange) => void;
  chartWaterTemperature: ChartDataPoint[];
  chartTide: ChartDataPoint[];
  chartWaveHeight: ChartDataPoint[];
  currentWaterTemp?: number;
  currentWaterLevel?: number;
  currentWaveHeight?: number;
}

/**
 * Return type for useDashboardData hook
 */
export interface DashboardData {
  // Marina ID
  marinaID: number | null;

  // UI State
  showInfo: boolean;
  infoContentHeight: number;
  infoHeight: Animated.Value;
  timeRange: ChartTimeRange;

  // Sensor Data
  allSensorData: LocationWithBoxes[];
  timeRangeData: LocationWithBoxes | null;
  detailedLocation: DetailedLocationDTO | null;
  userLocation: UserLocation | undefined;

  // Measurements
  filteredMeasurements: LatestMeasurement[];
  currentWaterTemp: number | undefined;
  currentWaveHeight: number | undefined;
  currentWaterLevel: number | undefined;
  chartWaterTemperature: ChartDataPoint[];
  chartTide: ChartDataPoint[];
  chartWaveHeight: ChartDataPoint[];

  // Sensor locations for navigation
  sensorLocations: Array<{ id: number; name: string }>;

  // Harbor info
  harbourName: string;
  locationImageUrl: string;
  latestTime: string;

  // Setters
  setShowInfo: (show: boolean) => void;
  setInfoContentHeight: (height: number) => void;
  setTimeRange: (range: ChartTimeRange) => void;
  setUserLocation: (location: UserLocation | undefined) => void;

  // Callbacks
  toggleInfo: () => void;
  handleInfoLayout: (event: LayoutChangeEvent) => void;
  createOrDeleteUserLocation: () => Promise<void>;
  updateUserLocationSentHarborNotifications: () => Promise<void>;
}
