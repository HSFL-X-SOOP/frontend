import '@/i18n'
import {
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold,
    useFonts
} from '@expo-google-fonts/oswald'
import {StatusBar} from 'expo-status-bar'
import {Platform, View, LogBox, PermissionsAndroid} from 'react-native'
import {useEffect} from 'react'
import 'react-native-reanimated'
import '../global.css'

import tamaguiConfig from '@/tamagui.config'
import {PortalProvider} from '@tamagui/portal'
import {TamaguiProvider, Theme, XStack, YStack} from 'tamagui'
import {Toast, ToastProvider, ToastViewport, useToastState} from '@tamagui/toast'
import {CheckCircle, XCircle, AlertTriangle, Info} from '@tamagui/lucide-icons'

import {TabBarNative} from "@/components/navigation/native/tabbar.tsx"
import {NavbarWeb} from '@/components/navigation/web/navbar'
import {Footer} from '@/components/navigation/web/Footer'
import {AuthProvider} from '@/context/SessionContext'
import {ThemeProvider, useThemeContext} from '@/context/ThemeSwitch.tsx'
import {usePathname, Slot} from 'expo-router'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import type {ToastType} from '@/hooks/useToast'


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
    const pathname = usePathname()

    const shouldShowFooter = Platform.OS === 'web' && pathname !== '/map'

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
    }, [])

    return (
        <Theme name={currentTheme}>
            <ToastProvider>
                <AuthProvider>
                    <CurrentToast/>
                    <View style={{flex: 1}}>
                        {Platform.OS === 'web' ? <NavbarWeb/> : <TabBarNative/>}
                        <View style={{flex: 1}}>
                            <Slot/>
                        </View>
                        {shouldShowFooter && <Footer/>}
                        <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'}/>
                    </View>
                </AuthProvider>
                <SafeToastViewport/>
            </ToastProvider>
        </Theme>
    )
}

export default function RootLayout() {
    const [loaded] = useFonts({
        Oswald_400Regular,
        Oswald_500Medium,
        Oswald_600SemiBold,
        Oswald_700Bold,
    })

    if (!loaded) return null

    return (
        <TamaguiProvider config={tamaguiConfig}>
            <PortalProvider shouldAddRootHost>
                <ThemeProvider>
                    <RootContent/>
                </ThemeProvider>
            </PortalProvider>
        </TamaguiProvider>
    )
}
