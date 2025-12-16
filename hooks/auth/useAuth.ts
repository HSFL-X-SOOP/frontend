import {useCallback, useState} from "react";
import {
    LoginRequest,
    LoginResponse,
    MagicLinkLoginRequest,
    MagicLinkRequest,
    RegisterRequest,
    VerifyEmailRequest,
    GoogleLoginRequest,
    AppleLoginRequest,
} from "@/api/models/auth";
import {useAuthStore} from "@/api/stores/auth";
import {AppError} from "@/utils/errors";

/**
 * Hook for authentication operations with Result pattern
 *
 * Note: Errors are passed to onError callback
 */
export const useAuth = () => {
    const authStore = useAuthStore();
    const [loading, setLoading] = useState(false);

    const register = useCallback(async (
        body: RegisterRequest,
        onSuccess: (data: LoginResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await authStore.register(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [authStore]);

    const login = useCallback(async (
        body: LoginRequest,
        onSuccess: (data: LoginResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await authStore.login(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [authStore]);

    const requestMagicLink = useCallback(async (
        body: MagicLinkRequest,
        onSuccess: () => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await authStore.requestMagicLink(body);

        if (result.ok) {
            onSuccess();
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [authStore]);

    const magicLinkLogin = useCallback(async (
        body: MagicLinkLoginRequest,
        onSuccess: (data: LoginResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await authStore.magicLinkLogin(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [authStore]);

    const verifyEmail = useCallback(async (
        body: VerifyEmailRequest,
        onSuccess: () => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await authStore.verifyEmail(body);

        if (result.ok) {
            onSuccess();
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [authStore]);

    const sendVerificationEmail = useCallback(async (
        onSuccess: () => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await authStore.sendVerificationEmail();

        if (result.ok) {
            onSuccess();
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [authStore]);

    const googleLogin = useCallback(async (
        body: GoogleLoginRequest,
        onSuccess: (data: LoginResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await authStore.googleLogin(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [authStore]);

    const appleLogin = useCallback(async (
        body: AppleLoginRequest,
        onSuccess: (data: LoginResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await authStore.appleLogin(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [authStore]);

    return {
        loading,
        register,
        login,
        requestMagicLink,
        magicLinkLogin,
        verifyEmail,
        sendVerificationEmail,
        googleLogin,
        appleLogin,
    };
};
