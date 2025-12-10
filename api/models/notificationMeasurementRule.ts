export interface CreateOrUpdateNotificationMeasurementRuleRequest {
    userId: number;
    locationId: number;
    measurementTypeId: number;
    operator: string;
    measurementValue: number;
    isActive: boolean;
}

export interface CreateOrUpdateNotificationMeasurementRuleResponse {
    id: number;
    userId: number;
    locationId: number;
    measurementTypeId: number;
    operator: string;
    measurementValue: number;
    isActive: boolean;
    createdAt: string;
}

export interface DeleteNotificationMeasurementRuleRequest {
    id: number;
}

export interface DeleteNotificationMeasurementRuleResponse {
    id: number;
    userId: number;
    locationId: number;
    measurementTypeId: number;
    operator: string;
    measurementValue: number;
    isActive: boolean;
    createdAt: string;
}

export interface NotificationMeasurementRule {
    id: number;
    userId: number;
    locationId: number;
    measurementTypeId: number;
    operator: string;
    measurementValue: number;
    isActive: boolean;
    createdAt: string;
    lastNotifiedAt: string;
}

export enum MeasurementType {
    BatteryVoltage = 182132765,
    WaterTemperature = 1603253327,
    Tide = 2606550,
    WaveHeight = -1705811922,
    StationPressure = 1831883729,
    StandartDeviation = 405072638,
    AirTemperature = -919021950,
    GustWindDirection = 1671856010,
    GustWindSpeed = -420673966,
    Humidity = 1541226835,
    WindDirection = 1570127239,
    WindSpeed = 1591441999

}