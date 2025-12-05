import { Box } from "@/api/models/sensor";
import { LatestMeasurement, MeasurementDictionary } from "@/types/measurement";
import { Activity, Battery, HelpCircle, Thermometer, Waves } from "@tamagui/lucide-icons";
import { formatTimeToLocal } from "@/utils/time";
import { MeasurementType } from "@/api/models/notificationMeasurementRule";

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
    data: any,
    timeRange: string
): MeasurementDictionary => {
    if (!data?.boxes?.[0]?.measurementTimes) return {};

    const measurementTimes = data.boxes[0].measurementTimes;
    const measurementDict: MeasurementDictionary = {};

    measurementTimes.forEach((entry: any) => {
        if (!entry.time) return;

        // Show time (HH:mm) only for today and yesterday
        // Show date (dd.MM) for all other ranges (7 days, 30 days, 90 days, 180 days, 1 year)
        const showTimeOnly = timeRange === 'today' || timeRange === 'yesterday';

        const label = showTimeOnly
            ? formatTimeToLocal(entry.time, 'HH:mm')
            : formatTimeToLocal(entry.time, 'dd.MM');

        const fullDateTime = showTimeOnly
            ? formatTimeToLocal(entry.time, 'HH:mm - dd.MM.yyyy')
            : formatTimeToLocal(entry.time, 'dd.MM.yyyy HH:mm');

        Object.entries(entry.measurements || {}).forEach(([key, value]) => {
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


export const getTextFromMeasurementType = (measurementType: string, t: any): string => {
    switch (measurementType) {
        case "Wave Height":
            return t('dashboard.measurements.waveHeight');
        case "Temperature, water":
        case "WTemp":
            return t('dashboard.measurements.waterTemperature');
        case "Tide":
            return t('dashboard.measurements.waterLevel');
        case "Battery, voltage":
            return t('dashboard.measurements.batteryVoltage');
        default:
            return measurementType;
    }
};

export const getIDFromMeasurementType = (measurementType: string): number => {
    switch (measurementType) {
        case "Wave Height":
            return MeasurementType.WaveHeight;
        case "Temperature, water":
        case "WTemp":
            return MeasurementType.WaterTemperature;
        case "Tide":
            return MeasurementType.Tide;
        case "Battery, voltage":
            return MeasurementType.BatteryVoltage;
        default:
            return 0;
    }
};

export const getMeasurementTypeSymbol = (measurementType: string, t: any): string => {
    switch (measurementType) {
        case "Wave Height":
            return t('dashboard.units.centimeters');
        case "Temperature, water":
        case "WTemp":
            return t('dashboard.units.celsius');
        case "Tide":
            return t('dashboard.units.centimeters');
        case "Battery, voltage":
            return t('dashboard.units.volts');
        default:
            return "";
    }
};

export const formatMeasurementValue = (value: number): string => {
    return value < 1 ? value.toFixed(2) : value.toFixed(1);
};