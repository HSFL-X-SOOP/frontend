import { ComponentType } from 'react';
import { SizeTokens, StackProps } from 'tamagui';

export type TamaguiIcon = ComponentType<{ size?: number; color?: string }>;

export type SpeedDialPlacement = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type SpeedDialLabelPlacement = 'left' | 'right' | 'top' | 'bottom' | 'none';

export interface SpeedDialActionItem {
  key: string;
  label?: string;
  icon?: TamaguiIcon;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  colorToken?: string;
  bgToken?: string;
  testID?: string;
  accessibilityLabel?: string;
}

export interface SpeedDialProps extends Omit<StackProps, 'children'> {
  // State control
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Content
  actions: SpeedDialActionItem[];
  icon?: TamaguiIcon;
  activeIcon?: TamaguiIcon;

  // Layout
  placement?: SpeedDialPlacement;
  labelPlacement?: SpeedDialLabelPlacement;
  gap?: SizeTokens;
  fabSize?: SizeTokens;
  elevation?: number | SizeTokens;

  // Behavior
  disabled?: boolean;
  portal?: boolean;
  closeOnActionPress?: boolean;

  // Accessibility
  testID?: string;
  fabAccessibilityLabel?: string;
}

export interface SpeedDialActionProps {
  action: SpeedDialActionItem;
  index: number;
  isOpen: boolean;
  labelPlacement: SpeedDialLabelPlacement;
  gap: SizeTokens;
  placement: SpeedDialPlacement;
  onPress: () => void;
}