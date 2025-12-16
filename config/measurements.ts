import {
    Waves,
    Thermometer,
    Activity,
    Battery,
    Wind,
    Compass,
    Droplets,
    Gauge,
    HelpCircle
} from '@tamagui/lucide-icons';
import type {ComponentType} from 'react';
import type {IconProps} from '@tamagui/helpers-icon';
import {MeasurementType} from '@/api/models/notificationMeasurementRule';

/**
 * Consolidated measurement type configuration
 * Replaces 200+ lines of duplicate switch statements across multiple files
 */

export interface MeasurementTypeConfig {
    // Display
    displayName: string; // "Temperature, water"
    translationKey: string; // 'dashboard.measurements.waterTemperature'
    shortName?: string; // "WTemp"

    // Styling
    color: string; // Hex color or Tamagui token
    bgColor: string; // Background color (Tamagui token or hex)
    borderColor?: string; // Border color (optional)

    // Icon
    icon: ComponentType<IconProps>;
    iconColor?: string; // Optional override for icon color

    // Units
    unit: string; // '°C', 'cm', 'V', etc.
    unitTranslationKey: string; // 'dashboard.units.celsius'

    // API
    measurementTypeId: MeasurementType;

    // Data formatting
    precision?: number; // Decimal places (default: 1)
}

/**
 * Measurement configuration by camelCase key
 * Used by MapSensorMeasurements.tsx and other components
 */
export const MEASUREMENT_CONFIG: Record<string, MeasurementTypeConfig> = {
    waterTemperature: {
        displayName: 'Temperature, water',
        translationKey: 'sensor.waterTemperature',
        shortName: 'WTemp',
        color: '#F97316', // orange
        bgColor: '$orange5',
        borderColor: '$orange7',
        icon: Thermometer,
        unit: '°C',
        unitTranslationKey: 'dashboard.units.celsius',
        measurementTypeId: MeasurementType.WaterTemperature,
        precision: 1,
    },
    waveHeight: {
        displayName: 'Wave Height',
        translationKey: 'sensor.waveHeight',
        color: '#10B981', // green
        bgColor: '$green5',
        borderColor: '$green7',
        icon: Waves,
        unit: 'cm',
        unitTranslationKey: 'dashboard.units.centimeters',
        measurementTypeId: MeasurementType.WaveHeight,
        precision: 1,
    },
    tide: {
        displayName: 'Tide',
        translationKey: 'sensor.waterLevel',
        color: '#3B82F6', // blue
        bgColor: '$blue5',
        borderColor: '$blue7',
        icon: Activity,
        unit: 'cm',
        unitTranslationKey: 'dashboard.units.centimeters',
        measurementTypeId: MeasurementType.Tide,
        precision: 1,
    },
    waterLevel: {
        displayName: 'Tide',
        translationKey: 'sensor.waterLevel',
        color: '#3B82F6', // blue
        bgColor: '$blue5',
        borderColor: '$blue7',
        icon: Activity,
        unit: 'cm',
        unitTranslationKey: 'dashboard.units.centimeters',
        measurementTypeId: MeasurementType.Tide,
        precision: 1,
    },
    batteryVoltage: {
        displayName: 'Battery, voltage',
        translationKey: 'sensor.batteryVoltage',
        color: '#EAB308', // yellow
        bgColor: '$yellow5',
        borderColor: '$yellow7',
        icon: Battery,
        unit: 'V',
        unitTranslationKey: 'dashboard.units.volts',
        measurementTypeId: MeasurementType.BatteryVoltage,
        precision: 2,
    },
    airTemperature: {
        displayName: 'Temperature, air',
        translationKey: 'sensor.airTemperature',
        color: '$red10',
        bgColor: '$red4',
        borderColor: '$red7',
        icon: Thermometer,
        unit: '°C',
        unitTranslationKey: 'dashboard.units.celsius',
        measurementTypeId: MeasurementType.AirTemperature,
        precision: 1,
    },
    windSpeed: {
        displayName: 'Wind Speed',
        translationKey: 'sensor.windSpeed',
        color: '$green10',
        bgColor: '$green4',
        borderColor: '$green7',
        icon: Wind,
        unit: 'm/s',
        unitTranslationKey: 'dashboard.units.metersPerSecond',
        measurementTypeId: MeasurementType.WindSpeed,
        precision: 1,
    },
    windDirection: {
        displayName: 'Wind Direction',
        translationKey: 'sensor.windDirection',
        color: '$purple10',
        bgColor: '$purple4',
        borderColor: '$purple7',
        icon: Compass,
        unit: '°',
        unitTranslationKey: 'dashboard.units.degrees',
        measurementTypeId: MeasurementType.WindDirection,
        precision: 0,
    },
    gustSpeed: {
        displayName: 'Gust Speed',
        translationKey: 'sensor.gustSpeed',
        color: '$cyan10',
        bgColor: '$cyan4',
        borderColor: '$cyan7',
        icon: Wind,
        unit: 'm/s',
        unitTranslationKey: 'dashboard.units.metersPerSecond',
        measurementTypeId: MeasurementType.GustWindSpeed,
        precision: 1,
    },
    gustDirection: {
        displayName: 'Gust Direction',
        translationKey: 'sensor.gustDirection',
        color: '$pink10',
        bgColor: '$pink4',
        borderColor: '$pink7',
        icon: Compass,
        unit: '°',
        unitTranslationKey: 'dashboard.units.degrees',
        measurementTypeId: MeasurementType.GustWindDirection,
        precision: 0,
    },
    humidity: {
        displayName: 'Humidity',
        translationKey: 'sensor.humidity',
        color: '$blue10',
        bgColor: '$blue4',
        borderColor: '$blue7',
        icon: Droplets,
        unit: '%',
        unitTranslationKey: 'dashboard.units.percent',
        measurementTypeId: MeasurementType.Humidity,
        precision: 0,
    },
    airPressure: {
        displayName: 'Air Pressure',
        translationKey: 'sensor.airPressure',
        color: '$gray10',
        bgColor: '$gray4',
        borderColor: '$gray7',
        icon: Gauge,
        unit: 'hPa',
        unitTranslationKey: 'dashboard.units.hectopascals',
        measurementTypeId: MeasurementType.StationPressure,
        precision: 0,
    },
    standardDeviation: {
        displayName: 'Standard deviation',
        translationKey: 'sensor.standardDeviation',
        color: '$gray10',
        bgColor: '$gray4',
        borderColor: '$gray7',
        icon: Activity,
        unit: '',
        unitTranslationKey: 'dashboard.units.none',
        measurementTypeId: MeasurementType.StandartDeviation,
        precision: 2,
    },
} as const;

