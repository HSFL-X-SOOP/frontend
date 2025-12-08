import {useSession} from '@/context/SessionContext';
import {useAuth} from '@/hooks/auth';
import {Link, useRouter, Href} from 'expo-router';
import {useEffect, useState} from 'react';
import {Platform, SafeAreaView} from 'react-native';
import {Lock} from '@tamagui/lucide-icons';
import {Button, Checkbox, Text, View, YStack, XStack, Separator, Spinner, ScrollView} from 'tamagui';
import {useTranslation} from '@/hooks/ui';
import {useToast} from '@/hooks/ui';
import {GoogleIcon, AppleIcon} from '@/components/ui/Icons';
import {useGoogleSignIn} from '@/hooks/auth';
import {useAppleSignIn} from '@/hooks/auth/useAppleSignIn';
import {AuthCard} from '@/components/auth/AuthCard';
import {EmailInput} from '@/components/auth/EmailInput';
import {PasswordInput} from '@/components/auth/PasswordInput';
import {createLogger} from '@/utils/logger';
import {AuthorityRole} from '@/api/models/profile';
import {useIsMobile} from '@/hooks/ui';
import messagingModule from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import {useUserDeviceStore} from '@/api/stores/userDevice';
import {UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

const logger = createLogger('Auth:Login');

export default function LoginScreen() {
    const router = useRouter();
    const {t} = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const toast = useToast();
    const isMobile = useIsMobile();

    const {login, loginStatus} = useAuth();
    const {login: logUserIn, session} = useSession();
    const {handleGoogleSignIn, isLoading: googleLoading} = useGoogleSignIn();
    const {handleAppleSignIn, isLoading: appleLoading} = useAppleSignIn();
    const userDeviceStore = useUserDeviceStore();

    useEffect(() => {
        if (session) {
            logger.debug('User already logged in, redirecting to home');
            router.push("/");
        }
    }, [session, router]);

    const handleRegisterUserDevice = async (userId: number) => {
        // Skip device registration on web platform
        if (Platform.OS === 'web') {
            return;
        }

        try {
            // Request notification permissions on Android
            if (Platform.OS === 'android') {
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );

                if (result !== PermissionsAndroid.RESULTS.GRANTED) {
                    logger.debug('Notification permission not granted');
                    return;
                }
            }

            // Get FCM token and register device
            const token = await messagingModule().getToken();
            await userDeviceStore.registerUserDevice({fcmToken: token, userId: userId});
            logger.debug('User device registered successfully');
        } catch (error) {
            logger.error('Error registering user device:', error);
        }
    }

    const handleSubmit = async () => {
        logger.info('Login attempt', {email, rememberMe});
        try {
            const res = await login({email, password, rememberMe});
            if (res) {
                logUserIn({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    loggedInSince: new Date(),
                    lastTokenRefresh: null,
                    role: res.profile?.authorityRole ?? AuthorityRole.USER,
                    profile: res.profile
                });
                toast.success(t('auth.loginSuccess'), {
                    message: t('auth.welcomeBack'),
                    duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
                });
                handleRegisterUserDevice(res.profile?.id || 0);

                // Check if user has a profile, if not redirect to create-profile
                if (!res.profile || !res.profile.profileCreatedAt) {
                    logger.info('No profile found or not created, redirecting to create-profile');
                    router.push("/(profile)/create-profile");
                } else {
                    router.push("/map");
                }
            }
        } catch (err: any) {
            logger.error('Login failed', err);
            const errorMessage = err?.response?.data?.message || err?.message || t('auth.loginErrorGeneric');
            toast.error(t('auth.loginError'), {
                message: errorMessage,
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
        }
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 8
            }}>
                <AuthCard
                    title={t('auth.signIn')}
                    subtitle={t('auth.welcomeBack')}
                    icon={Lock}
                >
                    <YStack gap="$4" width="100%">
                        <YStack gap="$2">
                            <EmailInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('auth.emailPlaceholder')}
                                label={t('auth.email')}
                                onSubmitEditing={handleSubmit}
                            />
                        </YStack>

                        <YStack gap="$2">
                            <PasswordInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder={t('auth.passwordPlaceholder')}
                                label={t('auth.password')}
                                autoComplete="current-password"
                                onSubmitEditing={handleSubmit}
                            />
                        </YStack>

                        {isMobile ? (
                            // Vertical layout for mobile devices
                            <YStack gap="$3" width="100%" alignItems="flex-start">
                                <XStack gap="$2" alignItems="center" pressStyle={{opacity: 0.7}}
                                        onPress={() => setRememberMe(!rememberMe)}>
                                    <Checkbox
                                        id="remember-me"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                                        size="$4"
                                        borderWidth={2}
                                        borderColor={rememberMe ? "$accent7" : "$borderColor"}
                                        backgroundColor={rememberMe ? "$accent7" : "transparent"}
                                    >
                                        <Checkbox.Indicator>
                                            <View width="100%" height="100%" alignItems="center"
                                                  justifyContent="center">
                                                <Text color="white" fontWeight="bold">✓</Text>
                                            </View>
                                        </Checkbox.Indicator>
                                    </Checkbox>
                                    <Text fontSize={14} color="$color">{t('auth.rememberMe')}</Text>
                                </XStack>
                                <Link href={"/(auth)/magic-link" as Href}>
                                    <Text color="$accent7" fontSize={14} textDecorationLine="underline">
                                        {t('auth.forgotPassword')}
                                    </Text>
                                </Link>
                            </YStack>
                        ) : (
                            // Horizontal layout for larger screens
                            <XStack justifyContent="space-between" alignItems="center" width="100%" flexWrap="wrap"
                                    gap="$2">
                                <XStack gap="$2" alignItems="center" pressStyle={{opacity: 0.7}}
                                        onPress={() => setRememberMe(!rememberMe)} flexShrink={1}>
                                    <Checkbox
                                        id="remember-me"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                                        size="$4"
                                        borderWidth={2}
                                        borderColor={rememberMe ? "$accent7" : "$borderColor"}
                                        backgroundColor={rememberMe ? "$accent7" : "transparent"}
                                    >
                                        <Checkbox.Indicator>
                                            <View width="100%" height="100%" alignItems="center"
                                                  justifyContent="center">
                                                <Text color="white" fontWeight="bold">✓</Text>
                                            </View>
                                        </Checkbox.Indicator>
                                    </Checkbox>
                                    <Text fontSize={14} color="$color" numberOfLines={1}>{t('auth.rememberMe')}</Text>
                                </XStack>
                                <Link href={"/(auth)/magic-link" as Href}>
                                    <Text color="$accent7" fontSize={14} textDecorationLine="underline"
                                          numberOfLines={1}>
                                        {t('auth.forgotPassword')}
                                    </Text>
                                </Link>
                            </XStack>
                        )}

                        <PrimaryButton
                            onPress={handleSubmit}
                            disabled={loginStatus.loading}
                            opacity={loginStatus.loading ? 0.6 : 1}
                        >
                            {loginStatus.loading ? (
                                <XStack gap="$2" alignItems="center">
                                    <Spinner size="small" color="white"/>
                                    <PrimaryButtonText>
                                        {t('auth.signingIn')}
                                    </PrimaryButtonText>
                                </XStack>
                            ) : (
                                <PrimaryButtonText>
                                    {t('auth.signIn')}
                                </PrimaryButtonText>
                            )}
                        </PrimaryButton>
                    </YStack>

                    <XStack gap="$3" alignItems="center" width="100%">
                        <Separator flex={1} borderColor="$borderColor"/>
                        <Text color="$color" fontSize={14} opacity={0.7}>{t('auth.or')}</Text>
                        <Separator flex={1} borderColor="$borderColor"/>
                    </XStack>

                    <YStack gap="$3" width="100%">
                        <SecondaryButton
                            onPress={async () => {
                                const result = await handleGoogleSignIn('/map');
                                if (result?.success) {
                                    toast.success(t('auth.googleSignInSuccess'), {
                                        message: t('auth.welcomeBack'),
                                        duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
                                    });
                                } else if (result && !result.success) {
                                    toast.error(t('auth.googleSignInError'), {
                                        message: result.error || t('auth.googleSignInErrorGeneric'),
                                        duration: UI_CONSTANTS.TOAST_DURATION.LONG
                                    });
                                }
                            }}
                            disabled={googleLoading}
                            opacity={googleLoading ? 0.6 : 1}
                        >
                            {googleLoading ? (
                                <XStack gap="$2" alignItems="center">
                                    <Spinner size="small"/>
                                    <SecondaryButtonText color="$color">
                                        {t('auth.signingIn')}
                                    </SecondaryButtonText>
                                </XStack>
                            ) : (
                                <XStack gap="$3" alignItems="center">
                                    <GoogleIcon size={20}/>
                                    <SecondaryButtonText color="$color">
                                        {t('auth.signInWithGoogle')}
                                    </SecondaryButtonText>
                                </XStack>
                            )}
                        </SecondaryButton>

                        {Platform.OS === 'ios' && (
                            <SecondaryButton
                                onPress={async () => {
                                    const result = await handleAppleSignIn('/map');
                                    if (result?.success) {
                                        toast.success(t('auth.appleSignInSuccess'), {
                                            message: t('auth.welcomeBack'),
                                            duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
                                        });
                                    } else if (result && !result.success) {
                                        toast.error(t('auth.appleSignInError'), {
                                            message: result.error || t('auth.appleSignInErrorGeneric'),
                                            duration: UI_CONSTANTS.TOAST_DURATION.LONG
                                        });
                                    }
                                }}
                                disabled={appleLoading}
                                opacity={appleLoading ? 0.6 : 1}
                        >
                            {appleLoading ? (
                                <XStack gap="$2" alignItems="center">
                                    <Spinner size="small"/>
                                    <SecondaryButtonText color="$color">
                                        {t('auth.signingIn')}
                                    </SecondaryButtonText>
                                </XStack>
                            ) : (
                                <XStack gap="$3" alignItems="center">
                                    <AppleIcon size={24}/>
                                    <SecondaryButtonText color="$color">
                                        {t('auth.signInWithApple')}
                                    </SecondaryButtonText>
                                </XStack>
                            )}
                        </SecondaryButton>
                    )}

                    <SecondaryButton
                        onPress={() => router.push("/(auth)/magic-link")}
                    >
                        <XStack gap="$2" alignItems="center">
                            <Text>✨</Text>
                            <SecondaryButtonText color="$color">
                                {t('auth.signInWithMagicLink')}
                            </SecondaryButtonText>
                        </XStack>
                    </SecondaryButton>
                    </YStack>

                    <YStack alignItems="center">
                        <Text fontSize={14} color="$color">
                            {t('auth.dontHaveAccount')}{' '}
                            <Link href={"/(auth)/register" as Href}>
                                <Text color="$accent7" textDecorationLine="underline" fontWeight="600">
                                    {t('auth.signUp')}
                                </Text>
                            </Link>
                        </Text>
                    </YStack>
                </AuthCard>
            </ScrollView>
        </SafeAreaView>
    );
}
