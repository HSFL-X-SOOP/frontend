export interface RegisterUserDeviceRequest {
    fcmToken: string;
}

export interface RegisterUserDeviceResponse {
    id: number;
    fcmToken: string;
    userId: number;
}