/**
 * Alias map for alternative measurement names
 * Maps old/alternative names to the canonical key
 */
export const MEASUREMENT_ALIASES: Record<string, string> = {
    'Temperature, water': 'waterTemperature',
    'WTemp': 'waterTemperature',
    'Wave Height': 'waveHeight',
    'Tide': 'tide',
    'Battery, voltage': 'batteryVoltage',
    'Temperature, air': 'airTemperature',
    'Wind Speed': 'windSpeed',
    'Wind Direction': 'windDirection',
    'Gust Speed': 'gustSpeed',
    'Gust Direction': 'gustDirection',
    'Humidity': 'humidity',
    'Air Pressure': 'airPressure',
    'Standard deviation': 'standardDeviation',
} as const;

/**
 * Helper functions to access measurement configuration
 */

/**
 * Get measurement configuration by key (supports aliases)
 */
export function getMeasurementConfig(key: string): MeasurementTypeConfig | undefined {
    // Try direct lookup first
    if (key in MEASUREMENT_CONFIG) {
        return MEASUREMENT_CONFIG[key];
    }

    // Try alias lookup
    const canonicalKey = MEASUREMENT_ALIASES[key];
    if (canonicalKey) {
        return MEASUREMENT_CONFIG[canonicalKey];
    }

    return undefined;
}

/**
 * Get measurement color
 */
export function getMeasurementColor(key: string): string {
    return getMeasurementConfig(key)?.color ?? '#6B7280';
}

/**
 * Get measurement background color
 */
export function getMeasurementBgColor(key: string): string {
    return getMeasurementConfig(key)?.bgColor ?? '$gray5';
}

/**
 * Get measurement icon component
 */
export function getMeasurementIcon(key: string): ComponentType<IconProps> {
    return getMeasurementConfig(key)?.icon ?? HelpCircle;
}

/**
 * Get measurement unit
 */
export function getMeasurementUnit(key: string): string {
    return getMeasurementConfig(key)?.unit ?? '';
}

/**
 * Get measurement display name
 */
export function getMeasurementDisplayName(key: string): string {
    return getMeasurementConfig(key)?.displayName ?? key;
}

/**
 * Get measurement translation key
 */
export function getMeasurementTranslationKey(key: string): string {
    return getMeasurementConfig(key)?.translationKey ?? '';
}

/**
 * Get measurement type ID (for API calls)
 */
export function getMeasurementTypeId(key: string): MeasurementType | undefined {
    return getMeasurementConfig(key)?.measurementTypeId;
}

/**
 * Default measurement configuration for unknown types
 */
export const DEFAULT_MEASUREMENT_CONFIG: MeasurementTypeConfig = {
    displayName: 'Unknown',
    translationKey: 'sensor.unknown',
    color: '#6B7280',
    bgColor: '$gray5',
    borderColor: '$gray7',
    icon: HelpCircle,
    unit: '',
    unitTranslationKey: 'dashboard.units.none',
    measurementTypeId: MeasurementType.BatteryVoltage, // Fallback
    precision: 1,
} as const;
