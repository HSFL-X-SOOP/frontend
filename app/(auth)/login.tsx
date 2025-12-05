import {useSession} from '@/context/SessionContext';
import {useAuth} from '@/hooks/auth';
import {Link, useRouter, Href} from 'expo-router';
import {useEffect, useState} from 'react';
import {Platform, SafeAreaView} from 'react-native';
import {Lock} from '@tamagui/lucide-icons';
import {Button, Checkbox, Text, View, YStack, XStack, Separator, Spinner, ScrollView} from 'tamagui';
import {useTranslation} from '@/hooks/ui';
import {useToast} from '@/hooks/ui';
import {GoogleIcon} from '@/components/ui/Icons';
import {useGoogleSignIn} from '@/hooks/auth';
import {AuthCard} from '@/components/auth/AuthCard';
import {EmailInput} from '@/components/auth/EmailInput';
import {PasswordInput} from '@/components/auth/PasswordInput';
import {createLogger} from '@/utils/logger';
import {AuthorityRole} from '@/api/models/profile';
import {useIsMobile} from '@/hooks/ui';
import messagingModule from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import { useUserDeviceStore } from '@/api/stores/userDevice';
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
    const userDeviceStore = useUserDeviceStore();

    useEffect(() => {
        if (session) {
            logger.debug('User already logged in, redirecting to home');
            router.push("/");
        }
    }, [session, router]);

    const handleRegisterUserDevice = async (userId: number) => {
        const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
            if (Platform.OS !== 'web') {
                if (Platform.OS === 'android') {
                    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
                }
                
                try {
                    let token = await messagingModule().getToken();
                    userDeviceStore.registerUserDevice({fcmToken: token, userId: userId});
                } catch (error) {
                    console.log('Error getting FCM token:', error);
                }
            }
        }
    }

    const handleSubmit = async () => {
        logger.info('Login attempt', {email, rememberMe});
        const res = await login({email, password, rememberMe});
        if (res) {
            console.log('Login successful', res);
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
                duration: 3000
            });
            handleRegisterUserDevice(res.profile?.id || 0);
            router.push("/map");
        } else {
            logger.error('Login failed', loginStatus.error);
            toast.error(t('auth.loginError'), {
                message: loginStatus.error?.message || t('auth.loginErrorGeneric'),
                duration: 5000
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
                                            <View width="100%" height="100%" alignItems="center" justifyContent="center">
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
                            <XStack justifyContent="space-between" alignItems="center" width="100%" flexWrap="wrap" gap="$2">
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
                                            <View width="100%" height="100%" alignItems="center" justifyContent="center">
                                                <Text color="white" fontWeight="bold">✓</Text>
                                            </View>
                                        </Checkbox.Indicator>
                                    </Checkbox>
                                    <Text fontSize={14} color="$color" numberOfLines={1}>{t('auth.rememberMe')}</Text>
                                </XStack>
                                <Link href={"/(auth)/magic-link" as Href}>
                                    <Text color="$accent7" fontSize={14} textDecorationLine="underline" numberOfLines={1}>
                                        {t('auth.forgotPassword')}
                                    </Text>
                                </Link>
                            </XStack>
                        )}

                        <Button
                            backgroundColor="$accent7"
                            color="white"
                            size="$4"
                            onPress={handleSubmit}
                            disabled={loginStatus.loading}
                            opacity={loginStatus.loading ? 0.6 : 1}
                            borderRadius="$6"
                            hoverStyle={{backgroundColor: "$accent4"}}
                            pressStyle={{backgroundColor: "$accent6"}}
                        >
                            {loginStatus.loading ? (
                                <XStack gap="$2" alignItems="center">
                                    <Spinner size="small" color="white"/>
                                    <Text color="white" fontWeight="600">{t('auth.signingIn')}</Text>
                                </XStack>
                            ) : (
                                <Text color="white" fontWeight="600">{t('auth.signIn')}</Text>
                            )}
                        </Button>
                    </YStack>

                    <XStack gap="$3" alignItems="center" width="100%">
                        <Separator flex={1} borderColor="$borderColor"/>
                        <Text color="$color" fontSize={14} opacity={0.7}>{t('auth.or')}</Text>
                        <Separator flex={1} borderColor="$borderColor"/>
                    </XStack>

                    <YStack gap="$3" width="100%">
                        <Button
                            variant="outlined"
                            size="$4"
                            onPress={async () => {
                                const result = await handleGoogleSignIn('/map');
                                if (result?.success) {
                                    toast.success(t('auth.googleSignInSuccess'), {
                                        message: t('auth.welcomeBack'),
                                        duration: 3000
                                    });
                                } else if (result && !result.success) {
                                    toast.error(t('auth.googleSignInError'), {
                                        message: result.error || t('auth.googleSignInErrorGeneric'),
                                        duration: 5000
                                    });
                                }
                            }}
                            disabled={googleLoading}
                            opacity={googleLoading ? 0.6 : 1}
                            borderColor="$borderColor"
                            borderRadius="$6"
                            hoverStyle={{backgroundColor: "$content2"}}
                        >
                            {googleLoading ? (
                                <XStack gap="$2" alignItems="center">
                                    <Spinner size="small"/>
                                    <Text color="$color">{t('auth.signingIn')}</Text>
                                </XStack>
                            ) : (
                                <XStack gap="$3" alignItems="center">
                                    <GoogleIcon size={20}/>
                                    <Text color="$color">{t('auth.signInWithGoogle')}</Text>
                                </XStack>
                            )}
                        </Button>

                        <Button
                            variant="outlined"
                            size="$4"
                            onPress={() => router.push("/(auth)/magic-link")}
                            borderColor="$borderColor"
                            borderRadius="$6"
                            hoverStyle={{backgroundColor: "$content2"}}
                        >
                            <XStack gap="$2" alignItems="center">
                                <Text>✨</Text>
                                <Text color="$color">{t('auth.signInWithMagicLink')}</Text>
                            </XStack>
                        </Button>
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
