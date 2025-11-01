import {useSession} from '@/context/SessionContext';
import {useAuth} from '@/hooks/useAuth';
import {AuthorityRole} from '@/api/models/profile';
import {Link, useRouter, Href} from 'expo-router';
import {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Button, Checkbox, Text, View, YStack, XStack, Separator, Spinner, ScrollView} from 'tamagui';
import {User} from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/useTranslation';
import {useToast} from '@/components/useToast';
import {GoogleIcon} from '@/components/ui/Icons';
import {useGoogleSignIn} from '@/hooks/useGoogleSignIn';
import {usePasswordValidation, useEmailValidation} from '@/hooks/usePasswordValidation';
import {AuthCard} from '@/components/auth/AuthCard';
import {EmailInput} from '@/components/auth/EmailInput';
import {PasswordInput} from '@/components/auth/PasswordInput';
import {PasswordStrengthIndicator} from '@/components/auth/PasswordStrengthIndicator';
import {createLogger} from '@/utils/logger';

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
    const toast = useToast();

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
                duration: 4000
            });
            return;
        }
        if (!agreeTermsOfService) {
            logger.warn('Terms of service not accepted');
            toast.error(t('auth.registerError'), {
                message: t('auth.agreeToTermsRequired'),
                duration: 4000
            });
            return;
        }
        if (!isPasswordValid) {
            logger.warn('Invalid password format');
            toast.error(t('auth.registerError'), {
                message: t('auth.invalidPasswordFormat'),
                duration: 4000
            });
            return;
        }
        if (!isEmailValid) {
            logger.warn('Invalid email format');
            toast.error(t('auth.registerError'), {
                message: t('auth.invalidEmail'),
                duration: 4000
            });
            return;
        }

        logger.info('Registration attempt', {email});
        const res = await register({email, password, rememberMe: false});
        if (res) {
            logger.info('Registration successful');
            login({
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
                loggedInSince: new Date(),
                lastTokenRefresh: null,
                role: res.role ?? AuthorityRole.USER, // Standard: USER falls nicht vom Backend geliefert
                profile: res.profile
            });
            toast.success(t('auth.registerSuccess'), {
                message: t('auth.accountCreated'),
                duration: 3000
            });
            router.push("/");
        } else {
            logger.error('Registration failed', registerStatus.error);
            toast.error(t('auth.registerError'), {
                message: registerStatus.error?.message || t('auth.registerErrorGeneric'),
                duration: 5000
            });
        }
    };

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

                        <Button
                            backgroundColor="$accent7"
                            color="white"
                            size="$4"
                            onPress={handleSubmit}
                            disabled={!isFormValid || registerStatus.loading}
                            opacity={!isFormValid || registerStatus.loading ? 0.6 : 1}
                            borderRadius="$6"
                            hoverStyle={{backgroundColor: "$accent4"}}
                            pressStyle={{backgroundColor: "$accent6"}}
                        >
                            {registerStatus.loading ? (
                                <XStack gap="$2" alignItems="center">
                                    <Spinner size="small" color="white"/>
                                    <Text color="white" fontWeight="600">{t('auth.creating')}</Text>
                                </XStack>
                            ) : (
                                <Text color="white" fontWeight="600">{t('auth.createAccount')}</Text>
                            )}
                        </Button>
                    </YStack>

                    <XStack gap="$3" alignItems="center" width="100%">
                        <Separator flex={1} borderColor="$borderColor"/>
                        <Text color="$color" fontSize={14} opacity={0.7}>{t('auth.or')}</Text>
                        <Separator flex={1} borderColor="$borderColor"/>
                    </XStack>

                    <Button
                        variant="outlined"
                        size="$4"
                        onPress={async () => {
                            const result = await handleGoogleSignIn('/');
                            if (result?.success) {
                                toast.success(t('auth.googleSignInSuccess'), {
                                    message: t('auth.accountCreated'),
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
                        width="100%"
                    >
                        {googleLoading ? (
                            <XStack gap="$2" alignItems="center">
                                <Spinner size="small"/>
                                <Text color="$color">{t('auth.signingIn')}</Text>
                            </XStack>
                        ) : (
                            <XStack gap="$3" alignItems="center">
                                <GoogleIcon size={20}/>
                                <Text color="$color">{t('auth.signUpWithGoogle')}</Text>
                            </XStack>
                        )}
                    </Button>

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
