import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { XStack, YStack, Text, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapIcon, LOGO } from '@/components/ui/Icons';
import { LayoutDashboard, User } from '@tamagui/lucide-icons';
import { useTranslation } from '@/hooks/ui';

function TabBarIcon({ icon: Icon, color }: { icon: any; color: string }) {
    return <Icon size={24} color={color} />;
}

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const { t } = useTranslation();

    // Only render tabs on native platforms
    if (Platform.OS === 'web') {
        return null;
    }

    return (
        <YStack flex={1}>
            {/* Header with Logo */}
            <XStack
                backgroundColor="$background"
                alignItems="center"
                paddingHorizontal="$4"
                paddingVertical="$3"
                borderBottomWidth={1}
                borderBottomColor="$borderColor"
                gap="$2"
                zIndex={10}
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

            {/* Tab Content - using standard expo-router Tabs */}
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
                    tabBarLabel: ({ focused, color, children }) => (
                        <Text
                            fontSize="$2"
                            fontWeight="600"
                            color={focused ? '$accent7' : '$accent8'}
                            numberOfLines={1}
                        >
                            {children}
                        </Text>
                    ),
                }}
            >
                {/* Map Tab */}
                <Tabs.Screen
                    name="index"
                    options={{
                        title: t('navigation.map'),
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon icon={MapIcon} color={color} />
                        ),
                    }}
                />

                {/* Dashboard Tab */}
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: t('navigation.dashboard'),
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon icon={LayoutDashboard} color={color} />
                        ),
                    }}
                />

                {/* Account Tab */}
                <Tabs.Screen
                    name="account"
                    options={{
                        title: t('navigation.account'),
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon icon={User} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </YStack>
    );
}
