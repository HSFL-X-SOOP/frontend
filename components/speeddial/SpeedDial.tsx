import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
    YStack,
    XStack,
    Button,
    AnimatePresence,
    View,
    Portal,
    styled,
    Stack,
} from 'tamagui';
import {Plus} from '@tamagui/lucide-icons';
import {BackHandler, Platform, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SpeedDialAction} from './SpeedDialAction';
import {SpeedDialProps, SpeedDialLabelPlacement, SpeedDialActionItem} from '@/types/speeddial';

const Backdrop = styled(Pressable, {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 1000,
});

const Container = styled(Stack, {
    position: 'absolute',
    zIndex: 1001,
});

export function SpeedDial({
                              // State control
                              open: controlledOpen,
                              defaultOpen = false,
                              onOpenChange,

                              // Content
                              actions,
                              icon: Icon = Plus,
                              activeIcon: ActiveIcon,

                              // Layout
                              placement = 'bottom-right',
                              labelPlacement: customLabelPlacement,
                              gap = '$2',
                              fabSize = '$6',
                              elevation = '$4',

                              // Behavior
                              disabled = false,
                              portal = true,
                              closeOnActionPress = true,

                              // Accessibility
                              testID,
                              fabAccessibilityLabel = 'More actions',

                              // Style overrides
                              ...stackProps
                          }: SpeedDialProps) {
    const insets = useSafeAreaInsets();

    // Handle controlled/uncontrolled state
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = isControlled ? controlledOpen : internalOpen;

    // Toggle FAB state
    const toggleOpen = useCallback(() => {
        if (!disabled) {
            const newOpenState = !open;

            if (!isControlled) {
                setInternalOpen(newOpenState);
            }
            onOpenChange?.(newOpenState);
        }
    }, [disabled, open, isControlled, onOpenChange]);

    const handleOpenChange = useCallback((newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    }, [isControlled, onOpenChange]);

    // Close on action press if configured (can be overridden per action)
    const handleActionPress = useCallback((action: SpeedDialActionItem) => {
        // Check if this specific action should close the dial
        // Priority: action.closeOnPress > global closeOnActionPress
        const shouldClose = action.closeOnPress !== undefined
            ? action.closeOnPress
            : closeOnActionPress;

        if (shouldClose) {
            handleOpenChange(false);
        }
    }, [closeOnActionPress, handleOpenChange]);

    // Android back handler
    useEffect(() => {
        if (Platform.OS === 'android' && open) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                handleOpenChange(false);
                return true;
            });

            return () => backHandler.remove();
        }
    }, [open, handleOpenChange]);

    // Determine label placement based on FAB placement
    const getLabelPlacement = (): SpeedDialLabelPlacement => {
        if (customLabelPlacement) return customLabelPlacement;

        if (placement === 'bottom-right' || placement === 'top-right') {
            return 'left';
        }
        return 'right';
    };

    const actualLabelPlacement = getLabelPlacement();

    // Calculate position styles based on placement
    const getPositionStyles = () => {
        const offset = 20;
        const styles: Record<string, number> = {};

        if (placement.includes('bottom')) {
            styles.bottom = offset + insets.bottom;
        } else {
            styles.top = offset + insets.top;
        }

        if (placement.includes('right')) {
            styles.right = offset + insets.right;
        } else {
            styles.left = offset + insets.left;
        }

        return styles;
    };

    // Determine stack direction based on placement
    const isVertical = placement.includes('bottom') || placement.includes('top');
    const StackComponent = isVertical ? YStack : XStack;

    // Icon to show in FAB
    const FabIcon = open && ActiveIcon ? ActiveIcon : Icon;

    // Helper function to convert token sizes to pixel values
    const getTokenSize = (token: string | number): number => {
        if (typeof token === 'number') return token;
        const sizes: Record<string, number> = {
            '$1': 4,
            '$2': 8,
            '$3': 12,
            '$4': 16,
            '$5': 20,
            '$6': 24,
            '$7': 28,
            '$8': 32,
        };
        return sizes[token] || 24;
    };

    // Calculate FAB size and gap in pixels
    const fabSizeInPixels = getTokenSize(fabSize as string) * 2; // FAB is roughly 2x the token size
    const gapInPixels = getTokenSize(gap as string);
    // Add extra spacing between FAB and actions
    const fabToActionsGap = gapInPixels + 16; // Add 16px extra spacing

    // Render actions
    const renderActions = () => {
        const actionElements = actions.map((action, index) => (
            <SpeedDialAction
                key={action.key}
                action={action}
                index={index}
                isOpen={open}
                labelPlacement={actualLabelPlacement}
                gap={gap}
                placement={placement}
                onPress={() => handleActionPress(action)}
            />
        ));

        // Reverse order for bottom placement (so first action is closest to FAB)
        if (placement.includes('bottom')) {
            return actionElements.reverse();
        }

        return actionElements;
    };

    const speedDialContent = (
        <>
            {/* Backdrop for closing when tapping outside */}
            <AnimatePresence>
                {open && (
                    <View
                        animation="quick"
                        enterStyle={{opacity: 0}}
                        exitStyle={{opacity: 0}}
                        style={{zIndex: 999}}
                    >
                        <Backdrop onPress={() => handleOpenChange(false)}/>
                    </View>
                )}
            </AnimatePresence>

            {/* Container for FAB and actions */}
            <Container
                {...stackProps}
                {...getPositionStyles()}
            >
                {/* Actions Container */}
                <StackComponent
                    position="absolute"
                    {...(placement.includes('bottom') ? {
                        bottom: fabSizeInPixels + fabToActionsGap
                    } : {
                        top: fabSizeInPixels + fabToActionsGap
                    })}
                    {...(actualLabelPlacement === 'left' || actualLabelPlacement === 'right'
                            ? placement.includes('right')
                                ? {right: -10, paddingRight: 20}
                                : {left: -10, paddingLeft: 20}
                            : {left: 0, right: 0}
                    )}
                    gap={gapInPixels}
                    alignItems={
                        actualLabelPlacement === 'top' || actualLabelPlacement === 'bottom' || actualLabelPlacement === 'none'
                            ? 'center'
                            : placement.includes('right')
                                ? 'flex-end'
                                : 'flex-start'
                    }
                    flexDirection={placement.includes('bottom') ? 'column-reverse' : 'column'}
                >
                    <AnimatePresence>
                        {open && renderActions()}
                    </AnimatePresence>
                </StackComponent>

                {/* Floating Action Button - Fixed Position */}
                <Button
                    circular
                    size={fabSize}
                    disabled={disabled}
                    onPress={toggleOpen}
                    testID={testID}
                    accessibilityLabel={fabAccessibilityLabel}
                    accessibilityRole="button"
                    backgroundColor="$accent7"
                    elevation={getTokenSize(elevation as string)}
                    animation="quick"
                    animateOnly={['transform']}
                    rotate={open ? '45deg' : '0deg'}
                    zIndex={1002}
                    hoverStyle={{
                        backgroundColor: "$accent9",
                        scale: 1.05,
                    }}
                    pressStyle={{
                        backgroundColor: "$accent10",
                        scale: 0.95,
                    }}
                    {...(Platform.OS !== 'web' ? {
                        accessibilityState: {
                            expanded: open,
                            disabled,
                        }
                    } : {
                        'aria-expanded': open,
                        'aria-disabled': disabled,
                    })}
                >
                    <FabIcon
                        size={24}
                        color="white"
                    />
                </Button>
            </Container>
        </>
    );

    if (portal) {
        return <Portal>{speedDialContent}</Portal>;
    }

    return speedDialContent;
}