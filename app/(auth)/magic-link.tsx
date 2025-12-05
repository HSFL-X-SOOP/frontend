import {Link, useRouter, useLocalSearchParams, Href} from 'expo-router';
import {useState, useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native';
import {Button, Text, YStack, XStack, Spinner, ScrollView} from 'tamagui';
import {Sparkles, CheckCircle, AlertCircle} from '@tamagui/lucide-icons';
import {useAuth} from '@/hooks/auth';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {AuthCard} from '@/components/auth/AuthCard';
import {EmailInput} from '@/components/auth/EmailInput';
import {useTranslation} from '@/hooks/ui';
import {useToast} from '@/hooks/ui';
import {createLogger} from '@/utils/logger';

const logger = createLogger('Auth:MagicLink');

export default function MagicLinkScreen() {
    const router = useRouter();
    const {token} = useLocalSearchParams<{ token?: string }>();
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const {requestMagicLink, requestMagicLinkStatus, magicLinkLogin, magicLinkLoginStatus} = useAuth();
    const {login: logUserIn} = useSession();
    const {t} = useTranslation();
    const toast = useToast();
    const loginAttemptedRef = useRef(false);

    const hasErrors = () => {
        return email.length > 0 && !email.includes('@');
    };

    const handleSendMagicLink = async () => {
        logger.info('Requesting magic link', {email});
        const result = await requestMagicLink({email});
        if (result !== undefined) {
            logger.info('Magic link sent successfully');
            toast.success(t('auth.magicLink.linkSentSuccess'), {
                message: t('auth.magicLink.checkYourEmail'),
                duration: 4000
            });
            setSent(true);
        } else {
            logger.error('Magic link request failed', requestMagicLinkStatus.error);
            toast.error(t('auth.magicLink.linkSentError'), {
                message: requestMagicLinkStatus.error?.message || t('auth.magicLink.linkSentErrorGeneric'),
                duration: 5000
            });
        }
    };

    useEffect(() => {
        if (!token || loginAttemptedRef.current) {
            return;
        }

        loginAttemptedRef.current = true;
        logger.info('Processing magic link token');

        (async () => {
            const result = await magicLinkLogin({token});
            if (result) {
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
                    message: t('auth.welcomeBack'),
                    duration: 3000
                });
                router.replace("/map");
            } else {
                logger.error('Magic link login failed', magicLinkLoginStatus.error);
                toast.error(t('auth.magicLink.loginError'), {
                    message: magicLinkLoginStatus.error?.message || t('auth.magicLink.invalidOrExpired'),
                    duration: 5000
                });
            }
        })();
    }, [token]);

    if (token && magicLinkLoginStatus.loading) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                    <AuthCard title={t('auth.magicLink.verifying')} subtitle={t('auth.magicLink.verifyingMessage')} icon={Sparkles}>
                        <YStack gap="$4" alignItems="center">
                            <Spinner size="large" color="$accent7"/>
                        </YStack>
                    </AuthCard>
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (token && magicLinkLoginStatus.error) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                    <AuthCard title={t('auth.magicLink.invalidOrExpired')} subtitle={magicLinkLoginStatus.error.message}
                              icon={AlertCircle}>
                        <Link href={"/(auth)/magic-link" as Href}>
                            <Text color="$accent7" textDecorationLine="underline" fontWeight="600">
                                {t('auth.magicLink.requestNewLink')}
                            </Text>
                        </Link>
                    </AuthCard>
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (sent) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                    <AuthCard title={t('auth.magicLink.checkYourEmail')} subtitle={t('auth.magicLink.emailSent', {email})}
                              icon={CheckCircle}>
                        <Link href={"/(auth)/login" as Href}>
                            <Text color="$accent7" textDecorationLine="underline" fontWeight="600">
                                {t('auth.magicLink.backToSignIn')}
                            </Text>
                        </Link>
                    </AuthCard>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{flex: 1}}>
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
                            {requestMagicLinkStatus.error && (
                                <Text color="$red10" fontSize={14}>{requestMagicLinkStatus.error.message}</Text>
                            )}
                        </YStack>

                        <Button
                            backgroundColor="$accent7"
                            color="white"
                            size="$4"
                            onPress={handleSendMagicLink}
                            borderRadius="$6"
                            hoverStyle={{backgroundColor: "$accent4"}}
                            pressStyle={{backgroundColor: "$accent6"}}
                            disabled={!email || hasErrors() || requestMagicLinkStatus.loading}
                            opacity={!email || hasErrors() || requestMagicLinkStatus.loading ? 0.6 : 1}
                        >
                            {requestMagicLinkStatus.loading ? (
                                <XStack alignItems="center" gap="$2">
                                    <Spinner size="small" color="white"/>
                                    <Text color="white" fontWeight="600">{t('auth.magicLink.sending')}</Text>
                                </XStack>
                            ) : (
                                <XStack alignItems="center" gap="$2">
                                    <Sparkles size={16} color="white"/>
                                    <Text color="white" fontWeight="600">{t('auth.magicLink.sendMagicLink')}</Text>
                                </XStack>
                            )}
                        </Button>
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
        </SafeAreaView>
    );
}
