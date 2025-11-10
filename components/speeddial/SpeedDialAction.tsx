import React, {memo} from 'react';
import {Button, Text, XStack, YStack, View, styled} from 'tamagui';
import {Platform} from 'react-native';
import {SpeedDialActionProps} from '@/types/speeddial';

const ActionButton = styled(Button, {
    circular: true,
    size: '$4',
    elevation: 4,
    animation: 'quick',
    backgroundColor: '$background',
    borderWidth: 1,
    borderColor: '$borderColor',

    hoverStyle: {
        backgroundColor: '$backgroundHover',
        scale: 1.05,
    },

    pressStyle: {
        backgroundColor: '$backgroundPress',
        scale: 0.95,
    },

    variants: {
        disabled: {
            true: {
                opacity: 0.5,
                pointerEvents: 'none',
            },
        },
    },
});

const ActionLabel = styled(Text, {
    fontSize: 12,
    color: '$color',
    backgroundColor: '$background',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '$borderColor',
    whiteSpace: 'nowrap',
});

export const SpeedDialAction = memo(function SpeedDialAction({
                                                                 action,
                                                                 index,
                                                                 labelPlacement,
                                                                 gap,
                                                                 placement,
                                                                 onPress,
                                                             }: SpeedDialActionProps) {
    const Icon = action.icon;

    // Calculate animation directions based on placement
    const isBottom = placement.includes('bottom');

    // Stagger delay for each action
    const delay = index * 50;

    // Calculate enter/exit styles based on placement
    const getAnimationStyles = () => {
        const baseOffset = 20 + (index * 10);

        if (isBottom) {
            return {
                enterStyle: {
                    opacity: 0,
                    scale: 0.8,
                    y: baseOffset
                },
                exitStyle: {
                    opacity: 0,
                    scale: 0.8,
                    y: baseOffset
                },
            };
        } else {
            return {
                enterStyle: {
                    opacity: 0,
                    scale: 0.8,
                    y: -baseOffset
                },
                exitStyle: {
                    opacity: 0,
                    scale: 0.8,
                    y: -baseOffset
                },
            };
        }
    };

    const animationStyles = getAnimationStyles();

    const handlePress = async () => {
        if (!action.disabled) {
            await action.onPress();
            // Call parent's onPress which will handle closing logic
            onPress();
        }
    };

    const renderLabel = () => {
        if (!action.label || labelPlacement === 'none') return null;

        return (
            <View
                animation="quick"
                enterStyle={{opacity: 0, scale: 0.9}}
                exitStyle={{opacity: 0, scale: 0.9}}
                style={{zIndex: 1}}
            >
                <ActionLabel numberOfLines={1}>
                    {action.label}
                </ActionLabel>
            </View>
        );
    };

    const renderButton = () => (
        <ActionButton
            disabled={action.disabled}
            onPress={handlePress}
            testID={action.testID}
            accessibilityLabel={action.accessibilityLabel || action.label}
            accessibilityRole="button"
            {...(Platform.OS !== 'web' ? {
                accessibilityState: {disabled: action.disabled}
            } : {
                'aria-disabled': action.disabled
            })}
            backgroundColor={action.bgToken || '$background'}
            animation="quick"
            animateOnly={['transform', 'opacity']}
            {...(delay > 0 ? { animationDelay: delay } : {})}
            {...animationStyles}
        >
            {Icon && (
                <Icon
                    size={20}
                    color={action.colorToken || '$color'}
                />
            )}
        </ActionButton>
    );

    // Determine layout based on label placement
    const isHorizontalLayout = labelPlacement === 'left' || labelPlacement === 'right';

    // Convert gap token to number
    const getGapValue = () => {
        if (typeof gap === 'number') return gap;
        const gapMap: Record<string, number> = {
            '$1': 4,
            '$2': 8,
            '$3': 12,
            '$4': 16,
            '$5': 20,
        };
        return gapMap[gap as string] || 8;
    };

    const gapValue = getGapValue();

    if (isHorizontalLayout) {
        return (
            <XStack
                gap={gapValue}
                minWidth={100}
                alignItems="center"
                justifyContent={"space-between"}
                animation="quick"
                animateOnly={['transform', 'opacity']}
                {...(delay > 0 ? { animationDelay: delay } : {})}
                {...animationStyles}
            >
                {labelPlacement === 'left' && renderLabel()}
                {renderButton()}
                {labelPlacement === 'right' && renderLabel()}
            </XStack>
        );
    }

    // Vertical layout (top/bottom/none)
    return (
        <YStack
            gap={gapValue}
            alignItems="center"
            minWidth={100}
            justifyContent={"space-between"}
            animation="quick"
            animateOnly={['transform', 'opacity']}
            {...(delay > 0 ? { animationDelay: delay } : {})}
            {...animationStyles}
        >
            {labelPlacement === 'top' && renderLabel()}
            {renderButton()}
            {labelPlacement === 'bottom' && renderLabel()}
        </YStack>
    );
});

SpeedDialAction.displayName = 'SpeedDialAction';