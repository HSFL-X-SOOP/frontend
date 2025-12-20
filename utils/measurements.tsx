import { Box } from "@/api/models/sensor";
import { LatestMeasurement, MeasurementDictionary } from "@/types/measurements";
import { Activity, Battery, HelpCircle, Thermometer, Waves } from "@tamagui/lucide-icons";
import { formatTimeToLocal } from "@/utils/time";
import { MeasurementType } from "@/api/models/notificationMeasurementRule";
import type { TFunction } from 'i18next';

export const getLatestMeasurements = (boxes: Box[]): LatestMeasurement[] => {
    const measurements: LatestMeasurement[] = [];

    boxes.forEach((box) => {
        if (box.measurementTimes.length === 0) return;

        const latestTime = box.measurementTimes[0];
        const measurementData = latestTime.measurements;

        Object.entries(measurementData).forEach(([key, value]) => {
            let measurementType;

            switch (key) {
                case 'waterTemperature':
                    measurementType = 'Temperature, water';
                    break;
                case 'waveHeight':
                    measurementType = 'Wave Height';
                    break;
                case 'tide':
                    measurementType = 'Tide';
                    break;
                case 'standardDeviation':
                    measurementType = 'Standard deviation';
                    break;
                case 'batteryVoltage':
                    measurementType = 'Battery, voltage';
                    break;
                case 'airTemperature':
                    measurementType = 'Temperature, air';
                    break;
                case 'windSpeed':
                    measurementType = 'Wind Speed';
                    break;
                case 'windDirection':
                    measurementType = 'Wind Direction';
                    break;
                case 'gustSpeed':
                    measurementType = 'Gust Speed';
                    break;
                case 'gustDirection':
                    measurementType = 'Gust Direction';
                    break;
                case 'humidity':
                    measurementType = 'Humidity';
                    break;
                case 'airPressure':
                    measurementType = 'Air Pressure';
                    break;
                default:
                    measurementType = key;
            }

            measurements.push({
                measurementType,
                value: typeof value === 'number' ? value : Number(value)
            });
        });
    });

    return measurements;
}

export const createMeasurementDictionary = (
    data: unknown,
    timeRange: string
): MeasurementDictionary => {
    if (!(data && typeof data === 'object' && 'boxes' in data)) return {};

    const boxedData = data as any; // Safe after type guard
    if (!boxedData?.boxes?.[0]?.measurementTimes) return {};

    const measurementTimes = boxedData.boxes[0].measurementTimes;
    const measurementDict: MeasurementDictionary = {};

    measurementTimes.forEach((entry: unknown) => {
        const entryData = entry as any; // Safe cast after forEach
        if (!entryData?.time) return;

        // Show time (HH:mm) only for today and yesterday
        // Show date (dd.MM) for all other ranges (7 days, 30 days, 90 days, 180 days, 1 year)
        const showTimeOnly = timeRange === 'today' || timeRange === 'yesterday';

        const label = showTimeOnly
            ? formatTimeToLocal(entryData.time, 'HH:mm')
            : formatTimeToLocal(entryData.time, 'dd.MM');

        const fullDateTime = showTimeOnly
            ? formatTimeToLocal(entryData.time, 'HH:mm - dd.MM.yyyy')
            : formatTimeToLocal(entryData.time, 'dd.MM.yyyy HH:mm');

        Object.entries(entryData.measurements || {}).forEach(([key, value]) => {
            if (!measurementDict[key]) {
                measurementDict[key] = [];
            }
            measurementDict[key].push({
                label,
                value: Number(value),
                fullDateTime
            });
        });
    });

    return measurementDict;
}


export const getMeasurementColor = (measurementType: string): string => {
    switch (measurementType) {
        case "Wave Height":
            return "#10B981";
        case "Temperature, water":
        case "WTemp":
            return "#F97316";
        case "Tide":
            return "#3B82F6";
        case "Battery, voltage":
            return "#EAB308";
        default:
            return "#6B7280";
    }
};

export const getMeasurementIcon = (measurementType: string, size: number = 24) => {
    const color = getMeasurementColor(measurementType);
    const props = {size, color};
    switch (measurementType) {
        case "Wave Height":
            return <Waves {...props}/>;
        case "Temperature, water":
        case "WTemp":
            return <Thermometer {...props}/>;
        case "Tide":
            return <Activity {...props}/>;
        case "Battery, voltage":
            return <Battery {...props}/>;
        default:
            return <HelpCircle {...props}/>;
    }
};

export const getIconBackground = (measurementType: string): string => {
    switch (measurementType) {
        case "Wave Height":
            return "$green5";
        case "Temperature, water":
        case "WTemp":
            return "$orange5";
        case "Tide":
            return "$blue5";
        case "Battery, voltage":
            return "$yellow5";
        default:
            return "$gray5";
    }
};


export const getTextFromMeasurementType = (measurementType: string, t: TFunction): string => {
    switch (measurementType) {
        case "Wave Height":
        case "-1705811922":
            return t('dashboard.measurements.waveHeight');
        case "Temperature, water":
        case "WTemp":
        case "1603253327":
            return t('dashboard.measurements.waterTemperature');
        case "Tide":
        case "2606550":
            return t('dashboard.measurements.waterLevel');
        case "Battery, voltage":
        case "182132765":
            return t('dashboard.measurements.batteryVoltage');
        default:
            return measurementType;
    }
};

export const getIDFromMeasurementType = (measurementType: string): number => {
    switch (measurementType) {
        case "Wave Height":
        case "-1705811922":
            return MeasurementType.WaveHeight;
        case "Temperature, water":
        case "WTemp":
        case "1603253327":
            return MeasurementType.WaterTemperature;
        case "Tide":
        case "2606550":
            return MeasurementType.Tide;
        case "Battery, voltage":
        case "182132765":
            return MeasurementType.BatteryVoltage;
        default:
            return 0;
    }
};

export const getMeasurementTypeSymbol = (measurementType: string, t: TFunction): string => {
    switch (measurementType) {
        case "Wave Height":
        case "-1705811922":
            return t('dashboard.units.centimeters');
        case "Temperature, water":
        case "WTemp":
        case "1603253327":
            return t('dashboard.units.celsius');
        case "Tide":
        case "2606550":
            return t('dashboard.units.centimeters');
        case "Battery, voltage":
        case "182132765":
            return t('dashboard.units.volts');
        default:
            return "";
    }
};


export const formatMeasurementValue = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
        return '0.0';
    }
    return value < 1 ? value.toFixed(2) : value.toFixed(1);
};