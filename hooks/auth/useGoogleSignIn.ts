import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useRouter} from 'expo-router';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {ENV} from '@/config/environment';
import {useAuth} from '@/hooks';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {AppError, UIError} from '@/utils/errors';

/**
 * Hook for Google Sign-In authentication
 *
 * Note: Errors are passed to onError callback
 */
export const useGoogleSignIn = () => {
    const router = useRouter();
    const {googleLogin} = useAuth();
    const {login: logUserIn} = useSession();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            GoogleSignin.configure({
                webClientId: ENV.googleWebClientId,
                iosClientId: Platform.OS === 'ios' ? ENV.googleIosClientId : undefined,
                offlineAccess: true,
            });
        }
    }, []);

    const handleGoogleSignIn = useCallback(async (
        redirectPath: '/map' | '/' = '/map',
        onSuccess: () => void,
        onError: (error: AppError) => void
    ) => {
        try {
            if (Platform.OS === 'web') {
                const loginUrl =
                    ENV.mode === 'dev' ? `${ENV.apiUrl}/login/google` : '/api/login/google';
                window.location.assign(loginUrl);
                return;
            }

            setIsLoading(true);

            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();

            const idToken = userInfo.data?.idToken;
            if (!idToken) {
                onError(new UIError('error.noTokenReceived'));
                setIsLoading(false);
                return;
            }

            await googleLogin(
                {idToken},
                (res) => {
                    logUserIn({
                        accessToken: res.accessToken,
                        refreshToken: res.refreshToken,
                        loggedInSince: new Date(),
                        lastTokenRefresh: null,
                        role: res.profile?.authorityRole ?? AuthorityRole.USER,
                        profile: res.profile,
                    });

                    // Check if user has a profile, if not redirect to create-profile
                    if (!res.profile || !res.profile.profileCreatedAt) {
                        router.push('/(profile)/create-profile');
                    } else {
                        router.push(redirectPath);
                    }
                    onSuccess();
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
    }, [googleLogin, logUserIn, router]);

    return {
        isLoading,
        handleGoogleSignIn
    };
};
