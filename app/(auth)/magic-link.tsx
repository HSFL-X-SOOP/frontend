import {Link, useRouter, useLocalSearchParams, Href, useFocusEffect} from 'expo-router';
import {useState, useEffect, useRef, useCallback} from 'react';
import {Text, YStack, XStack, Spinner, ScrollView, View} from 'tamagui';
import {Sparkles, CheckCircle, AlertCircle} from '@tamagui/lucide-icons';
import {Platform as RNPlatform} from 'react-native';
import {useAuth} from '@/hooks/auth';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {Platform} from '@/api/models/auth';
import {AuthCard} from '@/components/auth/AuthCard';
import {EmailInput} from '@/components/auth/EmailInput';
import {CodeInput} from '@/components/auth/CodeInput';
import {useTranslation,useToast} from '@/hooks/ui';

import {createLogger} from '@/utils/logger';
import {UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText} from '@/types/button';
import {getMapRoute} from '@/utils/navigation';

const logger = createLogger('Auth:MagicLink');

export default function MagicLinkScreen() {
    const router = useRouter();
    const {token} = useLocalSearchParams<{ token?: string }>();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const {requestMagicLink, magicLinkLogin, magicLinkCodeLogin} = useAuth();
    const {login: logUserIn} = useSession();
    const {t} = useTranslation();
    const toast = useToast();
    const loginAttemptedRef = useRef(false);

    const isMobile = RNPlatform.OS === 'ios' || RNPlatform.OS === 'android';
    const platform = isMobile ? Platform.MOBILE : Platform.WEB;

    useFocusEffect(
        useCallback(() => {
            if (!token) {
                setEmail("");
                setCode("");
                setSent(false);
                setIsLoading(false);
                setIsVerifying(false);
                setVerificationError(null);
            }
        }, [token])
    );

    const hasErrors = () => {
        return email.length > 0 && !email.includes('@');
    };

    const handleSendMagicLink = async () => {
        logger.info('Requesting magic link', {email, platform});
        setIsLoading(true);

        await requestMagicLink(
            {email, platform},
            () => {
                logger.info('Magic link sent successfully');
                if (isMobile) {
                    toast.success(t('auth.magicLink.codeSentSuccess'), {
                        message: t('auth.magicLink.enterCodeBelow'),
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG
                    });
                } else {
                    toast.success(t('auth.magicLink.linkSentSuccess'), {
                        message: t('auth.magicLink.checkYourEmail'),
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG
                    });
                }
                setSent(true);
            },
            (error) => {
                if ('statusCode' in error && error.statusCode === 409) {
                    logger.info('Code already sent (409), redirecting to code input');
                    if (isMobile) {
                        toast.success(t('auth.magicLink.codeAlreadySent'), {
                            message: t('auth.magicLink.enterExistingCode'),
                            duration: UI_CONSTANTS.TOAST_DURATION.LONG
                        });
                        setSent(true);
                    } else {
                        toast.error(t('auth.magicLink.linkSentError'), {
                            message: t(error.onGetMessage()),
                            duration: UI_CONSTANTS.TOAST_DURATION.LONG
                        });
                    }
                } else {
                    toast.error(t('auth.magicLink.linkSentError'), {
                        message: t(error.onGetMessage()),
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG
                    });
                }
            }
        );
        setIsLoading(false);
    };

    const handleCodeLogin = async () => {
        logger.info('Attempting code login', {code: code.substring(0, 2) + '****', email});
        setIsVerifying(true);

        await magicLinkCodeLogin(
            {code, email},
            (result) => {
                logger.info('Code login successful');
                logUserIn({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    loggedInSince: new Date(),
                    lastTokenRefresh: null,
                    role: result.profile?.authorityRole ?? AuthorityRole.USER,
                    profile: result.profile
                });
                toast.success(t('auth.magicLink.loginSuccess'), {
                    message: t('auth.loginSuccessMessage')
                });
                router.replace(getMapRoute());
            },
            (error) => {
                logger.error('Code login failed', error);
                toast.error(t('auth.magicLink.codeLoginError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG
                });
                setIsVerifying(false);
            }
        );
    };

    useEffect(() => {
        if (!token || loginAttemptedRef.current) {
            return;
        }

        loginAttemptedRef.current = true;
        logger.info('Processing magic link token');

        setIsVerifying(true);
        setVerificationError(null);

        void magicLinkLogin(
            {token},
            (result) => {
                logger.info('Magic link login successful');
                logUserIn({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    loggedInSince: new Date(),
                    lastTokenRefresh: null,
                    role: result.profile?.authorityRole ?? AuthorityRole.USER,
                    profile: result.profile
                });
                toast.success(t('auth.magicLink.loginSuccess'), {
                    message: t('auth.loginSuccessMessage')
                });
                router.replace(getMapRoute());
            },
            (error) => {
                logger.error('Magic link login failed', error);
                setVerificationError(error.onGetMessage());
                setIsVerifying(false);
            }
        );
    }, [token, magicLinkLogin, logUserIn, router, t, toast]);

    if (token && isVerifying) {
        return (
            <View style={{flex: 1}}>
                <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                    <AuthCard title={t('auth.magicLink.verifying')} subtitle={t('auth.magicLink.verifyingMessage')} icon={Sparkles}>
                        <YStack gap="$4" alignItems="center">
                            <Spinner size="large" color="$accent7"/>
                        </YStack>
                    </AuthCard>
                </ScrollView>
            </View>
        );
    }

    if (token && verificationError) {
        return (
            <View style={{flex: 1}}>
                <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                    <AuthCard title={t('auth.magicLink.invalidOrExpired')} subtitle={verificationError}
                              icon={AlertCircle}>
                        <Link href={"/(auth)/magic-link" as Href}>
                            <Text color="$accent7" textDecorationLine="underline" fontWeight="600">
                                {t('auth.magicLink.requestNewLink')}
                            </Text>
                        </Link>
                    </AuthCard>
                </ScrollView>
            </View>
        );
    }

    if (sent && !isMobile) {
        return (
            <View style={{flex: 1}}>
                <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                    <AuthCard title={t('auth.magicLink.checkYourEmail')} subtitle={t('auth.magicLink.emailSent', {email})}
                              icon={CheckCircle}>
                        <Link href={"/(tabs)/login" as Href}>
                            <Text color="$accent7" textDecorationLine="underline" fontWeight="600">
                                {t('auth.magicLink.backToSignIn')}
                            </Text>
                        </Link>
                    </AuthCard>
                </ScrollView>
            </View>
        );
    }

    if (sent && isMobile) {
        return (
            <View style={{flex: 1}}>
                <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                    <AuthCard
                        title={t('auth.magicLink.enterCode')}
                        subtitle={t('auth.magicLink.codeDescription')}
                        icon={Sparkles}
                    >
                        <YStack gap="$4" width="100%">
                            <YStack gap="$2">
                                <CodeInput
                                    value={code}
                                    onChangeText={setCode}
                                    placeholder="ABC123"
                                    label={t('auth.magicLink.verificationCode')}
                                    onSubmitEditing={handleCodeLogin}
                                    hasError={code.length > 0 && code.length !== 6}
                                    errorMessage={t('auth.magicLink.invalidCodeLength')}
                                />
                            </YStack>

                            <PrimaryButton
                                size="$4"
                                onPress={handleCodeLogin}
                                disabled={code.length !== 6 || isVerifying}
                            >
                                {isVerifying ? (
                                    <XStack alignItems="center" gap="$2">
                                        <Spinner size="small" color="white"/>
                                        <PrimaryButtonText>
                                            {t('auth.magicLink.verifying')}
                                        </PrimaryButtonText>
                                    </XStack>
                                ) : (
                                    <XStack alignItems="center" gap="$2">
                                        <CheckCircle size={16} color="white"/>
                                        <PrimaryButtonText>
                                            {t('auth.magicLink.verifyCode')}
                                        </PrimaryButtonText>
                                    </XStack>
                                )}
                            </PrimaryButton>
                        </YStack>

                        <YStack gap="$2" alignItems="center">
                            <Text fontSize={14} color="$color">
                                {t('auth.magicLink.didntReceiveCode')}{' '}
                                <Text
                                    color="$accent7"
                                    textDecorationLine="underline"
                                    fontWeight="600"
                                    onPress={() => {
                                        setSent(false);
                                        setCode("");
                                    }}
                                >
                                    {t('auth.magicLink.resendCode')}
                                </Text>
                            </Text>
                        </YStack>
                    </AuthCard>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                <AuthCard
                    title={t('auth.magicLink.title')}
                    subtitle={t('auth.magicLink.description')}
                    icon={Sparkles}
                >
                    <YStack gap="$4" width="100%">
                        <YStack gap="$2">
                            <EmailInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('auth.emailPlaceholder')}
                                label={t('auth.magicLink.emailAddress')}
                                onSubmitEditing={handleSendMagicLink}
                                hasError={hasErrors()}
                                errorMessage={t('auth.invalidEmail')}
                            />
                        </YStack>

                        <PrimaryButton
                            size="$4"
                            onPress={handleSendMagicLink}
                            disabled={!email || hasErrors() || isLoading}
                        >
                            {isLoading ? (
                                <XStack alignItems="center" gap="$2">
                                    <Spinner size="small" color="white"/>
                                    <PrimaryButtonText>
                                        {t('auth.magicLink.sending')}
                                    </PrimaryButtonText>
                                </XStack>
                            ) : (
                                <XStack alignItems="center" gap="$2">
                                    <Sparkles size={16} color="white"/>
                                    <PrimaryButtonText>
                                        {t('auth.magicLink.sendMagicLink')}
                                    </PrimaryButtonText>
                                </XStack>
                            )}
                        </PrimaryButton>
                    </YStack>

                    <YStack gap="$2" alignItems="center">
                        <Text fontSize={14} color="$color">
                            {t('auth.dontHaveAccount')}{' '}
                            <Link href={"/(auth)/register" as Href}>
                                <Text color="$accent7" textDecorationLine="underline"
                                      fontWeight="600">{t('auth.signUp')}</Text>
                            </Link>
                        </Text>
                        <Text fontSize={14} color="$color">
                            {t('auth.alreadyHaveAccount')}{' '}
                            <Link href={"/(auth)/register" as Href}>
                                <Text color="$accent7" textDecorationLine="underline"
                                      fontWeight="600">{t('auth.signIn')}</Text>
                            </Link>
                        </Text>
                    </YStack>
                </AuthCard>
            </ScrollView>
        </View>
    );
}
