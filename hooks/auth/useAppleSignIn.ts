import {useCallback, useState} from 'react';
import {Platform} from 'react-native';
import {type Href, useRouter} from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import {useAuth} from '@/hooks/auth';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {AppError, UIError} from '@/utils/errors';

/**
 * Hook for Apple Sign-In authentication
 *
 * Note: Errors are passed to onError callback
 */
export const useAppleSignIn = () => {
    const router = useRouter();
    const {appleLogin} = useAuth();
    const {login: logUserIn} = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleAppleSignIn = useCallback(async (
        redirectPath: Href,
        onSuccess: (userId: number | undefined) => void,
        onError: (error: AppError) => void
    ) => {
        try {
            if (Platform.OS !== 'ios') {
                onError(new UIError('error.platformNotSupported'));
                return;
            }

            setIsLoading(true);

            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            const identityToken = credential.identityToken;
            if (!identityToken) {
                onError(new UIError('error.noTokenReceived'));
                setIsLoading(false);
                return;
            }

            await appleLogin(
                {
                    identityToken,
                    user: credential.user,
                    email: credential.email ?? undefined,
                    givenName: credential.fullName?.givenName ?? undefined,
                    familyName: credential.fullName?.familyName ?? undefined,
                },
                (res) => {
                    logUserIn({
                        accessToken: res.accessToken,
                        refreshToken: res.refreshToken,
                        loggedInSince: new Date(),
                        lastTokenRefresh: null,
                        role: res.profile?.authorityRole ?? AuthorityRole.USER,
                        profile: res.profile,
                    });

                    if (!res.profile || !res.profile.profileCreatedAt) {
                        router.push('/(profile)/create-profile');
                    } else {
                        router.push(redirectPath);
                    }
                    onSuccess(res.profile?.id);
                },
                (error) => {
                    onError(error);
                }
            );
        } catch {
            onError(new UIError('error.signInFailed'));
        } finally {
            setIsLoading(false);
        }
    }, [appleLogin, logUserIn, router]);

    return {
        isLoading,
        handleAppleSignIn
    };
};
