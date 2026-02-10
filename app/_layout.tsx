import '@/i18n'
import {
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
} from '@expo-google-fonts/oswald'
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts
} from '@expo-google-fonts/inter'
import {StatusBar} from 'expo-status-bar'
import {Platform, View, LogBox} from 'react-native'
import {useEffect, useMemo, useState} from 'react'
import 'react-native-reanimated'
import '../global.css'
import {createLogger} from '@/utils/logger'
import AsyncStorage from '@react-native-async-storage/async-storage'

import tamaguiConfig from '@/tamagui.config'
import {PortalProvider} from '@tamagui/portal'
import {
    Checkbox,
    Dialog,
    Spinner,
    TamaguiProvider,
    Text,
    Theme,
    XStack,
    YStack
} from 'tamagui'
import {Toast, ToastProvider, ToastViewport, useToastState} from '@tamagui/toast'
import {CheckCircle, XCircle, AlertTriangle, Info} from '@tamagui/lucide-icons'

import {NavbarWeb} from '@/components/navigation/web/navbar'
import {Footer} from '@/components/navigation/web/Footer'
import {AuthProvider} from '@/context/SessionContext'
import {ThemeProvider, useThemeContext} from '@/context/ThemeSwitch.tsx'
import {Link, Slot, usePathname, Stack} from 'expo-router'
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context'
import {useTranslation, type ToastType} from '@/hooks/ui'
import {STORAGE_KEYS} from '@/config/constants'
import {PrimaryButton, PrimaryButtonText} from '@/types/button'
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const LEGAL_CONSENT_KEY = STORAGE_KEYS.LEGAL_CONSENT_ACCEPTED

function CurrentToast() {
    const currentToast = useToastState()

    if (!currentToast || currentToast.isHandledNatively) return null

    const type = (currentToast.customData?.type as ToastType) || 'info'

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: '$green4',
                    borderColor: '$green7',
                    icon: CheckCircle,
                    iconColor: '$green10'
                }
            case 'error':
                return {
                    backgroundColor: '$red4',
                    borderColor: '$red7',
                    icon: XCircle,
                    iconColor: '$red10'
                }
            case 'warning':
                return {
                    backgroundColor: '$orange4',
                    borderColor: '$orange7',
                    icon: AlertTriangle,
                    iconColor: '$orange10'
                }
            case 'info':
            default:
                return {
                    backgroundColor: '$blue4',
                    borderColor: '$blue7',
                    icon: Info,
                    iconColor: '$blue10'
                }
        }
    }

    const styles = getToastStyles(type)
    const IconComponent = styles.icon

    return (
        <Toast
            key={currentToast.id}
            duration={currentToast.duration}
            animation="100ms"
            enterStyle={{opacity: 0, scale: 0.9, y: -10}}
            exitStyle={{opacity: 0, scale: 0.9, y: -10}}
            opacity={1}
            y={0}
            scale={1}
            backgroundColor={styles.backgroundColor}
            borderWidth={1}
            borderColor={styles.borderColor}
            padding="$3"
            borderRadius="$4"
            elevate
            minWidth={300}
            maxWidth={500}
        >
            <XStack gap="$3" alignItems="center" width="100%">
                <IconComponent size={24} color={styles.iconColor}/>
                <YStack flex={1} gap="$1">
                    <Toast.Title fontSize="$5" fontWeight="600" color="$color" lineHeight="$1">
                        {currentToast.title}
                    </Toast.Title>
                    {!!currentToast.message && (
                        <Toast.Description fontSize="$3" color="$color" opacity={0.8} lineHeight="$1">
                            {currentToast.message}
                        </Toast.Description>
                    )}
                </YStack>
            </XStack>
        </Toast>
    )
}

function SafeToastViewport() {
    const {top, right, left} = useSafeAreaInsets()
    return (
        <ToastViewport
            flexDirection="column-reverse"
            top={Platform.OS === 'web' ? '$4' : top + 8}
            left={left || '$4'}
            right={right || '$4'}
        />
    )
}

function LegalConsentDialog({
    open,
    onAccept,
}: {
    open: boolean
    onAccept: () => void
}) {
    const {t} = useTranslation()
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        if (!open) {
            setIsChecked(false)
        }
    }, [open])

    return (
        <Dialog modal open={open} onOpenChange={() => {}}>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="legal-consent-overlay"
                    animation="quick"
                    opacity={0.55}
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                />
                <Dialog.Content
                    key="legal-consent-content"
                    bordered
                    elevate
                    maxWidth={560}
                    width="92%"
                    gap="$4"
                    backgroundColor="$content1"
                    enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.95}}
                    exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                >
                    <Dialog.Title fontSize={22} fontWeight="700" color="$accent8">
                        {t('legalConsent.title')}
                    </Dialog.Title>
                    <Dialog.Description color="$color" lineHeight={22}>
                        {t('legalConsent.description')}
                    </Dialog.Description>

                    <Link href="/disclaimer">
                        <Text color="$accent8" textDecorationLine="underline" fontWeight="600">
                            {t('legalConsent.fullTextLink')}
                        </Text>
                    </Link>

                    <XStack gap="$3" alignItems="flex-start">
                        <Checkbox
                            id="legal-consent-checkbox"
                            checked={isChecked}
                            onCheckedChange={(checked) => setIsChecked(checked === true)}
                            size="$4"
                            borderColor="$borderColor"
                            marginTop={2}
                        >
                            <Checkbox.Indicator>
                                <Text fontWeight="700">✓</Text>
                            </Checkbox.Indicator>
                        </Checkbox>
                        <Text flex={1} color="$color">
                            {t('legalConsent.acceptLabel')}
                        </Text>
                    </XStack>

                    <PrimaryButton
                        size="$4"
                        width="100%"
                        disabled={!isChecked}
                        onPress={onAccept}
                    >
                        <PrimaryButtonText>
                            {t('legalConsent.confirmButton')}
                        </PrimaryButtonText>
                    </PrimaryButton>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    )
}

