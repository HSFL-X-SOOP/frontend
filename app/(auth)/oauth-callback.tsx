import {useEffect, useRef} from 'react';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {Platform} from 'react-native';
import {YStack, Text, Spinner, View} from 'tamagui';
import {createLogger} from '@/utils/logger';
import {useUser} from '@/hooks/data';

const logger = createLogger('Auth:OAuthCallback');

export default function OAuthCallbackHandler() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {login, session, updateProfile: updateSessionProfile} = useSession();
    const {getProfile} = useUser();
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (session) {
            logger.debug('User already logged in, redirecting to home');
            router.push("/");
        }
    }, [session, router]);

    useEffect(() => {
        if (hasProcessed.current) {
            logger.debug('Callback already processed, skipping');
            return;
        }

        const handleCallback = async () => {
            logger.info('Processing OAuth callback', { platform: Platform.OS });
            let accessToken: string | null = null;
            let refreshToken: string | null = null;

            if (Platform.OS === 'web' && typeof window !== 'undefined') {
                const hash = window.location.hash;
                logger.debug('Parsing tokens from URL hash');

                const hashParams = new URLSearchParams(hash.substring(1));
                accessToken = hashParams.get('access_token');
                refreshToken = hashParams.get('refresh_token');
            }

            if (!accessToken) {
                logger.debug('Parsing tokens from URL params');
                accessToken = params.access_token as string;
                refreshToken = params.refresh_token as string;
            }

            if (accessToken) {
                hasProcessed.current = true;
                logger.info('OAuth tokens received, logging in user');

                login({
                    accessToken: accessToken,
                    refreshToken: refreshToken || null,
                    loggedInSince: new Date(),
                    lastTokenRefresh: null,
                    profile: null,
                    role: AuthorityRole.USER
                });

                // Try to fetch user profile
                logger.debug('Fetching user profile');
                void getProfile(
                    (profile) => {
                        logger.info('Profile found, updating session');
                        updateSessionProfile(profile);

                        // Redirect based on profile existence and creation status
                        const hasProfile = profile && profile.profileCreatedAt;
                        const redirectPath = hasProfile ? '/map' : '/(profile)/create-profile';
                        logger.info('Redirecting to', { path: redirectPath, hasProfile, profileCreatedAt: profile?.profileCreatedAt });

                        if (Platform.OS === 'web' && typeof window !== 'undefined') {
                            logger.debug('Cleaning up URL after OAuth callback');
                            window.history.replaceState({}, document.title, redirectPath);
                            router.replace(redirectPath as any);
                        } else {
                            router.replace(redirectPath as any);
                        }
                    },
                    (error) => {
                        logger.error('Failed to fetch profile, redirecting to create-profile', error);
                        router.replace('/(profile)/create-profile');
                    }
                );
            } else {
                logger.error('No tokens found in OAuth callback URL');
                router.replace('/(auth)/login');
            }
        };

        handleCallback();
    }, [params, login, router, getProfile, updateSessionProfile]);

    return (
        <View style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content3" alignItems="center" justifyContent="center" gap="$4">
                <Spinner size="large" color="$accent7" />
                <Text fontSize={18} color="$color" opacity={0.8}>
                    Signing you in…
                </Text>
            </YStack>
        </View>
    );
}
