import {useEffect, useState, useCallback} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    H2,
    Input,
    Text,
    XStack,
    YStack,
    PopoverProps
} from 'tamagui';
import {useNotificationMeasurementRules, useToast} from '@/hooks/ui';
import {NotificationMeasurementRule} from '@/api/models/notificationMeasurementRule';
import {
    formatMeasurementValue,
    getIDFromMeasurementType,
    getMeasurementColor,
    getMeasurementTypeSymbol,
    getTextFromMeasurementType
} from '@/utils/measurements';
import {PrimaryButton, PrimaryButtonText} from '@/types/button';

interface NotificationRuleDialogProps extends PopoverProps {
    Icon?: any;
    Name?: string;
    shouldAdapt?: boolean;
    userID?: number | null;
    marinaID?: number | null;
    Value?: number;
    MeasurementType: string;
    measurement: any;
    t: any;
}


export function NotificationRuleDialog({
                                           Icon,
                                           userID,
                                           marinaID,
                                           Value,
                                           MeasurementType,
                                           measurement,
                                           t,
                                           ...props
                                       }: NotificationRuleDialogProps) {
    const notificationMeasurementRules = useNotificationMeasurementRules();
    const toast = useToast();
    const [measurementValue, setMeasurementValue] = useState<number>(Value || 0);
    const [operator, setOperator] = useState<string>('>');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [open, setOpen] = useState(false);

    const handleSave = useCallback((value: number) => {
        if (!marinaID) return;

        const notificationMeasurementRule = {
            userId: userID || -1,
            locationId: marinaID,
            measurementTypeId: getIDFromMeasurementType(MeasurementType),
            operator: operator,
            measurementValue: value,
            isActive: isActive,
        };

        void notificationMeasurementRules.create(
            notificationMeasurementRule,
            () => {
                toast.success(t('dashboard.measurements.save'), {
                    message: t('dashboard.measurements.notificationRuleSaved')
                });
                setOpen(false);
            },
            (error) => {
                toast.error(t('common.error'), {
                    message: t(error.onGetMessage())
                });
            }
        );
        
    }, [marinaID, operator, isActive, userID, MeasurementType, notificationMeasurementRules, toast, t]);

    const handleValueChange = (text: string) => {
        if (/^-?\d*\.?\d*$/.test(text)) {
            let value = text === "" ? 0 : parseFloat(text);

            setMeasurementValue(value);
        }
    };

    return (
        <Dialog
            allowFlip
            stayInFrame
            offset={15}
            {...props}
            open={open}
            onOpenChange={setOpen}
        >
            <Dialog.Trigger asChild>
                <Button icon={Icon} onPress={() => setOpen(true)}/>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay
                    onPress={() => setOpen(false)}
                    backgroundColor="rgba(0,0,0,0.3)"
                />

                <Dialog.Content
                    key={`${measurement.id}-${measurement.measurementType}`}
                    borderWidth={1}
                    borderColor="$borderColor"
                    elevate
                    p="$4"
                    maxWidth="90%"
                    width="100%"
                    borderRadius="$6"
                    animation={['quick', {opacity: {overshootClamping: true}}]}
                    enterStyle={{opacity: 0, scale: 0.95}}
                    exitStyle={{opacity: 0, scale: 0.95}}
                >
                    <YStack gap="$4">
                        <Text fontSize="$6" fontWeight="700" textAlign="center">
                            {t('dashboard.measurements.notifyMeWhen')}
                        </Text>

                        {/* Measurement Display */}
                        <YStack gap="$2" alignItems="center">
                            <Text fontSize="$4" color="$gray11" fontWeight="600">
                                {getTextFromMeasurementType(measurement.measurementType, t)}
                            </Text>
                            <XStack alignItems="baseline" gap="$2">
                                <H2 fontSize="$9" color={getMeasurementColor(measurement.measurementType)}>
                                    {formatMeasurementValue(measurement.value)}
                                </H2>
                                <Text fontSize="$5" color={getMeasurementColor(measurement.measurementType)}>
                                    {getMeasurementTypeSymbol(measurement.measurementType, t)}
                                </Text>
                            </XStack>
                        </YStack>

                        {/* Operator Selector */}
                        <XStack gap="$2" justifyContent="center">
                            <Button
                                size="$3"
                                theme={operator === "<" ? "active" : "gray"}
                                onPress={() => setOperator("<")}
                            >
                                {t('dashboard.measurements.lessThanTargetValue')}
                            </Button>
                            <Button
                                size="$3"
                                theme={operator === ">" ? "active" : "gray"}
                                onPress={() => setOperator(">")}
                            >
                                {t('dashboard.measurements.greaterThanTargetValue')}
                            </Button>
                        </XStack>

                        {/* Value Input */}
                        <YStack gap="$2" alignItems="center">
                            <Text fontSize="$4" fontWeight="600" color="$gray11">
                                {t('dashboard.measurements.targetValue')}
                            </Text>
                            <XStack gap="$2" alignItems="center">
                                <Input
                                    size="$3"
                                    width={90}
                                    keyboardType="decimal-pad"
                                    inputMode="decimal"
                                    value={measurementValue.toString()}
                                    onChangeText={handleValueChange}
                                />
                                <Text
                                    fontSize="$5"
                                    fontWeight="600"
                                    color={getMeasurementColor(measurement.measurementType)}
                                >
                                    {getMeasurementTypeSymbol(measurement.measurementType, t)}
                                </Text>
                            </XStack>
                        </YStack>

                        {/* Active Checkbox */}
                        <YStack gap="$2" alignItems="center">
                            <XStack alignItems="center" gap="$2">
                                <Checkbox
                                    checked={isActive}
                                    onCheckedChange={(checked) => setIsActive(checked === true)}
                                    size="$4"
                                    borderColor="$gray7"
                                >
                                    <Checkbox.Indicator>
                                        <Text fontSize="$4">✓</Text>
                                    </Checkbox.Indicator>
                                </Checkbox>
                                <Text fontSize="$4" fontWeight="600" color="$gray11">
                                    {t('dashboard.measurements.active')}
                                </Text>
                            </XStack>
                        </YStack>

                        <Dialog.Close asChild>
                            <PrimaryButton
                                size="$4"
                                width="100%"
                                onPress={() => {
                                    if (!marinaID) return;
                                    handleSave(measurementValue);
                                }}
                            >
                                <PrimaryButtonText>
                                    {t('dashboard.measurements.save')}
                                </PrimaryButtonText>
                            </PrimaryButton>
                        </Dialog.Close>
                    </YStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
