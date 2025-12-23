import {Link, useRouter, useLocalSearchParams, Href} from 'expo-router';
import {useState, useEffect, useRef} from 'react';
import {Text, YStack, XStack, Spinner, ScrollView, View} from 'tamagui';
import {Mail, CheckCircle, AlertCircle, Send} from '@tamagui/lucide-icons';
import {useAuth} from '@/hooks/auth';
import {useSession} from '@/context/SessionContext';
import {AuthCard} from '@/components/auth/AuthCard';
import {useTranslation, useToast} from '@/hooks/ui';
import {createLogger} from '@/utils/logger';
import {UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText} from '@/types/button';
import {getAuthRoute, getMapRoute} from '@/utils/navigation';

const logger = createLogger('Auth:VerifyEmail');

export default function VerifyEmailScreen() {
    const router = useRouter();
    const {token} = useLocalSearchParams<{token?: string}>();
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const {verifyEmail, sendVerificationEmail} = useAuth();
    const {session} = useSession();
    const {t} = useTranslation();
    const toast = useToast();
    const verificationAttemptedRef = useRef(false);

    useEffect(() => {
        if (!token || verificationAttemptedRef.current) {
            return;
        }

        verificationAttemptedRef.current = true;
        logger.info('Processing email verification token');

        setIsVerifying(true);
        setVerificationError(null);

        void verifyEmail(
            {token},
            () => {
                logger.info('Email verification successful');
                setVerificationSuccess(true);
                setIsVerifying(false);
                toast.success(t('auth.emailVerification.verificationSuccess'), {
                    message: t('auth.emailVerification.verificationSuccessMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG
                });
            },
            (error) => {
                logger.error('Email verification failed', error);

                if ('statusCode' in error && error.statusCode === 400) {
                    setVerificationError(t('auth.emailVerification.tokenExpiredOrInvalid'));
                } else {
                    setVerificationError(error.onGetMessage());
                }

                setIsVerifying(false);
            }
        );
    }, [token, verifyEmail, t, toast]);

    const handleResendVerificationEmail = async () => {
        logger.info('Requesting new verification email');
        setIsResending(true);

        await sendVerificationEmail(
            () => {
                logger.info('Verification email sent successfully');
                toast.success(t('auth.emailVerification.emailSentSuccess'), {
                    message: t('auth.emailVerification.checkYourEmail'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG
                });
            },
            (error) => {
                logger.error('Failed to send verification email', error);

                if ('statusCode' in error && error.statusCode === 409) {
                    toast.info(t('auth.emailVerification.emailAlreadySent'), {
                        message: t('auth.emailVerification.checkYourEmailAgain'),
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG
                    });
                } else {
                    toast.error(t('auth.emailVerification.emailSentError'), {
                        message: t(error.onGetMessage()),
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG
                    });
                }
            }
        );

        setIsResending(false);
    };

    if (token && isVerifying) {
        return (
            <View style={{flex: 1}}>
                <ScrollView
                    flex={1}
                    backgroundColor="$content3"
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}
                >
                    <AuthCard
                        title={t('auth.emailVerification.verifying')}
                        subtitle={t('auth.emailVerification.verifyingMessage')}
                        icon={Mail}
                    >
                        <YStack gap="$4" alignItems="center">
                            <Spinner size="large" color="$accent7"/>
                        </YStack>
                    </AuthCard>
                </ScrollView>
            </View>
        );
    }

    if (verificationSuccess) {
        return (
            <View style={{flex: 1}}>
                <ScrollView
                    flex={1}
                    backgroundColor="$content3"
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}
                >
                    <AuthCard
                        title={t('auth.emailVerification.verificationSuccess')}
                        subtitle={t('auth.emailVerification.verificationSuccessMessage')}
                        icon={CheckCircle}
                    >
                        <YStack gap="$3" alignItems="center" width="100%">
                            {session ? (
                                <PrimaryButton
                                    size="$4"
                                    onPress={() => router.replace(getMapRoute())}
                                    width="100%"
                                >
                                    <PrimaryButtonText>
                                        {t('auth.emailVerification.continueToApp')}
                                    </PrimaryButtonText>
                                </PrimaryButton>
                            ) : (
                                <Link href={getAuthRoute('login')} asChild>
                                    <PrimaryButton size="$4" width="100%">
                                        <PrimaryButtonText>
                                            {t('auth.signIn')}
                                        </PrimaryButtonText>
                                    </PrimaryButton>
                                </Link>
                            )}
                        </YStack>
                    </AuthCard>
                </ScrollView>
            </View>
        );
    }

    if (token && verificationError) {
        return (
            <View style={{flex: 1}}>
                <ScrollView
                    flex={1}
                    backgroundColor="$content3"
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}
                >
                    <AuthCard
                        title={t('auth.emailVerification.verificationFailed')}
                        subtitle={verificationError}
                        icon={AlertCircle}
                    >
                        <YStack gap="$3" width="100%">
                            {session && (
                                <PrimaryButton
                                    size="$4"
                                    onPress={handleResendVerificationEmail}
                                    disabled={isResending}
                                    width="100%"
                                >
                                    {isResending ? (
                                        <XStack alignItems="center" gap="$2">
                                            <Spinner size="small" color="white"/>
                                            <PrimaryButtonText>
                                                {t('auth.emailVerification.sending')}
                                            </PrimaryButtonText>
                                        </XStack>
                                    ) : (
                                        <XStack alignItems="center" gap="$2">
                                            <Send size={16} color="white"/>
                                            <PrimaryButtonText>
                                                {t('auth.emailVerification.resendVerification')}
                                            </PrimaryButtonText>
                                        </XStack>
                                    )}
                                </PrimaryButton>
                            )}

                            <Text fontSize={14} color="$color" textAlign="center">
                                <Link href={getAuthRoute('login')}>
                                    <Text color="$accent7" textDecorationLine="underline" fontWeight="600">
                                        {t('auth.emailVerification.backToLogin')}
                                    </Text>
                                </Link>
                            </Text>
                        </YStack>
                    </AuthCard>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView
                flex={1}
                backgroundColor="$content3"
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}
            >
                <AuthCard
                    title={t('auth.emailVerification.title')}
                    subtitle={t('auth.emailVerification.description')}
                    icon={Mail}
                >
                    <YStack gap="$4" width="100%">
                        {session ? (
                            <>
                                <PrimaryButton
                                    size="$4"
                                    onPress={handleResendVerificationEmail}
                                    disabled={isResending}
                                    width="100%"
                                >
                                    {isResending ? (
                                        <XStack alignItems="center" gap="$2">
                                            <Spinner size="small" color="white"/>
                                            <PrimaryButtonText>
                                                {t('auth.emailVerification.sending')}
                                            </PrimaryButtonText>
                                        </XStack>
                                    ) : (
                                        <XStack alignItems="center" gap="$2">
                                            <Send size={16} color="white"/>
                                            <PrimaryButtonText>
                                                {t('auth.emailVerification.sendVerification')}
                                            </PrimaryButtonText>
                                        </XStack>
                                    )}
                                </PrimaryButton>

                                <Text fontSize={14} color="$color" textAlign="center">
                                    {t('auth.emailVerification.alreadyVerified')}{' '}
                                    <Link href={getMapRoute()}>
                                        <Text color="$accent7" textDecorationLine="underline" fontWeight="600">
                                            {t('auth.emailVerification.goToMap')}
                                        </Text>
                                    </Link>
                                </Text>
                            </>
                        ) : (
                            <YStack gap="$3" alignItems="center">
                                <Text fontSize={14} color="$color" textAlign="center">
                                    {t('auth.emailVerification.notLoggedIn')}
                                </Text>

                                <Link href={getAuthRoute('login')} asChild>
                                    <PrimaryButton size="$4" width="100%">
                                        <PrimaryButtonText>
                                            {t('auth.signIn')}
                                        </PrimaryButtonText>
                                    </PrimaryButton>
                                </Link>
                            </YStack>
                        )}
                    </YStack>
                </AuthCard>
            </ScrollView>
        </View>
    );
}
