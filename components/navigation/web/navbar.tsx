import {Link, useRouter, Href} from 'expo-router';
import {Button, Popover, Sheet, Text, XStack, YStack, useTheme, Tooltip} from 'tamagui';
import {useState} from 'react';

import {useToast, useTranslation, useIsMobileWeb} from '@/hooks/ui';
import {ThemeSwitch, useThemeContext} from '@/context/ThemeSwitch';
import {LOGO, BadgeIcon, MapIcon, CloudIcon} from '@/components/ui/Icons';
import {User, Languages, Menu, LogOut, LayoutDashboard, BookOpen} from '@tamagui/lucide-icons';
import {useSession} from '@/context/SessionContext';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText, IconButton} from '@/types/button';

import {LanguageSelector} from '@/components/common/LanguageSelector';


import {UI_CONSTANTS} from '@/config/constants';


export function NavbarWeb() {
    const router = useRouter();
    const t = useTheme();
    const {session, logout} = useSession();
    const {t: translate} = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobileWeb = useIsMobileWeb();
    const toast = useToast();
    const {toggleTheme} = useThemeContext();

    const handleLogout = () => {
        logout();
        toast.info(translate('auth.logoutSuccess'), {
            message: translate('auth.logoutMessage'),
            duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
        });
        router.push('/map');
    };

    return (
        <XStack jc={"space-between"} backgroundColor={"$background"} alignItems={"center"} px={"$14"} $md={{px: "$4"}}
                gap={"$4"}
                py={"$1"}>
            <Link href={"/map" as Href}>
                <XStack ac="center" jc="flex-start" gap="$2">
                    <LOGO size={isMobileWeb ? 50 : 55} color={t.accent8?.val}/>
                    <Text fontSize={isMobileWeb ? 28 : 32} fontFamily={"$oswald"} alignSelf={"center"} fontWeight="bold"
                          textAlign={"left"} color={"$accent8"}>Marlin</Text>
                </XStack>
            </Link>

            {!isMobileWeb && (
                <XStack alignItems={"center"} gap={"$8"}>
                    <Link href={"/map" as Href}>
                        <XStack alignItems="center" gap="$3">
                            <MapIcon color={t.accent8?.val} size={26}/>
                            <Text fontSize="$6" fontWeight={"500"} alignSelf={"center"} color={"$accent8"}>
                                {translate('navigation.map')}
                            </Text>
                        </XStack>
                    </Link>

                    <Link href={'/marina/Stadthafen Flensburg "Im Jaich"' as Href}>
                        <XStack alignItems="center" gap="$3">
                            <LayoutDashboard color={t.accent8?.val} size={26}/>
                            <Text fontSize="$6" fontWeight={"500"} alignSelf={"center"} color={"$accent8"}>
                                {translate('dashboard.dashboard')}
                            </Text>
                        </XStack>
                    </Link>
                </XStack>
            )}

            {!isMobileWeb && (
                <XStack gap="$6" alignItems="center">
                    <Tooltip placement="bottom" delay={200}>
                        <Tooltip.Trigger>
                            <Button
                                circular
                                size="$3"
                                chromeless
                                onPress={() => router.push("/(about)/api")}
                                cursor="pointer"
                            >
                                <CloudIcon color={t.accent8?.val} size={26}/>
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                            enterStyle={{x: 0, y: -5, opacity: 0, scale: 0.9}}
                            exitStyle={{x: 0, y: -5, opacity: 0, scale: 0.9}}
                            scale={1}
                            x={0}
                            y={0}
                            opacity={1}
                            animation={[
                                'quick',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                        >
                            <Tooltip.Arrow/>
                            <Text fontSize="$3">{translate('navigation.api')}</Text>
                        </Tooltip.Content>
                    </Tooltip>

                    <Tooltip placement="bottom" delay={200}>
                        <Tooltip.Trigger>
                            <Button
                                circular
                                size="$3"
                                chromeless
                                onPress={() => router.push("/(about)/sensors")}
                                cursor="pointer"
                            >
                                <BadgeIcon color={t.accent8?.val} size={26}/>
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                            enterStyle={{x: 0, y: -5, opacity: 0, scale: 0.9}}
                            exitStyle={{x: 0, y: -5, opacity: 0, scale: 0.9}}
                            scale={1}
                            x={0}
                            y={0}
                            opacity={1}
                            animation={[
                                'quick',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                        >
                            <Tooltip.Arrow/>
                            <Text fontSize="$3">{translate('navigation.sensors')}</Text>
                        </Tooltip.Content>
                    </Tooltip>

                    <Tooltip placement="bottom" delay={200}>
                        <Tooltip.Trigger>
                            <Button
                                circular
                                size="$3"
                                chromeless
                                onPress={() => window.open('https://projekt.marlin-live.com', '_blank')}
                                cursor="pointer"
                            >
                                <BookOpen color={t.accent8?.val} size={24}/>
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                            enterStyle={{x: 0, y: -5, opacity: 0, scale: 0.9}}
                            exitStyle={{x: 0, y: -5, opacity: 0, scale: 0.9}}
                            scale={1}
                            x={0}
                            y={0}
                            opacity={1}
                            animation={[
                                'quick',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                        >
                            <Tooltip.Arrow/>
                            <Text fontSize="$3">{translate('navigation.projectWebsite')}</Text>
                        </Tooltip.Content>
                    </Tooltip>

                    <Popover placement="bottom" allowFlip>
                        <Popover.Trigger asChild>
                            <XStack alignItems={"center"} gap={"$2"} cursor="pointer">
                                <Languages color={t.accent8?.val} size={24}/>
                            </XStack>
                        </Popover.Trigger>

                        <Popover.Content
                            borderWidth={1}
                            borderColor="$borderColor"
                            enterStyle={{y: -10, opacity: 0}}
                            exitStyle={{y: -10, opacity: 0}}
                            elevate
                            animation={[
                                'quick',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                        >
                            <Popover.Arrow borderWidth={1} borderColor="$borderColor"/>
                            <LanguageSelector/>
                        </Popover.Content>
                    </Popover>

                    <ThemeSwitch size={24} color={"$background"}/>
                    {!session && (
                        <XStack gap="$2">
                            <Link href={"/login" as Href}>
                                <PrimaryButton>
                                    <PrimaryButtonText>
                                        {translate('auth.login')}
                                    </PrimaryButtonText>
                                </PrimaryButton>
                            </Link>

                            <Link href={"/register" as Href}>
                                <SecondaryButton>
                                    <SecondaryButtonText color="$accent8">
                                        {translate('auth.register')}
                                    </SecondaryButtonText>
                                </SecondaryButton>
                            </Link>
                        </XStack>
                    )}
                    {session && (
                        <XStack gap="$2">
                            <Link href={"/(profile)/profile" as Href}>
                                <SecondaryButton>
                                    <XStack alignItems="center" gap="$2">
                                        <User size={20} color={"$accent8"}/>
                                        <SecondaryButtonText color="$accent8">
                                            {translate('navigation.profile')}
                                        </SecondaryButtonText>
                                    </XStack>
                                </SecondaryButton>
                            </Link>
                            <SecondaryButton onPress={handleLogout}>
                                <XStack alignItems="center" gap="$2">
                                    <LogOut size={20} color={"$accent8"}/>
                                    <SecondaryButtonText color="$accent8">
                                        {translate('auth.logout')}
                                    </SecondaryButtonText>
                                </XStack>
                            </SecondaryButton>
                        </XStack>
                    )}
                </XStack>
            )}

            {isMobileWeb && (
                <IconButton
                    size="$4"
                    icon={Menu}
                    color="$accent8"
                    onPress={() => setIsMenuOpen(true)}
                    aria-label="Open menu"
                />
            )}

            <Sheet
                modal
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                snapPoints={[99]}
                dismissOnSnapToBottom
                animation="medium"
            >
                <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                    backgroundColor="rgba(0,0,0,0.5)"
                    opacity={1}
                />
                <Sheet.Frame
                    padding="$0"
                    backgroundColor="$background"
                    borderTopLeftRadius="$6"
                    borderTopRightRadius="$6"
                >
                    <Sheet.Handle backgroundColor="$borderColor"/>

                    <YStack padding="$3" gap="$2.5" height="100%">
                        {/* Header */}
                        <XStack justifyContent="space-between" alignItems="center" paddingBottom="$2">
                            <Text fontSize="$6" fontWeight="bold" color="$accent8" fontFamily="$oswald">
                                Menu
                            </Text>
                            <Button
                                circular
                                size="$2.5"
                                chromeless
                                onPress={() => setIsMenuOpen(false)}
                            >
                                <Text fontSize="$5" color="$color">✕</Text>
                            </Button>
                        </XStack>

                        {/* Main Navigation - Compact */}
                        <XStack gap="$2" width="100%">
                            <Link href={"/map" as Href} onPress={() => setIsMenuOpen(false)} asChild>
                                <Button flex={1} size="$3" chromeless backgroundColor="$accent2"
                                        pressStyle={{backgroundColor: "$accent3"}}>
                                    <YStack gap="$1" alignItems="center">
                                        <MapIcon color={t.accent8?.val} size={22}/>
                                        <Text fontSize="$2" fontWeight="500" color="$accent8">
                                            {translate('navigation.map')}
                                        </Text>
                                    </YStack>
                                </Button>
                            </Link>

                            <Link href={'/marina/Stadthafen Flensburg "Im Jaich"' as Href}
                                  onPress={() => setIsMenuOpen(false)} asChild>
                                <Button flex={1} size="$3" chromeless backgroundColor="$accent2"
                                        pressStyle={{backgroundColor: "$accent3"}}>
                                    <YStack gap="$1" alignItems="center">
                                        <LayoutDashboard color={t.accent8?.val} size={22}/>
                                        <Text fontSize="$2" fontWeight="500" color="$accent8">
                                            Dashboard
                                        </Text>
                                    </YStack>
                                </Button>
                            </Link>
                        </XStack>

                        {/* Quick Links Grid */}
                        <XStack gap="$2" width="100%" justifyContent="space-evenly" paddingVertical="$2">
                            <Button
                                circular
                                size="$4"
                                backgroundColor="$accent1"
                                chromeless
                                onPress={() => {
                                    router.push("/(about)/api");
                                    setIsMenuOpen(false);
                                }}
                                cursor="pointer"
                                pressStyle={{backgroundColor: "$accent3"}}
                            >
                                <YStack gap="$0.5" alignItems="center">
                                    <CloudIcon color={t.accent12?.val} size={24}/>
                                    <Text fontSize="$1" fontWeight="500" color="$accent8">API</Text>
                                </YStack>
                            </Button>

                            <Button
                                circular
                                size="$4"
                                backgroundColor="$accent1"
                                chromeless
                                onPress={() => {
                                    router.push("/(about)/sensors");
                                    setIsMenuOpen(false);
                                }}
                                cursor="pointer"
                                pressStyle={{backgroundColor: "$accent3"}}
                            >
                                <YStack gap="$0.5" alignItems="center">
                                    <BadgeIcon color={t.accent12?.val} size={24}/>
                                    <Text fontSize="$1" fontWeight="500" color="$accent8">Sensoren</Text>
                                </YStack>
                            </Button>

                            <Button
                                circular
                                size="$4"
                                backgroundColor="$accent1"
                                chromeless
                                onPress={() => window.open('https://projekt.marlin-live.com', '_blank')}
                                cursor="pointer"
                                pressStyle={{backgroundColor: "$accent3"}}
                            >
                                <YStack gap="$0.5" alignItems="center">
                                    <BookOpen color={t.accent12?.val} size={24}/>
                                    <Text fontSize="$1" fontWeight="500" color="$accent8">Projekt</Text>
                                </YStack>
                            </Button>
                        </XStack>

                        {/* Settings - Compact Inline */}
                        <YStack gap="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$borderColor">
                            <XStack gap="$2" alignItems="center" justifyContent="space-between" paddingHorizontal="$2">
                                <XStack gap="$2" alignItems="center" flex={1}>
                                    <Languages color={t.accent8?.val} size={18}/>
                                    <Text fontSize="$3" fontWeight="500"
                                          color="$color">{translate('settings.language')}</Text>
                                </XStack>
                                <LanguageSelector/>
                            </XStack>

                            <XStack gap="$2" alignItems="center" justifyContent="space-between" paddingHorizontal="$2">
                                <XStack gap="$2" alignItems="center" flex={1}>
                                    <Text fontSize="$3" fontWeight="500"
                                          color="$color">{translate('settings.theme')}</Text>
                                </XStack>
                                <Button
                                    size="$2.5"
                                    circular
                                    chromeless
                                    backgroundColor="$gray5"
                                    onPress={toggleTheme}
                                    pressStyle={{backgroundColor: "$gray6"}}
                                >
                                    <ThemeSwitch size={18}/>
                                </Button>
                            </XStack>
                        </YStack>

                        {/* Auth Section - Compact */}
                        {!session && (
                            <YStack gap="$2" paddingTop="$3" marginTop="auto">
                                <Link href={"/login" as Href} onPress={() => setIsMenuOpen(false)} asChild>
                                    <PrimaryButton width="100%" size="$3.5">
                                        <PrimaryButtonText fontSize="$4">
                                            {translate('auth.login')}
                                        </PrimaryButtonText>
                                    </PrimaryButton>
                                </Link>
                                <Link href={"/register" as Href} onPress={() => setIsMenuOpen(false)} asChild>
                                    <SecondaryButton width="100%" size="$3.5">
                                        <SecondaryButtonText color="$accent8" fontSize="$4">
                                            {translate('auth.register')}
                                        </SecondaryButtonText>
                                    </SecondaryButton>
                                </Link>
                            </YStack>
                        )}

                        {session && (
                            <YStack gap="$2" paddingTop="$3" marginTop="auto">
                                <Link href={"/(profile)/profile" as Href} onPress={() => setIsMenuOpen(false)} asChild>
                                    <SecondaryButton width="100%" size="$3.5">
                                        <XStack alignItems="center" gap="$2" justifyContent="center">
                                            <User size={20} color={"$accent8"}/>
                                            <SecondaryButtonText color="$accent8" fontSize="$4">
                                                {translate('navigation.profile')}
                                            </SecondaryButtonText>
                                        </XStack>
                                    </SecondaryButton>
                                </Link>
                                <SecondaryButton width="100%" size="$3.5" onPress={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}>
                                    <XStack alignItems="center" gap="$2" justifyContent="center">
                                        <LogOut size={20} color={"$accent8"}/>
                                        <SecondaryButtonText color="$accent8" fontSize="$4">
                                            {translate('auth.logout')}
                                        </SecondaryButtonText>
                                    </XStack>
                                </SecondaryButton>
                            </YStack>
                        )}
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </XStack>
    );
}
