import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    YStack,
    Card,
    H4,
    Text,
    Button,
    XStack
} from 'tamagui';
import { ChevronDown, Edit3, Trash, Check, X, Bell, BellOff } from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/ui/useTranslation';
import { useNotificationMeasurementRules } from '@/hooks/ui/useNotificationMeasurementRules';
import { useUserLocations } from '@/hooks/data/useUserLocations';
import { UserLocation } from '@/api/models/userLocation';
import { NotificationMeasurementRule } from '@/api/models/notificationMeasurementRule';
import { SelectWithSheet } from '@/components/ui/SelectWithSheet';
import { getLatestMeasurements, getMeasurementTypeSymbol, getTextFromMeasurementType } from '@/utils/measurements';
import { SetNotificationMeasurementRulePopover } from '@/components/notifications/Popovers/SetNotificationMeasurementRulePopover';
import { useSession } from '@/context/SessionContext';
import { useLocations } from '@/hooks/data/useLocations';
import { formatTimeToLocal } from '@/utils/time';
import { DeleteNotificationMeasurementRulePopover } from '@/components/notifications/Popovers/DeleteNotificationMeasurementRulePopover';
import { useSensorDataTimeRange } from '@/hooks/data/useSensors';

export function MyNotificationsTab() {
    const {t} = useTranslation();
    const notifications = useNotificationMeasurementRules();
    const userLocations = useUserLocations();
    const [myNotifications, setMyNotifications] = useState<NotificationMeasurementRule[] | undefined>([]);
    const [myLocations, setMyLocations] = useState<UserLocation[] | undefined>([]);
    const [selectedUserLocationId, setSelectedUserLocationId] = useState<number | undefined>(undefined);
    const [selectedUserLocation, setSelectedUserLocation] = useState<UserLocation | undefined>(undefined);
    const isDark = false;
    const session = useSession();
    const userID = session?.session?.profile?.id ?? 0;
    const location = useLocations();

    useEffect(() => {
        const fetchData = async () => {
            const userLocationsData = await userLocations.getAllUserLocationByUserId(userID);
            setMyLocations(userLocationsData);
            if (userLocationsData && userLocationsData.length > 0) {
                setSelectedUserLocation(userLocationsData[0]);
                setSelectedUserLocationId(userLocationsData[0]?.locationId);
            }
        };
        fetchData();
    }, [userID]);

    const fetchNotifications = async () => {
        const notificationsData = await notifications.getAllNotificationMeasurementRulesByUserIdAndLocationId(userID, selectedUserLocationId || 0);
        setMyNotifications(notificationsData);
    };

    useEffect(() => {
        fetchNotifications();
    }, [userID, selectedUserLocationId]);

    const handleValueChange = (value: string) => {
        setSelectedUserLocationId(Number(value))
        setSelectedUserLocation(myLocations?.find(location => location.locationId === Number(value)));
    };

    const myLocationsSelect = useMemo(() => {
        if (!myLocations) return [];
        return myLocations
            .filter(data => data?.id != null)
            .map(data => ({
                id: data!.id,
                locationId: data!.locationId,
                name: location.data.filter((loc) => loc.id === data!.locationId)[0]?.name || ''
            }));
    }, [myLocations, location.data]);

    const updateUserLocationSentHarborNotifications = useCallback(async () => {
        if (!selectedUserLocation) return;
        const updatedUserocation = await userLocations.update(selectedUserLocation.id, {
            userId: userID,
            locationId: selectedUserLocation.locationId,
            sentHarborNotifications: !selectedUserLocation.sentHarborNotifications,
        });
        setSelectedUserLocation(updatedUserocation);
    }, [selectedUserLocation, userLocations, selectedUserLocationId, userID]);


    const EXCLUDED_MEASUREMENTS = ["Standard deviation", "Battery, voltage"];
    const MEASUREMENT_ORDER = ["Temperature, water", "Tide", "Wave Height"];
    
    const {data: timeRangeData} = useSensorDataTimeRange(selectedUserLocationId || 0, "today");
    const filteredMeasurements = useMemo(() => {
        if (!timeRangeData?.boxes) return [];

        const latestMeasurements = getLatestMeasurements(timeRangeData.boxes);
        const filtered = latestMeasurements.filter(m => !EXCLUDED_MEASUREMENTS.includes(m.measurementType));

        return filtered.sort((a, b) => {
            const indexA = MEASUREMENT_ORDER.indexOf(a.measurementType);
            const indexB = MEASUREMENT_ORDER.indexOf(b.measurementType);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }, [timeRangeData]);

    const currentValues = useMemo(() => ({
        waterTemp: filteredMeasurements.find(m =>
            m.measurementType === "Temperature, water" || m.measurementType === "WTemp"
        )?.value,
        waveHeight: filteredMeasurements.find(m => m.measurementType === "Wave Height")?.value,
        waterLevel: filteredMeasurements.find(m => m.measurementType === "Tide")?.value
    }), [filteredMeasurements]);

    const SelectSheet = useCallback(() => {
        return (                
        <SelectWithSheet
            id="user-location-select"
            name="user-location"
            items={myLocationsSelect?.map(location => ({
                value: location.locationId.toString(),
                label: location.name.toString()
            })) || []}
            value={(myLocationsSelect?.filter (location => location.locationId === selectedUserLocationId)[0]?.locationId.toString()) || myLocationsSelect[0]?.name}
            onValueChange={handleValueChange}
            placeholder={t("notificationMeasurementRule.selectUserLocation")}
            triggerProps={{
                width: 280,
                iconAfter: ChevronDown,
                backgroundColor: isDark ? '$gray8' : '$gray2',
                borderColor: isDark ? '$gray7' : '$gray4'
            }}
        />)
    }, [myLocationsSelect, selectedUserLocationId, handleValueChange, isDark, t]);

    return (
        <YStack gap="$4">
            <Card elevate backgroundColor="$content1" borderRadius="$6" padding="$5"
                  borderWidth={1} borderColor="$borderColor">
                <SelectSheet />
                {selectedUserLocation && (
                    <Card key={"harbor-master-notification"} marginTop="$4" padding="$4" borderWidth={1} borderColor="$borderColor">
                        <XStack gap={"$4"} alignItems="center">
                            <Button
                                size="$5"
                                variant="outlined"
                                icon={selectedUserLocation?.sentHarborNotifications ? BellOff : Bell}
                                onPress={updateUserLocationSentHarborNotifications}
                                circular
                                />
                            <H4 color="$accent7" fontFamily="$oswald">{t("notificationMeasurementRule.harborMasterNotification")}</H4>
                        </XStack>
                    </Card>
                )}

                {selectedUserLocation === undefined && (
                    <Card key={"harbor-master-notification"} marginTop="$4" padding="$4" borderWidth={1} borderColor="$borderColor">
                        <YStack gap="$2" alignItems="center">
                            <H4  color="$accent7" fontFamily="$oswald">{t("notificationMeasurementRule.noLocationsTitle")}</H4>
                            <Text color="$color" opacity={0.7} textAlign="center">{t("notificationMeasurementRule.noLocationsMessage")}</Text>
                        </YStack>
                    </Card>
                )}

                {myNotifications?.sort((a, b) => a.id - b.id).map((notification) => (
                    <Card key={notification.id} marginTop="$4" padding="$4" borderWidth={1} borderColor="$borderColor">
                        <H4 color="$accent7" fontFamily="$oswald">{getTextFromMeasurementType(notification.measurementTypeId.toString(), t)}</H4>
                        <XStack justifyContent="space-between" alignItems="center">
                            <YStack>
                                <Text color="$color" opacity={0.7}>
                                    {t('dashboard.measurements.currentValue')}: {getCurrentValueMeasurement(currentValues, getCurrentValueMeasurement(currentValues, notification.measurementTypeId.toString()) ? notification.measurementTypeId.toString() : "")} {getMeasurementTypeSymbol(notification.measurementTypeId.toString(), t)}
                                </Text>
                                <Text color="$color" opacity={0.7}>
                                    {t('dashboard.measurements.condition')}: {notification.operator === '>' ? t('dashboard.measurements.greaterThanTargetValue') : t('dashboard.measurements.lessThanTargetValue')}
                                </Text>
                                <Text color="$color" opacity={0.7}>{t('dashboard.measurements.targetValue')}: {notification.measurementValue} {getMeasurementTypeSymbol(notification.measurementTypeId.toString(), t)}</Text>
                                <XStack alignItems="center" gap="$2">
                                    <Text color="$color" opacity={0.7}>{t('notificationMeasurementRule.active')}:</Text>
                                    <Text color="$color" opacity={0.7}>{notification.isActive ? <Check size={"$1"}/> : <X size={"$1"}/>}</Text>
                                </XStack>
                                <Text color="$color" opacity={0.7}>{t("dashboard.measurements.lastNotifiedAt")}: {formatTimeToLocal(notification.lastNotifiedAt + "Z")}</Text>
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
                                    fetchNotifications();
                                })}}>
                                {notification.isActive ? t('common.disable') : t('common.enable')}
                            </Button>
                            <SetNotificationMeasurementRulePopover 
                                shouldAdapt={false}
                                placement="top"
                                Icon={Edit3}
                                Name={getTextFromMeasurementType(notification.measurementTypeId.toString(), t)}
                                Value={getCurrentValueMeasurement(currentValues, getCurrentValueMeasurement(currentValues, notification.measurementTypeId.toString()) ? notification.measurementTypeId.toString() : "")}
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

function getCurrentValueMeasurement(currentValues: any, type: string) {
    switch (type) {
        case "Temperature, water":
        case "WTemp":
        case "1603253327":
            return currentValues.waterTemp;
        case "Wave Height":
        case "-1705811922":
            return currentValues.waveHeight;
        case "Tide":
        case "2606550":
            return currentValues.waterLevel;
        default:
            return null;
    }
}