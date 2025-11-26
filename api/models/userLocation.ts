export interface CreateOrUpdateUserLocationRequest {
    userId: number;
    locationId: number;
    sentHarborNotifications: boolean;
}

export interface CreateOrUpdateUserLocationResponse {
    id: number;
    userId: number;
    locationId: number;
    sentHarborNotifications: boolean;
    createdAt: string;
}

export interface DeleteUserLocationRequest {
    id: number;
}

export interface DeleteUserLocationResponse {
    id: number;
    userId: number;
    locationId: number;
    sentHarborNotifications: boolean;
    createdAt: string;
}

export interface UserLocation {
    id: number;
    userId: number;
    locationId: number;
    sentHarborNotifications: boolean;
    createdAt: string;
}