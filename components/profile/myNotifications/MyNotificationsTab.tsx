import React, { use, useEffect, useMemo, useState } from 'react';
import {
    YStack,
    Card,
    H4,
    Text,
    Button,
    View,
    Dialog,
    XStack,
    PopoverProps
} from 'tamagui';
import { ChevronDown, Edit3, Trash, Check, X } from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/useTranslation';
import { useNotificationMeasurementRules } from '@/hooks/useNotificationMeasurementRules';
import { useUserLocations } from '@/hooks/useUserLocations';
import { UserLocation } from '@/api/models/userLocation';
import { NotificationMeasurementRule } from '@/api/models/notificationMeasurementRule';
import { SelectWithSheet } from '@/components/ui/SelectWithSheet';
import { getMeasurementTypeSymbol, getTextFromMeasurementType } from '@/utils/measurements';
import { SetNotificationMeasurementRulePopover } from '@/app/(dashboard)/marina/[name]';
import { useSession } from '@/context/SessionContext';
import { useLocations } from '@/hooks/useLocations';
import { formatTimeToLocal } from '@/utils/time';

export function MyNotificationsTab() {
    const {t} = useTranslation();
    const notifications = useNotificationMeasurementRules();
    const userLocations = useUserLocations();
    const [myNotifications, setMyNotifications] = useState<NotificationMeasurementRule[] | undefined>([]);
    const [myLocations, setMyLocations] = useState<UserLocation[] | undefined>([]);
    const [selectedUserLocationId, setSelectedUserLocationId] = useState<number | undefined>(undefined);
    const isDark = false;
    const session = useSession();
    const userID = session?.session?.profile?.id ?? -1;
    const location = useLocations();

    useEffect(() => {
        const fetchData = async () => {
            const userLocationsData = await userLocations.getAllUserLocationByUserId(userID);
            setMyLocations(userLocationsData);
            if (userLocationsData && userLocationsData.length > 0) {
                setSelectedUserLocationId(userLocationsData[0]?.locationId);
            }
        };
        fetchData();
    }, [userID]);

    const fetchNotifications = async () => {
        const notificationsData = await notifications.getAllNotificationMeasurementRulesByUserIdAndLocationId(userID, selectedUserLocationId || -1);
        setMyNotifications(notificationsData);
    };

    useEffect(() => {
        fetchNotifications();
    }, [userID, selectedUserLocationId]);

    const handleValueChange = (value: string) => {
        setSelectedUserLocationId(Number(value))
    };

    const myLocationsSelect = useMemo(() => {
        if (!myLocations) return [];
        return myLocations
            .filter(data => data?.id != null)
            .map(data => ({
                id: data!.locationId,
                name: location.data.filter(loc => loc.id === data!.locationId)[0]?.name || ''
            }));
    }, [myLocations, location.data]);
    

    return (
        <YStack gap="$4">
            <Card elevate backgroundColor="$content1" borderRadius="$6" padding="$5"
                  borderWidth={1} borderColor="$borderColor">
                <SelectWithSheet
                    id="user-location-select"
                    name="user-location"
                    items={myLocationsSelect?.map(location => ({
                        value: location.id.toString(),
                        label: location.name.toString()
                    })) || []}
                    value={(myLocationsSelect?.filter (location => location.id === selectedUserLocationId)[0]?.id.toString()) || ''}
                    onValueChange={handleValueChange}
                    placeholder="Select User Location"
                    triggerProps={{
                        width: 280,
                        iconAfter: ChevronDown,
                        backgroundColor: isDark ? '$gray8' : '$gray2',
                        borderColor: isDark ? '$gray7' : '$gray4'
                    }}
                />
                {myNotifications?.map((notification) => (
                    <Card key={notification.id} marginTop="$4" padding="$4" borderWidth={1} borderColor="$borderColor">
                        <H4>{getTextFromMeasurementType(notification.measurementTypeId.toString(), t)}</H4>
                        <XStack justifyContent="space-between" alignItems="center">
                            <YStack>
                                <Text>
                                    {t('dashboard.measurements.condition')}: {notification.operator === '>' ? t('dashboard.measurements.greaterThanTargetValue') : t('dashboard.measurements.lessThanTargetValue')}
                                </Text>
                                <Text>{t('dashboard.measurements.targetValue')}: {notification.measurementValue} {getMeasurementTypeSymbol(notification.measurementTypeId.toString(), t)}</Text>
                                <XStack alignItems="center" gap="$2">
                                <Text>{t('notificationMeasurementRule.active')}: </Text>
                                    {notification.isActive ? <Check size={"$1"}/> : <X size={"$1"}/>}
                                </XStack>
                                <Text>{t("dashboard.measurements.lastNotifiedAt")}: {formatTimeToLocal(notification.lastNotifiedAt + "Z")}</Text>
                            <XStack gap="$2">
                            <Button onPress={() => {
                                notifications.update(notification.id, 
                                    {
                                        userId: notification.userId,
                                        locationId: notification.locationId,
                                        measurementTypeId: notification.measurementTypeId,
                                        measurementValue: notification.measurementValue,
                                        operator: notification.operator,
                                        isActive: !notification.isActive
                                    }
                                ).then(async () => {
                                    const notificationsData = await notifications.getAllNotificationMeasurementRulesByUserIdAndLocationId(1, selectedUserLocationId || -1);
                                    setMyNotifications(notificationsData);})
                                }}>
                                {notification.isActive ? t('common.disable') : t('common.enable')}
                            </Button>
                            <SetNotificationMeasurementRulePopover 
                                shouldAdapt={false}
                                placement="top"
                                Icon={Edit3}
                                Name={getTextFromMeasurementType(notification.measurementTypeId.toString(), t)}
                                Value={notification.measurementValue}
                                MeasurementType={notification.measurementTypeId.toString()}
                                marinaID={notification.locationId}
                                userID={1}
                                measurementId={notification.id}
                                t={t}
                                fetchNotifications={fetchNotifications}
                                />
                            <DeleteNotificationMeasurementRulePopover 
                                Icon={Trash}
                                notification={notification} 
                                t={t} 
                                fetchNotifications={fetchNotifications} 
                                />
                            </XStack>
                                </YStack>
                        </XStack>
                    </Card>
                ))}
            </Card>
        </YStack>
    );
};

export function DeleteNotificationMeasurementRulePopover({
  Icon,
  Name,
  shouldAdapt,
  notification,
  fetchNotifications,
  t,
  ...props
}: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean; notification: NotificationMeasurementRule, t: any, fetchNotifications: () => void }) {
    const [open, setOpen] = useState(false)
    const notifications = useNotificationMeasurementRules();
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
                key={`${notification.id}-${notification.measurementTypeId}`}
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
                    
                        <Text>{t('dashboard.measurements.deleteConfirmText')}</Text>
                    <Dialog.Close asChild>
                        <Button
                            size="$4"
                            width="100%"
                            onPress={() => {
                            notifications.deleteNotificationMeasurementRule(notification.id)
                                .then(async () => {
                                    await fetchNotifications();
                                });
                            }}
                        >
                            {t('dashboard.measurements.delete')}
                        </Button>
                    </Dialog.Close>
                
                </YStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
  )
}