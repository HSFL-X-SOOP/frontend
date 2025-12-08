import {UserProfile} from './profile';

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string | null;
    profile: UserProfile | null;
}

export interface RegisterUserDeviceRequest {
    fcmToken: string;
    userId: number;
}

export interface RegisterUserDeviceResponse {
    id: number;
    fcmToken: string;
    userId: number;
}

export interface MagicLinkLoginRequest {
    token: string;
}

export interface MagicLinkRequest {
    email: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface GoogleLoginRequest {
    idToken: string;
}

export interface AppleLoginRequest {
    identityToken: string;
    user?: string;
    email?: string;
    givenName?: string;
    familyName?: string;
}