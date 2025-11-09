import {LanguageSelector} from '@/components/common/LanguageSelector';
import {CloudIcon, LOGO, BadgeIcon, MapIcon, MoonFilledIcon, SunFilledIcon} from '@/components/ui/Icons';
import {useSession} from '@/context/SessionContext';
import {useThemeContext} from '@/context/ThemeSwitch.tsx';
import {useTranslation} from '@/hooks/useTranslation';
import {Languages, LayoutDashboard, Menu, User, BookOpen, LogOut} from '@tamagui/lucide-icons';
import {Link, useRouter, Href} from 'expo-router';
import React, {useState} from 'react';
import {ScrollView, Linking} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Sheet, Text, useTheme, XStack, YStack, Button} from 'tamagui';

export function TabBarNative() {
    const router = useRouter();
    const t = useTheme();
    const {session, logout} = useSession();
    const {t: translate} = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const insets = useSafeAreaInsets();

    const {isDark, toggleTheme} = useThemeContext();

    const closeMenu = () => setIsMenuOpen(false);

    const navigateAndClose = (path: string) => {
        setIsMenuOpen(false);
        requestAnimationFrame(() => router.push(path as any));
    };

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    return (
        <>
            {/* Top Header */}
            <XStack
                backgroundColor={"$background"}
                alignItems={"center"}
                justifyContent="space-between"
                paddingHorizontal={"$4"}
                paddingVertical={"$3"}
                paddingTop={insets.top + 12}
                borderBottomWidth={1}
                borderBottomColor="$borderColor"
                width="100%"
            >
                {/* Logo */}
                <Link href="/map">
                    <XStack alignItems="center" gap="$2">
                        <LOGO size={50} color={t.accent8?.val}/>
                        <Text
                            fontSize={28}
                            fontFamily={"$oswald"}
                            fontWeight="bold"
                            color={"$accent8"}
                        >
                            Marlin
                        </Text>
                    </XStack>
                </Link>

                {/* Right side controls */}
                <Button
                    onPress={() => setIsMenuOpen(true)}
                    circular
                    size="$4"
                    backgroundColor="$background"
                    borderWidth={2}
                    borderColor="$accent8"
                    hoverStyle={{
                        backgroundColor: "$backgroundHover",
                        borderColor: "$accent9"
                    }}
                    pressStyle={{
                        backgroundColor: "$backgroundPress",
                        borderColor: "$accent10",
                        scale: 0.95
                    }}
                >
                    <Menu size={24} color={t.accent8?.val} strokeWidth={2.5}/>
                </Button>
            </XStack>

            {/* Mobile Menu Sheet */}
            <Sheet
                modal
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                snapPoints={[85, 50]}
                dismissOnSnapToBottom
                animation="medium"
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                    opacity={0}
                />
                <Sheet.Frame
                    padding="$0"
                    backgroundColor="$background"
                    borderTopLeftRadius="$6"
                    borderTopRightRadius="$6"
                >
                    <Sheet.Handle backgroundColor="$borderColor"/>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <YStack padding="$4" gap="$2">
                            {/* Header */}
                            <XStack justifyContent="space-between" alignItems="center" paddingBottom="$4"
                                    borderBottomWidth={1} borderBottomColor="$borderColor">
                                <Text fontSize="$7" fontWeight="bold" color="$accent8" fontFamily="$oswald">
                                    Menu
                                </Text>
                                <Button
                                    circular
                                    size="$3"
                                    chromeless
                                    onPress={closeMenu}
                                >
                                    <Text fontSize="$6" color="$color">✕</Text>
                                </Button>
                            </XStack>

                            {/* Navigation Items */}
                            <YStack gap="$2" paddingTop="$3">
                                <Link href={"/map" as Href} onPress={closeMenu} asChild>
                                    <XStack
                                        alignItems="center"
                                        gap="$3"
                                        padding="$3"
                                        borderColor={"$borderColor"}
                                        borderWidth={"$1"}
                                        borderRadius="$3"
                                        pressStyle={{
                                            backgroundColor: "$backgroundPress"
                                        }}
                                    >
                                        <MapIcon color={t.accent8?.val} size={24}/>
                                        <Text fontSize="$5" fontWeight="500" color="$accent8">
                                            {translate('navigation.map')}
                                        </Text>
                                    </XStack>
                                </Link>

                                <Link href={"/dashboard/5" as Href} onPress={closeMenu} asChild>
                                    <XStack
                                        alignItems="center"
                                        gap="$3"
                                        padding="$3"
                                        borderColor={"$borderColor"}
                                        borderWidth={"$1"}
                                        borderRadius="$3"
                                        pressStyle={{
                                            backgroundColor: "$backgroundPress"
                                        }}
                                    >
                                        <LayoutDashboard color={t.accent8?.val} size={24}/>
                                        <Text fontSize="$5" fontWeight="500" color="$accent8">
                                            {translate('dashboard.dashboard')}
                                        </Text>
                                    </XStack>
                                </Link>

                                <XStack
                                    alignItems={"center"}
                                    justifyContent="center"
                                    gap="$6"
                                    paddingVertical="$2"
                                >
                                    <YStack
                                        alignItems={"center"}
                                        justifyContent="center"
                                        gap="$1"
                                        paddingVertical="$2"
                                    >
                                        <Button
                                            circular
                                            size="$4"
                                            padding={"$2"}
                                            backgroundColor={"$accent1"}
                                            chromeless
                                            onPress={() => navigateAndClose('/(about)/api')}
                                        >
                                            <CloudIcon color={t.accent12?.val} size={30}/>
                                        </Button>
                                        <Text
                                            fontSize="$4"
                                            fontWeight="500"
                                            textAlign={"center"}
                                            textOverflow={"ellipsis"}
                                        >
                                            API
                                        </Text>
                                    </YStack>

                                    <YStack
                                        alignItems={"center"}
                                        justifyContent="center"
                                        gap="$1"
                                        paddingVertical="$2"
                                    >
                                        <Button
                                            circular
                                            size="$4"
                                            padding={"$2"}
                                            backgroundColor={"$accent1"}
                                            chromeless
                                            onPress={() => navigateAndClose('/(about)/sensors')}
                                        >
                                            <BadgeIcon color={t.accent12?.val} size={30}/>
                                        </Button>
                                        <Text
                                            fontSize="$4"
                                            fontWeight="500"
                                            textAlign={"center"}
                                            textOverflow={"ellipsis"}
                                        >
                                            Sensoren
                                        </Text>
                                    </YStack>

                                    <YStack
                                        alignItems={"center"}
                                        justifyContent="center"
                                        gap="$1"
                                        paddingVertical="$2"
                                    >
                                        <Button
                                            circular
                                            size="$4"
                                            padding={"$2"}
                                            backgroundColor={"$accent1"}
                                            chromeless
                                            onPress={() => Linking.openURL('https://projekt.marlin-live.com')}
                                        >
                                            <BookOpen color={t.accent12?.val} size={30}/>
                                        </Button>
                                        <Text
                                            fontSize="$4"
                                            fontWeight="500"
                                            textAlign={"center"}
                                            textOverflow={"ellipsis"}
                                        >
                                            Projekt
                                        </Text>
                                    </YStack>
                                </XStack>
                            </YStack>

                            {/* Settings */}
                            <YStack gap="$3" paddingTop="$4" borderTopWidth={1} borderTopColor="$borderColor">
                                <YStack gap="$2">
                                    <XStack gap="$3" padding="$3" alignItems="center" justifyContent="space-between">
                                        <XStack gap="$2" alignItems="center">
                                            <Languages color={t.accent8?.val} size={22}/>
                                            <Text fontSize="$4" fontWeight="500" color="$color">
                                                {translate('settings.language')}
                                            </Text>
                                        </XStack>
                                        <Text fontSize="$3" color="$color">
                                            {translate('language.name')}
                                        </Text>
                                    </XStack>
                                    <YStack paddingHorizontal="$3">
                                        <LanguageSelector/>
                                    </YStack>
                                </YStack>

                                <XStack gap="$3" padding="$3" alignItems="center" justifyContent="space-between">
                                    <XStack gap="$2" alignItems="center">
                                        <Text fontSize="$4" fontWeight="500" color="$color">
                                            {translate('settings.theme')}
                                        </Text>
                                    </XStack>
                                    <Button
                                        size="$3"
                                        circular
                                        chromeless
                                        backgroundColor="$gray5"
                                        onPress={toggleTheme}
                                    >
                                        {isDark ? (
                                            <SunFilledIcon size={20} color={t.accent8?.val}/>
                                        ) : (
                                            <MoonFilledIcon size={20} color={t.accent8?.val}/>
                                        )}
                                    </Button>
                                </XStack>
                            </YStack>

                            {/* Auth Buttons */}
                            {!session && (
                                <YStack gap="$3" paddingTop="$4">
                                    <Button
                                        size="$5"
                                        backgroundColor="$accent7"
                                        onPress={() => navigateAndClose('/login')}
                                    >
                                        <Text color="#ffffff" fontSize="$5" fontWeight="600">
                                            {translate('auth.login')}
                                        </Text>
                                    </Button>
                                    <Button
                                        size="$5"
                                        variant="outlined"
                                        onPress={() => navigateAndClose('/register')}
                                    >
                                        <Text fontSize="$5" fontWeight="600">
                                            {translate('auth.register')}
                                        </Text>
                                    </Button>
                                </YStack>
                            )}

                            {session && (
                                <YStack gap="$3" paddingTop="$4">
                                    <Button
                                        size="$5"
                                        variant="outlined"
                                        onPress={() => navigateAndClose('/(profile)/profile')}
                                    >
                                        <XStack alignItems="center" gap="$2">
                                            <User size={20} color={"$accent8"}/>
                                            <Text fontSize="$5" fontWeight="600">
                                                {translate('navigation.profile')}
                                            </Text>
                                        </XStack>
                                    </Button>
                                    <Button
                                        size="$5"
                                        variant="outlined"
                                        onPress={handleLogout}
                                    >
                                        <XStack alignItems="center" gap="$2">
                                            <LogOut size={20} color={"$accent8"}/>
                                            <Text fontSize="$5" fontWeight="600">
                                                {translate('auth.logout')}
                                            </Text>
                                        </XStack>
                                    </Button>
                                </YStack>
                            )}
                        </YStack>
                    </ScrollView>
                </Sheet.Frame>
            </Sheet>
        </>
    );
}


