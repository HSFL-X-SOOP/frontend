import {useSession} from '@/context/SessionContext';
import {useAuth,useGoogleSignIn} from '@/hooks/auth';
import {AuthorityRole} from '@/api/models/profile';
import {Link, useRouter, Href} from 'expo-router';
import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, SafeAreaView} from 'react-native';
import {Checkbox, Text, View, YStack, XStack, Separator, Spinner, ScrollView} from 'tamagui';
import {User} from '@tamagui/lucide-icons';
import {useTranslation,useToast,usePasswordValidation, useEmailValidation} from '@/hooks/ui';

import {GoogleIcon, AppleIcon} from '@/components/ui/Icons';

import {useAppleSignIn} from '@/hooks/auth/useAppleSignIn';

import {AuthCard} from '@/components/auth/AuthCard';
import {EmailInput} from '@/components/auth/EmailInput';
import {PasswordInput} from '@/components/auth/PasswordInput';
import {PasswordStrengthIndicator} from '@/components/auth/PasswordStrengthIndicator';
import {createLogger} from '@/utils/logger';
import {useUserDeviceStore} from '@/api/stores/userDevice';
import messagingModule from '@react-native-firebase/messaging';
import {UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

const logger = createLogger('Auth:Register');

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeTermsOfService, setAgreeTermsOfService] = useState(false);

    const router = useRouter();
    const {register, registerStatus} = useAuth();
    const {login, session} = useSession();
    const {t} = useTranslation();
    const {handleGoogleSignIn, isLoading: googleLoading} = useGoogleSignIn();
    const {handleAppleSignIn, isLoading: appleLoading} = useAppleSignIn();
    const toast = useToast();
    const userDeviceStore = useUserDeviceStore();
    
    const {
        validation: passwordValidation,
        strength: passwordStrength,
        isValid: isPasswordValid
    } = usePasswordValidation(password);
    const {isValid: isEmailValid} = useEmailValidation(email);

    useEffect(() => {
        if (session) {
            logger.debug('User already logged in, redirecting to home');
            router.push("/");
        }
    }, [session, router]);

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            logger.warn('Password mismatch');
            toast.error(t('auth.registerError'), {
                message: t('auth.passwordsDoNotMatch'),
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
            return;
        }
        if (!agreeTermsOfService) {
            logger.warn('Terms of service not accepted');
            toast.error(t('auth.registerError'), {
                message: t('auth.agreeToTermsRequired'),
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
            return;
        }
        if (!isPasswordValid) {
            logger.warn('Invalid password format');
            toast.error(t('auth.registerError'), {
                message: t('auth.invalidPasswordFormat'),
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
            return;
        }
        if (!isEmailValid) {
            logger.warn('Invalid email format');
            toast.error(t('auth.registerError'), {
                message: t('auth.invalidEmail'),
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
            return;
        }

        logger.info('Registration attempt', {email});
        try {
            const res = await register({email, password, rememberMe: false});
            if (res) {
                logger.info('Registration successful');
                login({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    loggedInSince: new Date(),
                    lastTokenRefresh: null,
                    role: res.profile?.authorityRole ?? AuthorityRole.USER,
                    profile: res.profile
                });
                toast.success(t('auth.registerSuccess'), {
                    message: t('auth.accountCreated'),
                    duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
                });
                handleRegisterUserDevice(res.profile?.id || 0);
                router.push("/");
            }
        } catch (err: any) {
            logger.error('Registration failed', err);
            const errorMessage = err?.response?.data?.message || err?.message || t('auth.registerErrorGeneric');
            toast.error(t('auth.registerError'), {
                message: errorMessage,
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
        }
    };

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

    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
    const isFormValid = isEmailValid && isPasswordValid && passwordsMatch && agreeTermsOfService;

    return (
        <SafeAreaView style={{flex: 1}}>
            <ScrollView flex={1} backgroundColor="$content3" contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                <AuthCard
                    title={t('auth.createAccount')}
                    subtitle={t('auth.joinUsMessage')}
                    icon={User}
                >
                    <YStack gap="$4" width="100%">
                        <YStack gap="$2">
                            <EmailInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('auth.emailPlaceholder')}
                                label={t('auth.email')}
                                onSubmitEditing={handleSubmit}
                                hasError={email.length > 0 && !isEmailValid}
                                errorMessage={t('auth.invalidEmail')}
                            />
                        </YStack>

                        <YStack gap="$2">
                            <PasswordInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder={t('auth.passwordPlaceholder')}
                                label={t('auth.password')}
                                autoComplete="new-password"
                                onSubmitEditing={handleSubmit}
                            />
                            {password && (
                                <PasswordStrengthIndicator
                                    validation={passwordValidation}
                                    strength={passwordStrength}
                                    showDetails={true}
                                />
                            )}
                        </YStack>

                        <YStack gap="$2">
                            <PasswordInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder={t('auth.passwordPlaceholder')}
                                label={t('auth.confirmPassword')}
                                autoComplete="new-password"
                                onSubmitEditing={handleSubmit}
                                hasError={confirmPassword.length > 0 && !passwordsMatch}
                                errorMessage={t('auth.passwordsDoNotMatch')}
                            />
                        </YStack>

                        {registerStatus.error && (
                            <Text color="$red10" fontSize={14} textAlign="center">
                                {registerStatus.error.message}
                            </Text>
                        )}

                        <XStack gap="$2" alignItems="center" width="100%" pressStyle={{opacity: 0.7}}
                                onPress={() => setAgreeTermsOfService(!agreeTermsOfService)}>
                            <Checkbox
                                id="agree-terms"
                                checked={agreeTermsOfService}
                                onCheckedChange={(checked) => setAgreeTermsOfService(checked === true)}
                                size="$4"
                                borderWidth={2}
                                borderColor={agreeTermsOfService ? "$accent7" : "$borderColor"}
                                backgroundColor={agreeTermsOfService ? "$accent7" : "transparent"}
                            >
                                <Checkbox.Indicator>
                                    <View width="100%" height="100%" alignItems="center" justifyContent="center">
                                        <Text color="white" fontWeight="bold">✓</Text>
                                    </View>
                                </Checkbox.Indicator>
                            </Checkbox>
                            <Text fontSize={14} color="$color">
                                {t('auth.agreeToTerms').split(' ')[0]} {t('auth.agreeToTerms').split(' ').slice(1, -3).join(' ')}{' '}
                                <Link href={"/(other)/terms-of-service" as Href}>
                                    <Text color="$accent7"
                                          textDecorationLine="underline">{t('auth.termsOfService')}</Text>
                                </Link>
                            </Text>
                        </XStack>

                        <PrimaryButton
                            size="$4"
                            onPress={handleSubmit}
                            disabled={!isFormValid || registerStatus.loading}
                        >
                            {registerStatus.loading ? (
                                <XStack gap="$2" alignItems="center">
                                    <Spinner size="small" color="white"/>
                                    <PrimaryButtonText>
                                        {t('auth.creating')}
                                    </PrimaryButtonText>
                                </XStack>
                            ) : (
                                <PrimaryButtonText>
                                    {t('auth.createAccount')}
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
                            size="$4"
                            onPress={async () => {
                                const result = await handleGoogleSignIn('/');
                                if (result?.success) {
                                    toast.success(t('auth.googleSignInSuccess'), {
                                        message: t('auth.accountCreated'),
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
                            width="100%"
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
                                        {t('auth.signUpWithGoogle')}
                                    </SecondaryButtonText>
                                </XStack>
                            )}
                        </SecondaryButton>

                        {Platform.OS === 'ios' && (
                            <SecondaryButton
                                size="$4"
                                onPress={async () => {
                                    const result = await handleAppleSignIn('/');
                                    if (result?.success) {
                                        toast.success(t('auth.appleSignInSuccess'), {
                                            message: t('auth.accountCreated'),
                                            duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
                                        });
                                        handleRegisterUserDevice(result.userId || 0);
                                    } else if (result && !result.success) {
                                        toast.error(t('auth.appleSignInError'), {
                                            message: result.error || t('auth.appleSignInErrorGeneric'),
                                            duration: UI_CONSTANTS.TOAST_DURATION.LONG
                                        });
                                    }
                                }}
                                disabled={appleLoading}
                                width="100%"
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
                                            {t('auth.signUpWithApple')}
                                        </SecondaryButtonText>
                                    </XStack>
                                )}
                            </SecondaryButton>
                        )}
                    </YStack>

                    <Text fontSize={14} color="$color">
                        {t('auth.alreadyHaveAccount')}{' '}
                        <Link href={"/(auth)/login" as Href}>
                            <Text color="$accent7" textDecorationLine="underline"
                                  fontWeight="600">{t('auth.signIn')}</Text>
                        </Link>
                    </Text>
                </AuthCard>
            </ScrollView>
        </SafeAreaView>
    );
}
