import {Link, useRouter, Href, useSegments} from 'expo-router';
import {Button, Popover, Sheet, Text, XStack, YStack, useTheme, ScrollView, Tooltip} from 'tamagui';
import {useState} from 'react';

import {useToast,useTranslation,useIsMobileWeb} from '@/hooks/ui';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemeSwitch} from '@/context/ThemeSwitch';
import {LOGO, BadgeIcon, MapIcon, CloudIcon} from '@/components/ui/Icons';
import {User, Languages, Menu, LogOut, LayoutDashboard, BookOpen} from '@tamagui/lucide-icons';
import {useSession} from '@/context/SessionContext';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText, IconButton} from '@/types/button';

import {LanguageSelector} from '@/components/common/LanguageSelector';
import {getMapRoute} from '@/utils/navigation';

import {UI_CONSTANTS} from '@/config/constants';
import { AutoHideNavBar } from '@/components/navigation/web/AutoHideNavBar';

export function NavbarWeb() {
    const router = useRouter();
    const t = useTheme();
    const {session, logout} = useSession();
    const {t: translate} = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobileWeb = useIsMobileWeb();
    const toast = useToast();
    const insets = useSafeAreaInsets();
    const logoSize = isMobileWeb ? 50 : 55;
    const navbarMinHeight = logoSize + (isMobileWeb ? 12 : 16);
    const logoVerticalOffset = isMobileWeb ? 1 : 2;
    const segments = useSegments();

    const handleLogout = () => {
        logout();
        toast.info(translate('auth.logoutSuccess'), {
            message: translate('auth.logoutMessage'),
            duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
        });
        router.push(getMapRoute());
    };

    const isPublicDisplay = segments.includes('public-display' as never);

    const navbar = (
        <XStack
            jc={"space-between"}
            backgroundColor={"$background"}
            alignItems={"center"}
            px={"$14"}
            $md={{px: "$4"}}
            gap={"$4"}
            py={isMobileWeb ? "$1" : "$2"}
            minHeight={navbarMinHeight}
        >
            <Link href={"/" as Href}>
                <XStack alignItems="center" jc="flex-start" gap="$2" minHeight={logoSize}>
                    <YStack height={logoSize} justifyContent="center">
                        <LOGO
                            size={logoSize}
                            color={t.accent8?.val}
                            style={{transform: [{translateY: logoVerticalOffset}]}}
                        />
                    </YStack>
                    <YStack
                        gap="$0"
                        justifyContent="center"
                        alignItems="flex-start"
                        height={logoSize}
                    >
                        <Text fontSize={isMobileWeb ? 28 : 32} fontFamily={"$oswald"} fontWeight="bold"
                              textAlign={"left"} color={"$accent8"}>Marlin</Text>
                        <Text
                            fontSize={isMobileWeb ? 10 : 12}
                            fontWeight="600"
                            fontFamily={"$oswald"}
                            color={"$accent8"}
                            letterSpacing={1}
                        >
                            MARLIN - Maritime Live Information
                        </Text>
                    </YStack>
                </XStack>
            </Link>

            {!isMobileWeb && (
                <XStack alignItems={"center"} gap={"$8"}>
                    <Link href={"/" as Href}>
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
                            <IconButton
                                size="$3"
                                onPress={() => router.push("/(about)/api")}
                                cursor="pointer"
                            >
                                <CloudIcon color={t.accent8?.val} size={26}/>
                            </IconButton>
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
                            <IconButton
                                size="$3"
                                onPress={() => router.push("/(about)/sensors")}
                                cursor="pointer"
                            >
                                <BadgeIcon color={t.accent8?.val} size={26}/>
                            </IconButton>
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
                            <IconButton
                                size="$3"
                                onPress={() => window.open('https://projekt.marlin-live.com', '_blank')}
                                cursor="pointer"
                            >
                                <BookOpen color={t.accent8?.val} size={24}/>
                            </IconButton>
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
            )}

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
                    paddingBottom={insets.bottom + 16}
                >
                    <Sheet.Handle backgroundColor="$borderColor"/>

                    <ScrollView>
                        <YStack padding="$4" gap="$2">
                            <XStack justifyContent="space-between" alignItems="center" paddingBottom="$4"
                                    borderBottomWidth={1} borderBottomColor="$borderColor">
                                <Text fontSize="$7" fontWeight="bold" color="$accent8" fontFamily="$oswald">
                                    Menu
                                </Text>
                                <IconButton
                                    size="$3"
                                    onPress={() => setIsMenuOpen(false)}
                                >
                                    <Text fontSize="$6" color="$color">✕</Text>
                                </IconButton>
                            </XStack>

                            <YStack gap="$2" paddingTop="$3">
                                <Link href={"/" as Href} onPress={() => setIsMenuOpen(false)}>
                                    <XStack
                                        alignItems="center"
                                        gap="$3"
                                        padding="$3"
                                        borderColor={"$borderColor"}
                                        borderWidth={"$1"}
                                        borderRadius="$3"
                                        hoverStyle={{
                                            backgroundColor: "$backgroundHover"
                                        }}
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

                                <Link href={'/marina/Stadthafen Flensburg "Im Jaich"' as Href} onPress={() => setIsMenuOpen(false)}>
                                    <XStack
                                        alignItems="center"
                                        gap="$3"
                                        padding="$3"
                                        borderColor={"$borderColor"}
                                        borderWidth={"$1"}
                                        borderRadius="$3"
                                        hoverStyle={{
                                            backgroundColor: "$backgroundHover"
                                        }}
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
                                    gap="$4"
                                    paddingVertical="$2"
                                >
                                    <YStack
                                        alignItems={"center"}
                                        justifyContent="center"
                                        gap="$1"
                                        paddingVertical="$2"
                                    >
                                        <IconButton
                                            size="$4"
                                            padding={"$2"}
                                            backgroundColor={"$accent1"}
                                            onPress={() => {
                                                router.push("/(about)/api");
                                                setIsMenuOpen(false);
                                            }}
                                            cursor="pointer"
                                        >
                                            <CloudIcon color={t.accent12?.val} size={30}/>
                                        </IconButton>
                                        <Text
                                            fontSize="$4"
                                            fontWeight="500"
                                            color="$accent8"
                                            textAlign={"center"}
                                            textOverflow={"ellipsis"}>API</Text>
                                    </YStack>

                                    <YStack
                                        alignItems={"center"}
                                        justifyContent="center"
                                        gap="$1"
                                        paddingVertical="$2"
                                    >
                                        <IconButton
                                            size="$4"
                                            padding={"$2"}
                                            backgroundColor={"$accent1"}
                                            onPress={() => {
                                                router.push("/(about)/sensors");
                                                setIsMenuOpen(false);
                                            }}
                                            cursor="pointer"
                                        >
                                            <BadgeIcon color={t.accent12?.val} size={30}/>
                                        </IconButton>
                                        <Text
                                            fontSize="$4"
                                            fontWeight="500"
                                            color="$accent8"
                                            textAlign={"center"}
                                            textOverflow={"ellipsis"}>Sensoren</Text>
                                    </YStack>

                                    <YStack
                                        alignItems={"center"}
                                        justifyContent="center"
                                        gap="$1"
                                        paddingVertical="$2"
                                    >
                                        <IconButton
                                            size="$4"
                                            padding={"$2"}
                                            backgroundColor={"$accent1"}
                                            onPress={() => {
                                                window.open('https://projekt.marlin-live.com', '_blank');
                                                setIsMenuOpen(false);
                                            }}
                                            cursor="pointer"
                                        >
                                            <BookOpen color={t.accent12?.val} size={30}/>
                                        </IconButton>
                                        <Text
                                            fontSize="$4"
                                            fontWeight="500"
                                            color="$accent8"
                                            textAlign={"center"}
                                            textOverflow={"ellipsis"}>Projekt</Text>
                                    </YStack>
                                </XStack>
                            </YStack>

                            <YStack gap="$3" paddingTop="$4" borderTopWidth={1} borderTopColor="$borderColor">
                                <YStack gap="$2">
                                    <XStack gap="$3" padding="$3" alignItems="center" justifyContent="space-between">
                                        <XStack gap="$2" alignItems="center">
                                            <Languages color={t.accent8?.val} size={22}/>
                                            <Text fontSize="$4" fontWeight="500"
                                                  color="$color">{translate('settings.language')}</Text>
                                        </XStack>
                                        <Text fontSize="$3" color="$color">{translate('language.name')}</Text>
                                    </XStack>
                                    <YStack paddingHorizontal="$3">
                                        <LanguageSelector/>
                                    </YStack>
                                </YStack>

                                <XStack gap="$3" padding="$3" alignItems="center" justifyContent="space-between">
                                    <XStack gap="$2" alignItems="center">
                                        <Text fontSize="$4" fontWeight="500"
                                              color="$color">{translate('settings.theme')}</Text>
                                    </XStack>
                                    <ThemeSwitch size={24}/>
                                </XStack>
                            </YStack>

                            {!session && (
                                <YStack gap="$3" paddingTop="$4">
                                    <Link href={"/login" as Href} onPress={() => setIsMenuOpen(false)}>
                                        <PrimaryButton width="100%">
                                            <PrimaryButtonText fontSize="$5">
                                                {translate('auth.login')}
                                            </PrimaryButtonText>
                                        </PrimaryButton>
                                    </Link>
                                    <Link href={"/register" as Href} onPress={() => setIsMenuOpen(false)}>
                                        <SecondaryButton width="100%">
                                            <SecondaryButtonText color="$accent8" fontSize="$5">
                                                {translate('auth.register')}
                                            </SecondaryButtonText>
                                        </SecondaryButton>
                                    </Link>
                                </YStack>
                            )}

                            {session && (
                                <YStack gap="$3" paddingTop="$4">
                                    <Link href={"/(profile)/profile" as Href} onPress={() => setIsMenuOpen(false)}>
                                        <SecondaryButton width="100%">
                                            <XStack alignItems="center" gap="$2">
                                                <User size={24} color={"$accent8"}/>
                                                <SecondaryButtonText color="$accent8" fontSize="$5">
                                                    {translate('navigation.profile')}
                                                </SecondaryButtonText>
                                            </XStack>
                                        </SecondaryButton>
                                    </Link>
                                    <SecondaryButton width="100%" onPress={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}>
                                        <XStack alignItems="center" gap="$2">
                                            <LogOut size={24} color={"$accent8"}/>
                                            <SecondaryButtonText color="$accent8" fontSize="$5">
                                                {translate('auth.logout')}
                                            </SecondaryButtonText>
                                        </XStack>
                                    </SecondaryButton>
                                </YStack>
                            )}
                        </YStack>
                    </ScrollView>
                </Sheet.Frame>
            </Sheet>
        </XStack>
    );

    return (
        <AutoHideNavBar enabled={isPublicDisplay}>{navbar}</AutoHideNavBar>
    )
}