import { Tabs } from 'expo-router';
import { MapIcon, LOGO } from '@/components/ui/Icons';
import { LayoutDashboard, User, Languages } from '@tamagui/lucide-icons';
import { useTranslation } from '@/hooks/ui';
import { XStack, Text, useTheme, Popover } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageSelector } from '@/components/common/LanguageSelector';

function TabBarIcon({ icon: Icon, color }: { icon: any; color: string }) {
    return <Icon size={24} color={color} />;
}

export default function TabLayout() {
    const { t } = useTranslation();
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.accent7?.val || '#0066CC',
                tabBarInactiveTintColor: theme.accent8?.val || '#666666',
                tabBarStyle: {
                    backgroundColor: theme.background?.val,
                    borderTopColor: theme.borderColor?.val,
                    borderTopWidth: 1,
                    paddingBottom: insets.bottom + 8,
                    paddingTop: 8,
                    height: 60 + insets.bottom,
                },
                headerShown: true,
                header: () => (
                    <XStack
                        backgroundColor="$background"
                        justifyContent="space-between"
                        alignItems="center"
                        paddingHorizontal="$4"
                        paddingTop={insets.top}
                        paddingBottom="$2"
                        gap="$4"
                    >
                        {/* Logo and Name */}
                        <XStack alignItems="center" gap="$2">
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

                        {/* Right side - Language selector */}
                        <Popover placement="bottom" allowFlip>
                            <Popover.Trigger asChild>
                                <XStack alignItems="center" cursor="pointer">
                                    <Languages color={theme.accent8?.val} size={24}/>
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
                    </XStack>
                ),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: t('navigation.map'),
                    tabBarIcon: ({ color }) => <TabBarIcon icon={MapIcon} color={color} />,
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: t('navigation.dashboard'),
                    tabBarIcon: ({ color }) => <TabBarIcon icon={LayoutDashboard} color={color} />,
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: t('navigation.account'),
                    tabBarIcon: ({ color }) => <TabBarIcon icon={User} color={color} />,
                }}
            />
            {/* Hidden screens - accessible but not shown in tab bar */}
            <Tabs.Screen
                name="login"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="register"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="profile-detail"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="create-profile"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
