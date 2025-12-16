import React, {JSX} from 'react';
import { YStack } from 'tamagui';
import type { IconProps } from '@tamagui/helpers-icon';

type IconComponent = React.ComponentType<IconProps>;

interface IconContainerProps {
    icon: IconComponent;
    size?: number;
    containerSize?: number;
    iconColor?: string;
    backgroundColor?: string;
    borderRadius?: string;
    marginBottom?: string;
}

export const IconContainer: React.FC<IconContainerProps> = ({
    icon: Icon,
    size = 40,
    containerSize = 80,
    iconColor = '$color.black12',
    backgroundColor = '$accent6',
    borderRadius = '$12',
    marginBottom = '$2',
}) => {
    return (
        <YStack
            width={containerSize}
            height={containerSize}
            borderRadius={borderRadius}
            backgroundColor={backgroundColor}
            alignItems="center"
            justifyContent="center"
            marginBottom={marginBottom}
        >
            <Icon size={size} color={iconColor} />
        </YStack>
    );
};
