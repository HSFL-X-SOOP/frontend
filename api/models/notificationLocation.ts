export interface CreateOrUpdateNotificationLocationRequest {
    locationId: number;
    notificationTitle: string;
    notificationText: string;
    createdBy: number;
}

export interface CreateOrUpdateNotificationLocationResponse {
    id: number;
    locationId: number;
    notificationTitle: string;
    notificationText: string;
    createdBy: number;
}

export interface DeleteNotificationLocationRequest {
    id: number;
}

export interface DeleteNotificationLocationResponse {
    id: number;
    locationId: number;
    notificationTitle: string;
    notificationText: string;
    createdBy: number;
    createdAt: string;
}

export interface NotificationLocation {
    id: number;
    locationId: number;
    notificationTitle: string;
    notificationText: string;
    createdBy: number;
    createdAt: string;
}