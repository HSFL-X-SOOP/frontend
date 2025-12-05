import {Button, Text, XStack, YStack, Sheet, Checkbox, View, Separator} from 'tamagui';
import {useState} from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {X} from '@tamagui/lucide-icons';

export interface MapFilterState {
    module1Visible: boolean;
    module2Visible: boolean;
    module3Visible: boolean;
}

interface MapFilterButtonProps {
    filterState: MapFilterState;
    onFilterChange: (filterState: MapFilterState) => void;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function MapFilterButton({
                                            filterState,
                                            onFilterChange,
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

    const handleFilterChange = (module: 'module1Visible' | 'module2Visible' | 'module3Visible') => {
        onFilterChange({
            ...filterState,
            [module]: !filterState[module],
        });
    };

    const FilterContent = () => (
        <YStack gap="$3" padding="$3" minWidth={250}>
            <XStack alignItems="center" gap="$3" paddingVertical="$2"
                    pressStyle={{opacity: 0.7}}
                    onPress={() => handleFilterChange('module1Visible')}>
                <Checkbox
                    checked={filterState.module1Visible}
                    onCheckedChange={(checked) => handleFilterChange('module1Visible')}
                    size="$4"
                    borderColor={filterState.module1Visible ? "$accent7" : "$borderColor"}
                    backgroundColor={filterState.module1Visible ? "$accent7" : "transparent"}
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
                    onPress={() => handleFilterChange('module2Visible')}>
                <Checkbox
                    checked={filterState.module2Visible}
                    onCheckedChange={(checked) => handleFilterChange('module2Visible')}
                    size="$4"
                    borderColor={filterState.module2Visible ? "$accent7" : "$borderColor"}
                    backgroundColor={filterState.module2Visible ? "$accent7" : "transparent"}
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
                    onPress={() => handleFilterChange('module3Visible')}>
                <Checkbox
                    checked={filterState.module3Visible}
                    onCheckedChange={(checked) => handleFilterChange('module3Visible')}
                    size="$4"
                    borderColor={filterState.module3Visible ? "$accent7" : "$borderColor"}
                    backgroundColor={filterState.module3Visible ? "$accent7" : "transparent"}
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
