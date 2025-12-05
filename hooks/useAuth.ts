import {
    LoginRequest,
    LoginResponse,
    MagicLinkLoginRequest,
    MagicLinkRequest,
    RegisterRequest,
    VerifyEmailRequest,
    GoogleLoginRequest,
    RegisterUserDeviceRequest,
    RegisterUserDeviceResponse,
} from "@/api/models/auth";
import { useAuthStore } from "@/api/stores/auth";
import * as AsyncHandler from "@/hooks/core/asyncHandler";

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

    const [googleLogin, googleLoginStatus] =
        AsyncHandler.useAsync<[GoogleLoginRequest], LoginResponse>(authStore.googleLogin);

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

        googleLogin,
        googleLoginStatus,
    };
};
