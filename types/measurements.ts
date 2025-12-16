/**
 * Type definitions for measurement-related data
 */

import { MeasurementType, Box } from '@/api/models/sensor';

/**
 * Measurement data mapping values to numbers or null
 */
export type MeasurementData = Record<string, number | null>;

/**
 * Measurement time data with typed structure
 */
export interface MeasurementTime<T> {
    time: string;
    data: T;
}

/**
 * Configuration for a measurement type
 */
export interface MeasurementTypeConfig {
    displayName: string;
    translationKey: string;
    unit: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: string;
    precision: number;
}

/**
 * Latest measurement info
 */
export interface LatestMeasurement {
    measurementType: string;
    value: number | null;
}

/**
 * Single measurement data point with time info
 */
export interface MeasurementDataPoint {
    label: string;
    value: number;
    fullDateTime: string;
}

/**
 * Dictionary of measurements indexed by measurement key
 */
export type MeasurementDictionary = Record<string, MeasurementDataPoint[]>;

/**
 * Measurement time entry from API response
 */
export interface MeasurementTimeEntry {
    time: string;
    measurements: MeasurementData;
}

/**
 * Box data with measurement times from API response
 */
export interface BoxWithMeasurements {
    measurementTimes: MeasurementTimeEntry[];
}

/**
 * Sensor data response structure from API
 */
export interface SensorDataResponse {
    boxes: BoxWithMeasurements[];
}
