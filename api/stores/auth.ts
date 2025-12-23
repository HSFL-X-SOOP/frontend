import {
    LoginRequest, LoginResponse, MagicLinkLoginRequest, MagicLinkCodeLoginRequest,
    MagicLinkRequest, RegisterRequest, VerifyEmailRequest, GoogleLoginRequest,
    AppleLoginRequest,
} from "@/api/models/auth.ts";
import { useHttpClient } from "@/api/client.ts";
import { api } from "@/utils/api";
import { Result } from "@/utils/errors";

export function useAuthStore() {
    const httpClient = useHttpClient();

    return {
        register: (body: RegisterRequest): Promise<Result<LoginResponse>> => {
            return api.requestSafe(
                httpClient.post<LoginResponse>("/register", body),
                'AuthStore:register'
            );
        },

        login: (body: LoginRequest): Promise<Result<LoginResponse>> => {

            return api.requestSafe(
                httpClient.post<LoginResponse>("/login", body),
                'AuthStore:login',
            );
        },

        requestMagicLink: (body: MagicLinkRequest): Promise<Result<void>> => {
            return api.requestSafe(
                httpClient.post<void>("/magic-link", body),
                'AuthStore:requestMagicLink'
            );
        },

        magicLinkLogin: (body: MagicLinkLoginRequest): Promise<Result<LoginResponse>> => {
            return api.requestSafe(
                httpClient.post<LoginResponse>("/magic-link/login", body),
                'AuthStore:magicLinkLogin'
            );
        },

        magicLinkCodeLogin: (body: MagicLinkCodeLoginRequest): Promise<Result<LoginResponse>> => {
            return api.requestSafe(
                httpClient.post<LoginResponse>("/magic-link/login/code", body),
                'AuthStore:magicLinkCodeLogin'
            );
        },

        verifyEmail: (body: VerifyEmailRequest): Promise<Result<void>> => {
            return api.requestSafe(
                httpClient.post<void>("/verify-email", body),
                'AuthStore:verifyEmail'
            );
        },

        sendVerificationEmail: (): Promise<Result<void>> => {
            return api.requestSafe(
                httpClient.post<void>("/send-verification-email"),
                'AuthStore:sendVerificationEmail'
            );
        },

        googleLogin: (body: GoogleLoginRequest): Promise<Result<LoginResponse>> => {
            return api.requestSafe(
                httpClient.post<LoginResponse>("/login/google/android", body),
                'AuthStore:googleLogin'
            );
        },

        appleLogin: (body: AppleLoginRequest): Promise<Result<LoginResponse>> => {
            return api.requestSafe(
                httpClient.post<LoginResponse>("/login/apple", body),
                'AuthStore:appleLogin'
            );
        },
    };
}
