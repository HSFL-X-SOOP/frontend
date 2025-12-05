import {
    LoginRequest, LoginResponse, MagicLinkLoginRequest,
    MagicLinkRequest, RegisterRequest, VerifyEmailRequest, GoogleLoginRequest,
    AppleLoginRequest,
} from "@/api/models/auth.ts";
import { useHttpClient } from "@/api/client.ts";

export function useAuthStore() {
    const httpClient = useHttpClient();

    return {
        register: (body: RegisterRequest) =>
            httpClient.post<LoginResponse>("/register", body).then(r => r.data),

        login: (body: LoginRequest) =>
            httpClient.post<LoginResponse>("/login", body).then(r => r.data),

        requestMagicLink: (body: MagicLinkRequest) =>
            httpClient.post<void>("/magic-link", body).then(r => r.data),

        magicLinkLogin: (body: MagicLinkLoginRequest) =>
            httpClient.post<LoginResponse>("/magic-link/login", body).then(r => r.data),

        verifyEmail: (body: VerifyEmailRequest) =>
            httpClient.post<void>("/verify-email", body).then(r => r.data),

        sendVerificationEmail: () =>
            httpClient.post<void>("/send-verification-email").then(r => r.data),

        googleLogin: (body: GoogleLoginRequest) =>
            httpClient.post<LoginResponse>("/login/google/android", body).then(r => r.data),

        appleLogin: (body: AppleLoginRequest) =>
            httpClient.post<LoginResponse>("/login/apple", body).then(r => r.data),
    };
}
