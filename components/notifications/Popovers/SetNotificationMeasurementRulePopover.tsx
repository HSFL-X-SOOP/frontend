import { PopoverProps } from "tamagui";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNotificationMeasurementRules } from '@/hooks/useNotificationMeasurementRules';
import { NotificationMeasurementRule } from '@/api/models/notificationMeasurementRule';
import { YStack, Dialog, Button, Text, XStack, Input, Checkbox, H2 } from 'tamagui';
import { getMeasurementTypeSymbol, getTextFromMeasurementType, getMeasurementColor, formatMeasurementValue } from '@/utils/measurements';
import { getIDFromMeasurementType } from "@/utils/measurements";

export function SetNotificationMeasurementRulePopover({
  Icon,
  Name,
  shouldAdapt,
  userID,
  marinaID,
  Value,
  MeasurementType,
  measurementId,
  t,
  fetchNotifications,
  ...props
}: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean; userID?: number | null; marinaID?: number | null; Value?: number; MeasurementType: string, measurementId?: number, t: any, fetchNotifications?: () => void }) {
    const notificationMeasurementRules = useNotificationMeasurementRules();
    const [measurementValue, setMeasurementValue] = useState<number>(Value || 0);
    const [operator, setOperator] = useState<string>('>');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [open, setOpen] = useState(false)
    const [existingRule, setExistingRule] = useState<NotificationMeasurementRule | null | undefined>(undefined);
    const TEMPERATURE_MIN_VALUE = -10;
    const TEMPERATURE_MAX_VALUE = 50;
    
    useEffect(() => {
        if (!marinaID || !userID) return;
        const fetchNotificationMeasurementRule = async () => {
            try {
                const fetchedRule = await notificationMeasurementRules.getNotificationMeasurementRule(userID, marinaID, getIDFromMeasurementType(MeasurementType));
                setExistingRule(fetchedRule);
                setMeasurementValue(fetchedRule?.measurementValue || 0);
                setOperator(fetchedRule?.operator || '>');
                setIsActive(fetchedRule?.isActive ?? true);
            } catch (e) {
                console.warn('fetchUserLocation failed', e);
                setExistingRule(null);
            }
        };

        void fetchNotificationMeasurementRule();
    }, [marinaID, userID, MeasurementType]);
    
    const createNotificationMeasurementRule = useCallback(async (value: number) => {
        if (!marinaID) return;
        const notificationMeasurementRule = {
            userId: userID || -1,
            locationId: marinaID,
            measurementTypeId: getIDFromMeasurementType(MeasurementType),
            operator: operator,
            measurementValue: value,
            isActive: isActive,
        }
        
        if (existingRule) {
            await notificationMeasurementRules.update(existingRule.id, notificationMeasurementRule);
        } else {
            await notificationMeasurementRules.create(notificationMeasurementRule);
        }

    }, [marinaID, operator, isActive, userID, MeasurementType, existingRule]);
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
                <Button icon={Icon} onPress={() => setOpen(true)} />
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay 
                onPress={() => setOpen(false)} 
                backgroundColor="rgba(0,0,0,0.3)" 
                />

                <Dialog.Content
                key={`${measurementId}-${MeasurementType}`}
                borderWidth={1}
                borderColor="$borderColor"
                elevate
                p="$4"
                maxWidth="90%"
                width="100%"
                borderRadius="$6"
                animation={[
                    'quick',
                    {
                    opacity: { overshootClamping: true },
                    },
                ]}
                enterStyle={{ opacity: 0, scale: 0.95 }}
                exitStyle={{ opacity: 0, scale: 0.95 }}
                >

                <YStack gap="$4">
                    
                    <Text
                    fontSize="$6"
                    fontWeight="700"
                    textAlign="center"
                    >
                    {t('dashboard.measurements.notifyMeWhen')}
                    </Text>

                    {/* Measurement Display */}
                    <YStack gap="$2" alignItems="center">
                        <Text fontSize="$4" color="$gray11" fontWeight="600">
                            {getTextFromMeasurementType(MeasurementType, t)}
                        </Text>

                        <XStack alignItems="baseline" gap="$2">
                            <H2 fontSize="$9" color={getMeasurementColor(MeasurementType)}>
                            {formatMeasurementValue(Value!)}
                            </H2>
                            <Text fontSize="$5" color={getMeasurementColor(MeasurementType)}>
                            {getMeasurementTypeSymbol(MeasurementType, t)}
                            </Text>
                        </XStack>
                    </YStack>

                    {/* Operator Value Selector */}
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

                    {/* Measurement Value Input */}
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
                        onChangeText={(text) => {
                            if (/^-?\d*\.?\d*$/.test(text)) {
                                let value = text === "" ? 0 : parseFloat(text);

                                if (value < TEMPERATURE_MIN_VALUE) value = TEMPERATURE_MIN_VALUE;
                                if (value > TEMPERATURE_MAX_VALUE) value = TEMPERATURE_MAX_VALUE;

                                setMeasurementValue(value);
                            }
                        }}
                        />
                        <Text fontSize="$5" fontWeight="600" color={getMeasurementColor(MeasurementType)}>
                        {getMeasurementTypeSymbol(MeasurementType, t)}
                        </Text>
                    </XStack>
                    </YStack>

                    {/* Checkbox */}
                    <YStack gap="$2" alignItems="center">
                        <XStack alignItems="center" gap="$2">
                            <Checkbox
                            checked={isActive}
                            onCheckedChange={(checked: boolean | "indeterminate") => {
                                setIsActive(checked === true);
                            }}
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
                        <Button
                            size="$4"
                            width="100%"
                            onPress={() => {
                            if (!marinaID) return;
                            createNotificationMeasurementRule(measurementValue).then(async () => {
                                    if (fetchNotifications) {
                                        await fetchNotifications();
                                    }
                                });
                            }}
                        >
                            {t('dashboard.measurements.save')}
                        </Button>
                    </Dialog.Close>
                
                </YStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
  )
}