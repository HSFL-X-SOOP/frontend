import {Platform} from 'react-native';
import {Adapt, Select, YStack, GetProps} from 'tamagui';
import {useIsMobileWeb} from '@/hooks/ui';
import {
    SelectItem,
    defaultSelectSheetConfig,
    defaultSelectItemStyles
} from '@/types/select';

/**
 * Props for SelectWithSheet component
 */
export interface SelectWithSheetProps<T extends string = string> {
    /** List of items to display */
    items: SelectItem<T>[];
    /** Current selected value */
    value?: T;
    /** Default value */
    defaultValue?: T;
    /** Callback when value changes */
    onValueChange?: (value: T) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Props to pass to Select.Trigger */
    triggerProps?: GetProps<typeof Select.Trigger>;
    /** Disable the select */
    disabled?: boolean;
    /** ID for accessibility */
    id?: string;
    /** Name for forms */
    name?: string;
}

/**
 * Reusable Select component with adaptive UI:
 * - **Native (iOS/Android)**: Bottom sheet with full styling (borders, backgrounds, accent colors)
 * - **Mobile Web**: Standard dropdown with accent colors for hover/press (green/blue)
 * - **Desktop Web**: Standard dropdown with default Tamagui styling
 *
 * @example
 * ```tsx
 * const items = [
 *   { value: 'option1', label: 'Option 1' },
 *   { value: 'option2', label: 'Option 2' },
 * ];
 *
 * <SelectWithSheet
 *   items={items}
 *   value={selectedValue}
 *   onValueChange={setSelectedValue}
 *   placeholder="Choose an option"
 * />
 * ```
 */
export function SelectWithSheet<T extends string = string>({
                                                               items,
                                                               value,
                                                               defaultValue,
                                                               onValueChange,
                                                               placeholder = 'Select...',
                                                               disabled = false,
                                                               id,
                                                               name,
                                                           }: SelectWithSheetProps<T>) {
    const isNative = Platform.OS !== 'web';
    const isMobileWeb = useIsMobileWeb();

    // Styling logic:
    // - Native (iOS/Android): Full styling with borders, backgrounds, etc.
    // - Mobile Web: Subtle background + accent colors for hover/press/focus (green/blue)
    // - Desktop Web: Default Tamagui styling
    const itemStyle = isNative
        ? defaultSelectItemStyles.native
        : isMobileWeb
            ? {
                backgroundColor: '$content1',
                hoverStyle: {
                    backgroundColor: '$accent3'
                },
                pressStyle: {
                    backgroundColor: '$accent4'
                },
                focusStyle: {
                    backgroundColor: '$accent2'
                }
            }
            : {};

    return (
        <Select
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            id={id}
            name={name}
        >
            <Select.Trigger {...{
                flex: 1,
                size: "$3",
                iconAfter: null,
                backgroundColor: "$content4",
                borderColor: "$borderColor",
                borderWidth: 1,
                hoverStyle: {
                    backgroundColor: "$content2",
                    borderColor: "$accent6"
                },
                pressStyle: {
                    backgroundColor: "$content3",
                    borderColor: "$accent7"
                }
            }} disabled={disabled}>
                <Select.Value placeholder={placeholder}/>
            </Select.Trigger>

            {/* Only show Sheet on native platforms (iOS/Android), not on mobile web */}
            {isNative && (
                <Adapt when="sm" platform="touch">
                    <Select.Sheet
                        native={defaultSelectSheetConfig.native}
                        modal={defaultSelectSheetConfig.modal}
                        dismissOnSnapToBottom={defaultSelectSheetConfig.dismissOnSnapToBottom}
                    >
                        <Select.Sheet.Frame {...defaultSelectSheetConfig.frameProps}>
                            <Select.Sheet.Handle {...defaultSelectSheetConfig.handleProps} />
                            <Select.Sheet.ScrollView>
                                <YStack gap="$2" paddingVertical="$2">
                                    <Adapt.Contents/>
                                </YStack>
                            </Select.Sheet.ScrollView>
                        </Select.Sheet.Frame>
                        <Select.Sheet.Overlay {...defaultSelectSheetConfig.overlayProps} />
                    </Select.Sheet>
                </Adapt>
            )}

            <Select.Content zIndex={200000}>
                <Select.Viewport>
                    {items.map((item, index) => (
                        <Select.Item
                            key={item.value}
                            index={index}
                            value={item.value}
                            disabled={item.disabled}
                            {...itemStyle}
                        >
                            <Select.ItemText>{item.label}</Select.ItemText>
                        </Select.Item>
                    ))}
                </Select.Viewport>
            </Select.Content>
        </Select>
    );
}