function RootContent() {
    const {currentTheme} = useThemeContext()
    const logger = useMemo(() => createLogger('RootContent'), [])
    const pathname = usePathname()
    const [isLegalConsentLoading, setIsLegalConsentLoading] = useState(true)
    const [hasAcceptedLegalConsent, setHasAcceptedLegalConsent] = useState(false)

    const isWeb = Platform.OS === 'web'
    const shouldShowFooter = isWeb
    const isLegalTextRoute = pathname === '/disclaimer' || pathname === '/terms-of-service'
    const shouldBlockAppUsage = !isLegalConsentLoading && !hasAcceptedLegalConsent && !isLegalTextRoute

    useEffect(() => {
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
            document.title = 'MARLIN - Maritime Live Information'
        }

        if (Platform.OS !== 'web') {
            LogBox.ignoreLogs([
                'Request failed due to a permanent error: Canceled',
                'Mbgl-HttpRequest',
                'MapLibre info',
                'IndexOutOfBoundsException', // MapLibre Fabric renderer race condition
                'getFeatureAt', // MapLibre marker removal race condition
            ])
        }

        // Global unhandled promise rejection handler
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            logger.error('Unhandled Promise Rejection', event.reason as Error | string);
            // Prevent app crash
            event.preventDefault?.();
        };

        // Global error handler
        const handleError = (event: ErrorEvent) => {
            logger.error('Uncaught Error', event.error as Error);
            // Prevent app crash
            event.preventDefault?.();
        };

        // Register handlers
        if (Platform.OS === 'web') {
            window.addEventListener('unhandledrejection', handleUnhandledRejection);
            window.addEventListener('error', handleError);

            // Cleanup
            return () => {
                window.removeEventListener('unhandledrejection', handleUnhandledRejection);
                window.removeEventListener('error', handleError);
            };
        } else {
            // For React Native, handle unhandled errors at app level
            const originalErrorHandler = ErrorUtils?.getGlobalHandler?.();
            if (ErrorUtils?.setGlobalHandler) {
                ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
                    logger.error('Uncaught Error (React Native)', error);
                    // Still call original handler if needed
                    originalErrorHandler?.(error, isFatal);
                });
            }
        }
    }, [logger])

    useEffect(() => {
        const loadLegalConsent = async () => {
            try {
                const consentValue = Platform.OS === 'web'
                    ? (typeof localStorage !== 'undefined' ? localStorage.getItem(LEGAL_CONSENT_KEY) : null)
                    : await AsyncStorage.getItem(LEGAL_CONSENT_KEY)

                setHasAcceptedLegalConsent(consentValue === 'true')
            } catch (error) {
                logger.error('Failed to load legal consent status', error)
                setHasAcceptedLegalConsent(false)
            } finally {
                setIsLegalConsentLoading(false)
            }
        }

        void loadLegalConsent()
    }, [logger])

    const handleAcceptLegalConsent = async () => {
        try {
            if (Platform.OS === 'web') {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(LEGAL_CONSENT_KEY, 'true')
                }
            } else {
                await AsyncStorage.setItem(LEGAL_CONSENT_KEY, 'true')
            }

            setHasAcceptedLegalConsent(true)
        } catch (error) {
            logger.error('Failed to persist legal consent', error)
        }
    }

    return (
         <ActionSheetProvider>
            <Theme name={currentTheme}>
                <ToastProvider>
                    <AuthProvider>
                        <CurrentToast/>
                        {isLegalConsentLoading ? (
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Spinner size="large"/>
                            </View>
                        ) : (
                            <>
                                {isWeb ? (
                                    <View style={{flex: 1}}>
                                        <NavbarWeb/>
                                        <View style={{flex: 1}}>
                                            <Slot/>
                                        </View>
                                        {shouldShowFooter && <Footer/>}
                                        <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'}/>
                                    </View>
                                ) : (
                                    <Stack screenOptions={{headerShown: false}}>
                                        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                                        <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                                        <Stack.Screen name="(profile)" options={{headerShown: false}}/>
                                        <Stack.Screen name="(about)" options={{headerShown: false}}/>
                                        <Stack.Screen name="(other)" options={{headerShown: false}}/>
                                    </Stack>
                                )}
                                <LegalConsentDialog
                                    open={shouldBlockAppUsage}
                                    onAccept={handleAcceptLegalConsent}
                                />
                            </>
                        )}
                    </AuthProvider>
                    <SafeToastViewport/>
                </ToastProvider>
            </Theme>
         </ActionSheetProvider>
    );
}

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const [loaded] = useFonts({
        Oswald_400Regular,
        Oswald_500Medium,
        Oswald_600SemiBold,
        Oswald_700Bold,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    })

    if (!loaded) return null

    return (
        <SafeAreaProvider>
            <TamaguiProvider config={tamaguiConfig}>
                <PortalProvider shouldAddRootHost>
                    <ThemeProvider>
                        <RootContent/>
                    </ThemeProvider>
                </PortalProvider>
            </TamaguiProvider>
        </SafeAreaProvider>
    )
}
