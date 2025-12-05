import {Button, Text, XStack, YStack, Sheet, Checkbox, View, Separator} from 'tamagui';
import {useState} from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {X} from '@tamagui/lucide-icons';

interface MapFilterButtonProps {
    module1Visible: boolean;
    setModule1Visible: (value: boolean) => void;
    module2Visible: boolean;
    setModule2Visible: (value: boolean) => void;
    module3Visible: boolean;
    setModule3Visible: (value: boolean) => void;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function MapFilterButton({
                                            module1Visible,
                                            setModule1Visible,
                                            module2Visible,
                                            setModule2Visible,
                                            module3Visible,
                                            setModule3Visible,
                                            isOpen,
                                            onOpenChange,
                                        }: MapFilterButtonProps) {
    const {t} = useTranslation();

    // Use controlled state if provided, otherwise use internal state
    const isControlled = isOpen !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);

    const sheetVisible = isControlled ? isOpen : internalOpen;

    const handleOpenChange = (open: boolean) => {
        if (isControlled && onOpenChange) {
            onOpenChange(open);
        } else {
            setInternalOpen(open);
        }
    };

    const FilterContent = () => (
        <YStack gap="$3" padding="$3" minWidth={250}>
            <XStack alignItems="center" gap="$3" paddingVertical="$2"
                    pressStyle={{opacity: 0.7}}
                    onPress={() => setModule1Visible(!module1Visible)}>
                <Checkbox
                    checked={module1Visible}
                    onCheckedChange={(checked) => setModule1Visible(checked === true)}
                    size="$4"
                    borderColor={module1Visible ? "$accent7" : "$borderColor"}
                    backgroundColor={module1Visible ? "$accent7" : "transparent"}
                >
                    <Checkbox.Indicator>
                        <View width="100%" height="100%" alignItems="center" justifyContent="center">
                            <Text color="white" fontWeight="bold">✓</Text>
                        </View>
                    </Checkbox.Indicator>
                </Checkbox>
                <Text fontSize="$4" flex={1}>{t('map.module1')}</Text>
            </XStack>

            <XStack alignItems="center" gap="$3" paddingVertical="$2"
                    pressStyle={{opacity: 0.7}}
                    onPress={() => setModule2Visible(!module2Visible)}>
                <Checkbox
                    checked={module2Visible}
                    onCheckedChange={(checked) => setModule2Visible(checked === true)}
                    size="$4"
                    borderColor={module2Visible ? "$accent7" : "$borderColor"}
                    backgroundColor={module2Visible ? "$accent7" : "transparent"}
                >
                    <Checkbox.Indicator>
                        <View width="100%" height="100%" alignItems="center" justifyContent="center">
                            <Text color="white" fontWeight="bold">✓</Text>
                        </View>
                    </Checkbox.Indicator>
                </Checkbox>
                <Text fontSize="$4" flex={1}>{t('map.module2')}</Text>
            </XStack>

            <XStack alignItems="center" gap="$3" paddingVertical="$2"
                    pressStyle={{opacity: 0.7}}
                    onPress={() => setModule3Visible(!module3Visible)}>
                <Checkbox
                    checked={module3Visible}
                    onCheckedChange={(checked) => setModule3Visible(checked === true)}
                    size="$4"
                    borderColor={module3Visible ? "$accent7" : "$borderColor"}
                    backgroundColor={module3Visible ? "$accent7" : "transparent"}
                >
                    <Checkbox.Indicator>
                        <View width="100%" height="100%" alignItems="center" justifyContent="center">
                            <Text color="white" fontWeight="bold">✓</Text>
                        </View>
                    </Checkbox.Indicator>
                </Checkbox>
                <Text fontSize="$4" flex={1}>{t('map.module3')}</Text>
            </XStack>
        </YStack>
    );

    return (
        <Sheet
            modal
            open={sheetVisible}
            onOpenChange={handleOpenChange}
            snapPointsMode="fit"
            accessibilityLabel={t('map.filterSettings')}
            accessibilityRole="dialog"
        >
            <Sheet.Overlay animation="quick" enterStyle={{opacity: 0}} exitStyle={{opacity: 0}}/>
            <Sheet.Handle/>
            <Sheet.Frame padding="$4" backgroundColor="$background">
                <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
                    <Text fontSize="$6" fontWeight="600">{t('map.filterSettings')}</Text>
                    <Button
                        size="$3"
                        chromeless
                        circular
                        onPress={() => handleOpenChange(false)}
                        accessibilityLabel={t('common.close')}
                        accessibilityHint={t('map.closeFilterPanel')}
                        accessibilityRole="button"
                    >
                        <X size={20} color="$color" />
                    </Button>
                </XStack>
                <Separator marginBottom="$3" />
                <FilterContent />
            </Sheet.Frame>
        </Sheet>
    );
}
