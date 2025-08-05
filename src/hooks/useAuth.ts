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

    const [doRegister, registerStatus] =
        AsyncHandler.useAsync<[RegisterRequest], LoginResponse>(authStore.register);

    const [doLogin, loginStatus] =
        AsyncHandler.useAsync<[LoginRequest], LoginResponse>(authStore.login);

    const [doRequestML, requestMagicLinkStatus] =
        AsyncHandler.useAsync<[MagicLinkRequest], void>(authStore.requestMagicLink);

    const [doMagicLinkLogin, magicLinkLoginStatus] =
        AsyncHandler.useAsync<[MagicLinkLoginRequest], LoginResponse>(authStore.magicLinkLogin);

    const [doVerifyEmail, verifyEmailStatus] =
        AsyncHandler.useAsync<[VerifyEmailRequest], void>(authStore.verifyEmail);

    const [doSendVerificationEmail, sendVerificationEmailStatus] =
        AsyncHandler.useAsync<[], void>(authStore.sendVerificationEmail);

    return {
        register: doRegister,
        registerStatus,

        login: doLogin,
        loginStatus,

        requestMagicLink: doRequestML,
        requestMagicLinkStatus,

        magicLinkLogin: doMagicLinkLogin,
        magicLinkLoginStatus,

        verifyEmail: doVerifyEmail,
        verifyEmailStatus,

        sendVerificationEmail: doSendVerificationEmail,
        sendVerificationEmailStatus,
    };
};
