import {useSession} from '@/context/SessionContext';
import {useAuth, useGoogleSignIn} from '@/hooks/auth';
import {useAppleSignIn} from '@/hooks/auth/useAppleSignIn';
import {Link, useRouter, Href} from 'expo-router';
import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {Lock} from '@tamagui/lucide-icons';
import {Checkbox, Text, View, YStack, XStack, Separator, Spinner, ScrollView} from 'tamagui';
import {useTranslation, useToast, useIsMobile} from '@/hooks/ui';
import {GoogleIcon, AppleIcon} from '@/components/ui/Icons';
import {AuthCard} from '@/components/auth/AuthCard';
import {EmailInput} from '@/components/auth/EmailInput';
import {PasswordInput} from '@/components/auth/PasswordInput';
import {createLogger} from '@/utils/logger';
import {AuthorityRole, Language} from '@/api/models/profile';
import {useUserDeviceStore} from '@/api/stores/userDevice';
import messaging from '@react-native-firebase/messaging';
import {UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';
import {getAuthRoute, getProfileRoute, getMapRoute} from '@/utils/navigation';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const logger = createLogger('Auth:Login');

export default function LoginScreen() {
    const router = useRouter();
    const {t, changeLanguage} = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const isMobile = useIsMobile();

    const {login} = useAuth();
    const {login: logUserIn, session} = useSession();
    const {handleGoogleSignIn, isLoading: googleLoading} = useGoogleSignIn();
    const {handleAppleSignIn, isLoading: appleLoading} = useAppleSignIn();

    useEffect(() => {
        if (session) {
            logger.debug('User already logged in, redirecting to home');
            router.push("/");
        }
    }, [session, router]);

    const handleSubmit = async () => {
        logger.info('Login attempt', {email, rememberMe});
        setIsLoading(true);

        await login(
            {email, password, rememberMe},
            (res) => {
                logUserIn({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    loggedInSince: new Date(),
                    lastTokenRefresh: null,
                    role: res.profile?.authorityRole ?? AuthorityRole.USER,
                    profile: res.profile
                });

                if (res.profile?.language) {
                    const langCode = res.profile.language === Language.DE ? 'de' : 'en';
                    changeLanguage(langCode);
                }

                toast.success(t('auth.loginSuccess'), {
                    message: t('auth.welcomeBack')
                });

                // Check if user has a profile, if not redirect to create-profile
                if (!res.profile || !res.profile.profileCreatedAt) {
                    logger.info('No profile found or not created, redirecting to create-profile');
                    router.push(getProfileRoute('create-profile'));
                } else {
                    router.push(getMapRoute());
                }
            },
            (error) => {
                toast.error(
                    t('auth.loginError'),
                    {message: t(error.onGetMessage())}
                );
            }
        );
        setIsLoading(false);
    };

    return (
        <View style={{flex: 1}}>
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
                                <Link href={"/(tabs)/magic-link" as Href}>
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
                                <Link href={"/(tabs)/magic-link" as Href}>
                                    <Text color="$accent7" fontSize={14} textDecorationLine="underline"
                                          numberOfLines={1}>
                                        {t('auth.forgotPassword')}
                                    </Text>
                                </Link>
                            </XStack>
                        )}

                        <PrimaryButton
                            onPress={handleSubmit}
                            disabled={isLoading}
                            opacity={isLoading ? 0.6 : 1}
                        >
                            {isLoading ? (
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
                                await handleGoogleSignIn(
                                    getMapRoute(),
                                    () => {
                                        toast.success(t('auth.googleSignInSuccess'), {
                                            message: t('auth.welcomeBack'),
                                            duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
                                        });
                                    },
                                    (error) => {
                                        toast.error(
                                            t('auth.googleSignInError'),
                                            {message: t(error.onGetMessage())}
                                        );
                                    }
                                );
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
                                    await handleAppleSignIn(
                                        getMapRoute(),
                                        (userId) => {
                                            toast.success(t('auth.appleSignInSuccess'), {
                                                message: t('auth.welcomeBack'),
                                                duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
                                            });
                                        },
                                        (error) => {
                                            toast.error(
                                                t('auth.appleSignInError'),
                                                {message: t(error.onGetMessage())}
                                            );
                                        }
                                    );
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
                        onPress={() => router.push("/(tabs)/magic-link")}
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
                            <Link href={getAuthRoute('register')}>
                                <Text color="$accent7" textDecorationLine="underline" fontWeight="600">
                                    {t('auth.signUp')}
                                </Text>
                            </Link>
                        </Text>
                    </YStack>
                </AuthCard>
            </ScrollView>
        </View>
    );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
