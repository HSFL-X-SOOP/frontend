export interface CreateUserLocationRequest {
    userId: number;
    locationId: number;
    sentHarborNotifications: boolean;
}

export interface CreateUserLocationResponse {
    id: number;
    userId: number;
    locationId: number;
    sentHarborNotifications: boolean;
    createdAt: string;
}