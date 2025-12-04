export interface RegisterUserDeviceRequest {
    fcmToken: string;
    userId: number;
}

export interface RegisterUserDeviceResponse {
    id: number;
    fcmToken: string;
    userId: number;
}