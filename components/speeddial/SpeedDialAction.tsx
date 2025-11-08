import React, {memo} from 'react';
import {Button, Text, XStack, YStack, AnimatePresence, View, styled} from 'tamagui';
import {Platform} from 'react-native';
import {SpeedDialActionProps} from './types';

const ActionButton = styled(Button, {
    circular: true,
    size: '$4',
    elevation: '$2',
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
    fontSize: '$3',
    color: '$color',
    backgroundColor: '$background',
    paddingHorizontal: '$2',
    paddingVertical: '$1',
    borderRadius: '$2',
    elevation: '$1',
    borderWidth: 1,
    borderColor: '$borderColor',
    whiteSpace: 'nowrap',
});

export const SpeedDialAction = memo(function SpeedDialAction({
                                                                 action,
                                                                 index,
                                                                 isOpen,
                                                                 labelPlacement,
                                                                 gap,
                                                                 placement,
                                                                 onPress,
                                                             }: SpeedDialActionProps) {
    const Icon = action.icon;

    // Calculate animation directions based on placement
    const isBottom = placement.includes('bottom');
    const isRight = placement.includes('right');

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
            animation={[
                'quick',
                {
                    delay,
                },
            ]}
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

    if (isHorizontalLayout) {
        return (
            <XStack
                gap={gap}
                minWidth={100}
                alignItems="center"
                justifyContent={"space-between"}
                animation={[
                    'quick',
                    {
                        delay,
                    },
                ]}
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
            gap={gap}
            alignItems="center"
            minWidth={100}
            justifyContent={"space-between"}
            animation={[
                'quick',
                {
                    delay,
                },
            ]}
            {...animationStyles}
        >
            {labelPlacement === 'top' && renderLabel()}
            {renderButton()}
            {labelPlacement === 'bottom' && renderLabel()}
        </YStack>
    );
});

SpeedDialAction.displayName = 'SpeedDialAction';