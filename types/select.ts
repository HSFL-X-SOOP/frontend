import { Select, GetProps } from 'tamagui';

/**
 * Generic item type for Select options
 */
export type SelectItem<T = string> = {
    value: T;
    label: string;
    disabled?: boolean;
};

/**
 * Type for Select.Sheet animation configuration
 */
export type SelectSheetAnimationConfig = {
    type: 'spring' | 'timing';
    damping?: number;
    mass?: number;
    stiffness?: number;
    duration?: number;
};

/**
 * Props for Select.Sheet.Frame styling
 */
export type SelectSheetFrameProps = GetProps<typeof Select.Sheet.Frame> & {
    padding?: string | number;
    paddingTop?: string | number;
    backgroundColor?: string;
    borderTopLeftRadius?: string | number;
    borderTopRightRadius?: string | number;
};

/**
 * Props for Select.Sheet.Handle styling
 */
export type SelectSheetHandleProps = GetProps<typeof Select.Sheet.Handle> & {
    backgroundColor?: string;
    opacity?: number;
    marginBottom?: string | number;
};

/**
 * Props for Select.Sheet.Overlay styling
 */
export type SelectSheetOverlayProps = GetProps<typeof Select.Sheet.Overlay> & {
    backgroundColor?: string;
    animation?: 'quick' | 'lazy' | 'bouncy';
    enterStyle?: Record<string, any>;
    exitStyle?: Record<string, any>;
};

/**
 * Configuration object for Select.Sheet component
 */
export type SelectSheetConfig = {
    native?: boolean;
    modal?: boolean;
    dismissOnSnapToBottom?: boolean;
    animationConfig?: SelectSheetAnimationConfig;
    frameProps?: SelectSheetFrameProps;
    handleProps?: SelectSheetHandleProps;
    overlayProps?: SelectSheetOverlayProps;
};

/**
 * Default configuration for Select.Sheet
 */
export const defaultSelectSheetConfig: SelectSheetConfig = {
    native: true,
    modal: true,
    dismissOnSnapToBottom: true,
    animationConfig: {
        type: 'spring',
        damping: 20,
        mass: 1.2,
        stiffness: 250,
    },
    frameProps: {
        padding: '$4',
        paddingTop: '$5',
        backgroundColor: '$content1',
        borderTopLeftRadius: '$6',
        borderTopRightRadius: '$6',
    },
    handleProps: {
        backgroundColor: '$borderColor',
        opacity: 0.5,
        marginBottom: '$4',
    },
    overlayProps: {
        animation: 'lazy',
        backgroundColor: 'rgba(0,0,0,0.5)',
        enterStyle: { opacity: 0 },
        exitStyle: { opacity: 0 },
    },
};

/**
 * Props for Select.Item styling based on platform
 */
export type SelectItemStyleProps = {
    backgroundColor?: string;
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: string | number;
    marginVertical?: string | number;
    hoverStyle?: Record<string, any>;
    pressStyle?: Record<string, any>;
};

/**
 * Platform-specific Select.Item styles
 */
export type PlatformSelectItemStyles = {
    native: SelectItemStyleProps;
};

/**
 * Default platform-specific styles for Select.Item
 * Only native styles are defined - desktop web uses default Tamagui styling
 */
export const defaultSelectItemStyles: PlatformSelectItemStyles = {
    native: {
        backgroundColor: '$content2',
        borderWidth: 1,
        borderColor: '$borderColor',
        borderRadius: '$3',
        marginVertical: '$1.5',
        hoverStyle: {
            backgroundColor: '$ctaBgHover',
        },
        pressStyle: {
            backgroundColor: '$ctaBgHover',
        },
    },
};
