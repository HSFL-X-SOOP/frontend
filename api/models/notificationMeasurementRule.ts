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
}