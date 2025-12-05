import {ChevronLeft, ChevronRight} from '@tamagui/lucide-icons';
import {AnimatePresence, Button, ScrollView, View, XStack, YStack, Text, useTheme} from 'tamagui';
import {ReactNode} from 'react';
import {LocationWithBoxes} from '@/api/models/sensor';
import {SmallBadgeIcon} from "@/components/ui/Icons.tsx";
import {useIsMobileWeb} from '@/hooks/ui';
import {useViewportHeight} from '@/hooks/ui';
import {useThemeContext} from "@/context/ThemeSwitch.tsx";

interface MapSensorDrawerProps {
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode;
    sensors?: LocationWithBoxes[];
    onSensorSelect?: (sensor: LocationWithBoxes) => void;
}

const DRAWER_WIDTH = 400;
const COLLAPSED_WIDTH = 70;

export default function MapSensorDrawer({
                                            isOpen,
                                            onToggle,
                                            children,
                                            sensors = [],
                                            onSensorSelect
                                        }: MapSensorDrawerProps) {
    const isMobileWeb = useIsMobileWeb();
    const t = useTheme();
    const {isDark} = useThemeContext()
    const {viewportHeight, safeBottomOffset} = useViewportHeight();

    const drawerWidth = isOpen
        ? DRAWER_WIDTH
        : (isMobileWeb ? 0 : COLLAPSED_WIDTH);

    return (
        <View
            position="absolute"
            left={0}
            top={0}
            bottom={isMobileWeb && safeBottomOffset > 0 ? safeBottomOffset : 0}
            zIndex={1000}
            width={drawerWidth}
            animation="quick"
            backgroundColor="$background"
            borderRightWidth={isOpen || !isMobileWeb ? 1 : 0}
            borderColor="$borderColor"
            shadowColor="$shadowColor"
            shadowOffset={{width: 2, height: 0}}
            shadowOpacity={0.1}
            shadowRadius={8}
            overflow="hidden"
            height={isMobileWeb && viewportHeight > 0
                ? viewportHeight - safeBottomOffset
                : undefined}
        >
            {/* Drawer Content */}
            <YStack flex={1}>
                {/* Header with toggle button */}
                <XStack
                    paddingVertical="$3"
                    paddingHorizontal="$3"
                    borderBottomWidth={1}
                    borderColor="$borderColor"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <AnimatePresence>
                        {isOpen && (
                            <View
                                animation="quick"
                                enterStyle={{opacity: 0, x: -10}}
                                exitStyle={{opacity: 0, x: -10}}
                            >
                                <Button
                                    size="$3"
                                    chromeless
                                    icon={ChevronLeft}
                                    backgroundColor={"$background"}
                                    onPress={onToggle}
                                    borderColor={"$borderColor"}
                                    circular
                                    aria-label="Collapse drawer"
                                />
                            </View>
                        )}
                    </AnimatePresence>

                    {!isOpen && (
                        <Button
                            size="$3"
                            chromeless
                            backgroundColor={"$background"}
                            borderColor={"$borderColor"}
                            icon={ChevronRight}
                            onPress={onToggle}
                            circular
                            aria-label="Expand drawer"
                        />
                    )}
                </XStack>

                {/* Content Area */}
                <AnimatePresence>
                    {isOpen && (
                        <View
                            flex={1}
                            animation="quick"
                            enterStyle={{opacity: 0, x: -20}}
                            exitStyle={{opacity: 0, x: -20}}
                        >
                            {children}
                        </View>
                    )}
                </AnimatePresence>

                {/* Collapsed state - show compact sensor list */}
                {!isOpen && (
                    <ScrollView flex={1} paddingTop="$2">
                        <YStack gap="$2" paddingHorizontal="$1">
                            {sensors.slice(0, 10).map((sensor) => (
                                <Button
                                    key={sensor.location.id}
                                    size="$2"
                                    chromeless
                                    padding="$2"
                                    onPress={() => onSensorSelect?.(sensor)}
                                    backgroundColor={isDark ? "$content2" : "$content1"}
                                    borderRadius="$2"
                                    hoverStyle={{
                                        backgroundColor: "$accent1"
                                    }}
                                    pressStyle={{
                                        backgroundColor: "$accent2",
                                        scale: 0.95
                                    }}
                                    animation="quick"
                                    height="auto"
                                    minHeight={40}
                                >
                                    <YStack gap="$1.5" alignItems="center" width="100%">
                                        <SmallBadgeIcon size={20} color={t.accent8?.val}/>
                                        <Text
                                            fontSize={9}
                                            color="$color"
                                            textAlign="center"
                                            numberOfLines={1}
                                            width="100%"
                                            lineHeight={10}
                                        >
                                            {sensor.location.name}
                                        </Text>
                                    </YStack>
                                </Button>
                            ))}
                        </YStack>
                    </ScrollView>
                )}
            </YStack>
        </View>
    );
}
