import {Platform} from 'react-native';
import {useRouter} from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import {useAuth} from '@/hooks/useAuth';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {createLogger} from '@/utils/logger';

const logger = createLogger('Auth:AppleSignIn');

export const useAppleSignIn = () => {
    const router = useRouter();
    const {appleLogin, appleLoginStatus} = useAuth();
    const {login: logUserIn} = useSession();

    const handleAppleSignIn = async (redirectPath: '/map' | '/' = '/map') => {
        try {
            logger.info('Starting Apple Sign-In flow', {platform: Platform.OS});

            if (Platform.OS !== 'ios') {
                logger.error('Apple Sign-In is only available on iOS');
                return {success: false, error: 'Apple Sign-In is only available on iOS'};
            }

            logger.debug('Initiating Apple Sign-In');
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            const identityToken = credential.identityToken;
            if (!identityToken) {
                logger.error('No identity token received from Apple Sign-In');
                throw new Error('No identity token received');
            }

            logger.debug('Authenticating with backend');
            const res = await appleLogin({
                identityToken,
                user: credential.user,
                email: credential.email ?? undefined,
                givenName: credential.fullName?.givenName ?? undefined,
                familyName: credential.fullName?.familyName ?? undefined,
            });

            if (res) {
                logger.info('Apple Sign-In successful', {hasProfile: !!res.profile});
                logUserIn({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    loggedInSince: new Date(),
                    lastTokenRefresh: null,
                    role: res.profile?.authorityRole ?? AuthorityRole.USER,
                    profile: res.profile,
                });
                router.push(redirectPath);
                return {success: true, userId: res.profile?.id};
            } else {
                logger.error('Backend authentication failed');
                return {success: false, error: 'Backend authentication failed'};
            }
        } catch (error: any) {
            if (error.code === 'ERR_REQUEST_CANCELED') {
                logger.info('Apple Sign-In canceled by user');
                return {success: false, error: 'Sign-In canceled'};
            }
            logger.error('Apple Sign-In failed', error);
            return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
        }
    };

    return {
        handleAppleSignIn,
        isLoading: appleLoginStatus?.loading,
        error: appleLoginStatus?.error,
    };
};
