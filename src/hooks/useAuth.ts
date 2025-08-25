// src/hooks/useAuth.ts
import * as AsyncHandler from "@/hooks/core/asyncHandler.ts";
import {
    LoginRequest,
    LoginResponse,
    MagicLinkLoginRequest,
    MagicLinkRequest,
    RegisterRequest,
    VerifyEmailRequest,
} from "@/api/models/auth.ts";
import {useAuthStore} from "@/api/stores/auth.ts";

export const useAuth = () => {
    const authStore = useAuthStore();

    const [register, registerStatus] =
        AsyncHandler.useAsync<[RegisterRequest], LoginResponse>(authStore.register);

    const [login, loginStatus] =
        AsyncHandler.useAsync<[LoginRequest], LoginResponse>(authStore.login);

    const [requestMagicLink, requestMagicLinkStatus] =
        AsyncHandler.useAsync<[MagicLinkRequest], void>(authStore.requestMagicLink);

    const [magicLinkLogin, magicLinkLoginStatus] =
        AsyncHandler.useAsync<[MagicLinkLoginRequest], LoginResponse>(authStore.magicLinkLogin);

    const [verifyEmail, verifyEmailStatus] =
        AsyncHandler.useAsync<[VerifyEmailRequest], void>(authStore.verifyEmail);

    const [sendVerificationEmail, sendVerificationEmailStatus] =
        AsyncHandler.useAsync<[], void>(authStore.sendVerificationEmail);

    return {
        register,
        registerStatus,

        login,
        loginStatus,

        requestMagicLink,
        requestMagicLinkStatus,

        magicLinkLogin,
        magicLinkLoginStatus,

        verifyEmail,
        verifyEmailStatus,

        sendVerificationEmail,
        sendVerificationEmailStatus,
    };
};
