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
import {useEffect, useMemo} from 'react'
import 'react-native-reanimated'
import '../global.css'
import {createLogger} from '@/utils/logger'

import tamaguiConfig from '@/tamagui.config'
import {PortalProvider} from '@tamagui/portal'
import {TamaguiProvider, Theme, XStack, YStack, Text, useTheme} from 'tamagui'
import {Toast, ToastProvider, ToastViewport, useToastState} from '@tamagui/toast'
import {CheckCircle, XCircle, AlertTriangle, Info, LayoutDashboard, User} from '@tamagui/lucide-icons'

import {NavbarWeb} from '@/components/navigation/web/navbar'
import {Footer} from '@/components/navigation/web/Footer'
import {AuthProvider} from '@/context/SessionContext'
import {ThemeProvider, useThemeContext} from '@/context/ThemeSwitch.tsx'
import {Slot, usePathname, Tabs} from 'expo-router'
import {MapIcon, LOGO} from '@/components/ui/Icons'
import {useTranslation} from '@/hooks/ui'
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context'
import type {ToastType} from '@/hooks/ui'


function TabBarIcon({ icon: Icon, color }: { icon: any; color: string }) {
    return <Icon size={24} color={color} />;
}

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

function RootContent() {
    const {currentTheme} = useThemeContext()
    const logger = useMemo(() => createLogger('RootContent'), [])
    const pathname = usePathname()
    const {t} = useTranslation()
    const insets = useSafeAreaInsets()
    const theme = useTheme()

    const isWeb = Platform.OS === 'web'
    const shouldShowFooter = isWeb && pathname !== '/map'

    useEffect(() => {
        if (Platform.OS === 'web' && typeof document !== 'undefined') {
            document.title = 'MARLIN - Maritime Live Information'
        }

        if (Platform.OS !== 'web') {
            LogBox.ignoreLogs([
                'Request failed due to a permanent error: Canceled',
                'Mbgl-HttpRequest',
                'MapLibre info',
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

    return (
        <Theme name={currentTheme}>
            <ToastProvider>
                <AuthProvider>
                    <CurrentToast/>
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
                        <YStack flex={1}>
                            {/* Header with Logo - matching NavbarWeb styling */}
                            <XStack
                                backgroundColor="$background"
                                alignItems="center"
                                paddingHorizontal="$4"
                                paddingVertical="$1"
                                paddingTop={insets.top}
                                gap="$2"
                            >
                                <LOGO size={50} color={theme.accent8?.val} />
                                <Text
                                    fontSize={28}
                                    fontFamily="$oswald"
                                    fontWeight="bold"
                                    color="$accent8"
                                >
                                    Marlin
                                </Text>
                            </XStack>

                            {/* Tab Navigation - Only 3 main tabs */}
                            <Tabs
                                screenOptions={{
                                    headerShown: false,
                                    tabBarStyle: {
                                        backgroundColor: theme.background?.val,
                                        borderTopColor: theme.borderColor?.val,
                                        borderTopWidth: 1,
                                        paddingBottom: insets.bottom + 8,
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        height: 80 + insets.bottom,
                                    },
                                    tabBarLabelPosition: 'below-icon',
                                    tabBarActiveTintColor: theme.accent7?.val || '#0066CC',
                                    tabBarInactiveTintColor: theme.accent8?.val || '#666666',
                                }}
                            >
                                {/* Map Tab */}
                                <Tabs.Screen
                                    name="(map)/map"
                                    options={{
                                        title: t('navigation.map'),
                                        tabBarIcon: ({ color }) => (
                                            <TabBarIcon icon={MapIcon} color={color} />
                                        ),
                                    }}
                                />

                                {/* Dashboard Tab */}
                                <Tabs.Screen
                                    name='(dashboard)/marina/[name]'
                                    options={{
                                        title: t('navigation.dashboard'),
                                        tabBarIcon: ({ color }) => (
                                            <TabBarIcon icon={LayoutDashboard} color={color} />
                                        ),
                                    }}
                                    initialParams={{ name: 'Stadthafen Flensburg "Im Jaich"' }}
                                />

                                {/* Account Tab */}
                                <Tabs.Screen
                                    name="(profile)/profile"
                                    options={{
                                        title: t('navigation.account'),
                                        tabBarIcon: ({ color }) => (
                                            <TabBarIcon icon={User} color={color} />
                                        ),
                                    }}
                                />
                            </Tabs>
                        </YStack>
                    )}
                </AuthProvider>
                <SafeToastViewport/>
            </ToastProvider>
        </Theme>
    );
}

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
