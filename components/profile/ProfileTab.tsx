import React, {useState, useEffect} from 'react';
import {
    YStack,
    XStack,
    Card,
    H5,
    Text,
    Button,
    Spinner,
    View,
    Separator,
    RadioGroup,
    Label
} from 'tamagui';
import {Globe, Activity, Ruler, Check} from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/ui';
import {useToast} from '@/hooks/ui';
import {useSession} from '@/context/SessionContext';
import {useUser} from '@/hooks/data';
import {ActivityRole, Language, MeasurementSystem} from '@/api/models/profile';
import {UI_CONSTANTS} from '@/config/constants';

export const ProfileTab: React.FC = () => {
    const {t, changeLanguage} = useTranslation();
    const {session, updateProfile: updateSessionProfile} = useSession();
    const {updateProfile, updateProfileStatus} = useUser();
    const toast = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.DE);
    const [selectedRoles, setSelectedRoles] = useState<ActivityRole[]>([]);
    const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementSystem>(MeasurementSystem.METRIC);

    useEffect(() => {
        if (session?.profile) {
            setSelectedLanguage(session.profile.language ?? Language.DE);
            setSelectedRoles(session.profile.roles || []);
            setSelectedMeasurement(session.profile.measurementSystem ?? MeasurementSystem.METRIC);
        }
    }, [session?.profile]);

    const handleRoleToggle = (role: ActivityRole) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleSave = async () => {
        try {
            const updatedProfile = await updateProfile({
                language: selectedLanguage,
                roles: selectedRoles,
                measurementSystem: selectedMeasurement
            });

            updateSessionProfile(updatedProfile);

            const langCode = selectedLanguage === Language.DE ? 'de' : 'en';
            changeLanguage(langCode);

            toast.success(t('profile.saveSuccess'), {
                message: t('profile.settingsUpdated'),
                duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
            });

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error(t('profile.saveError'), {
                message: error instanceof Error ? error.message : t('profile.saveErrorGeneric'),
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
        }
    };

    const handleCancel = () => {
        if (session?.profile) {
            setSelectedLanguage(session.profile.language ?? Language.DE);
            setSelectedRoles(session.profile.roles || []);
            setSelectedMeasurement(session.profile.measurementSystem ?? MeasurementSystem.METRIC);
        }
        setIsEditing(false);
    };

    return (
        <YStack gap="$4">
            <XStack justifyContent="flex-end" alignItems="center">
                {!isEditing && (
                    <Button
                        size="$3"
                        backgroundColor="$accent7"
                        color="white"
                        pressStyle={{backgroundColor: "$accent6"}}
                        hoverStyle={{backgroundColor: "$accent4"}}
                        onPress={() => setIsEditing(true)}
                    >
                        {t('profile.edit')}
                    </Button>
                )}
            </XStack>

            <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                  borderWidth={1} borderColor="$borderColor">
                <YStack gap="$4">
                    <XStack alignItems="center" gap="$3">
                        <View
                            width={40}
                            height={40}
                            backgroundColor="$accent2"
                            borderRadius="$8"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Globe size={22} color="$accent7"/>
                        </View>
                        <H5 color="$accent7" fontFamily="$oswald">
                            {t('profile.languageSection.title')}
                        </H5>
                    </XStack>
                    <Separator/>
                    {isEditing ? (
                        <RadioGroup value={selectedLanguage}
                                    onValueChange={(val) => setSelectedLanguage(val as Language)}
                                    gap="$3">
                            <XStack alignItems="center" gap="$3" padding="$3"
                                    backgroundColor={selectedLanguage === Language.DE ? "$accent2" : "transparent"}
                                    borderRadius="$4">
                                <RadioGroup.Item value={Language.DE} id="lang-de" size="$4">
                                    <RadioGroup.Indicator/>
                                </RadioGroup.Item>
                                <Label htmlFor="lang-de" flex={1} color="$color"
                                       fontSize={16}>{t('profile.languageSection.german')}</Label>
                                {selectedLanguage === Language.DE &&
                                    <Check size={20} color="$accent7"/>}
                            </XStack>
                            <XStack alignItems="center" gap="$3" padding="$3"
                                    backgroundColor={selectedLanguage === Language.EN ? "$accent2" : "transparent"}
                                    borderRadius="$4">
                                <RadioGroup.Item value={Language.EN} id="lang-en" size="$4">
                                    <RadioGroup.Indicator/>
                                </RadioGroup.Item>
                                <Label htmlFor="lang-en" flex={1} color="$color"
                                       fontSize={16}>{t('profile.languageSection.english')}</Label>
                                {selectedLanguage === Language.EN &&
                                    <Check size={20} color="$accent7"/>}
                            </XStack>
                        </RadioGroup>
                    ) : (
                        <Text color="$color" fontSize={16} paddingLeft="$3">
                            {selectedLanguage === Language.DE ? t('profile.languageSection.german') : t('profile.languageSection.english')}
                        </Text>
                    )}
                </YStack>
            </Card>

            <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                  borderWidth={1} borderColor="$borderColor">
                <YStack gap="$4">
                    <XStack alignItems="center" gap="$3">
                        <View
                            width={40}
                            height={40}
                            backgroundColor="$accent2"
                            borderRadius="$8"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Activity size={22} color="$accent7"/>
                        </View>
                        <H5 color="$accent7" fontFamily="$oswald">
                            {t('profile.activitiesSection.title')}
                        </H5>
                    </XStack>
                    <Separator/>
                    {isEditing ? (
                        <YStack gap="$2">
                            {Object.values(ActivityRole).map(role => (
                                <XStack
                                    key={role}
                                    gap="$3"
                                    alignItems="center"
                                    padding="$3"
                                    backgroundColor={selectedRoles.includes(role) ? "$accent2" : "transparent"}
                                    borderRadius="$4"
                                    pressStyle={{opacity: 0.7}}
                                    onPress={() => handleRoleToggle(role)}
                                >
                                    <View
                                        width={24}
                                        height={24}
                                        borderRadius="$4"
                                        borderWidth={2}
                                        borderColor={selectedRoles.includes(role) ? "$accent7" : "$borderColor"}
                                        backgroundColor={selectedRoles.includes(role) ? "$accent7" : "transparent"}
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        {selectedRoles.includes(role) &&
                                            <Check size={16} color="white"/>}
                                    </View>
                                    <Text flex={1} color="$color" fontSize={16}>
                                        {t(`profile.activitiesSection.roles.${role}`)}
                                    </Text>
                                </XStack>
                            ))}
                        </YStack>
                    ) : (
                        <YStack gap="$2" paddingLeft="$3">
                            {selectedRoles.length > 0 ? (
                                selectedRoles.map(role => (
                                    <XStack key={role} gap="$2" alignItems="center">
                                        <View width={6} height={6} borderRadius="$10"
                                              backgroundColor="$accent7"/>
                                        <Text color="$color"
                                              fontSize={16}>{t(`profile.activitiesSection.roles.${role}`)}</Text>
                                    </XStack>
                                ))
                            ) : (
                                <Text color="$color" opacity={0.6}
                                      fontSize={16}>{t('profile.activitiesSection.noActivities')}</Text>
                            )}
                        </YStack>
                    )}
                </YStack>
            </Card>

            <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                  borderWidth={1} borderColor="$borderColor">
                <YStack gap="$4">
                    <XStack alignItems="center" gap="$3">
                        <View
                            width={40}
                            height={40}
                            backgroundColor="$accent2"
                            borderRadius="$8"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Ruler size={22} color="$accent7"/>
                        </View>
                        <H5 color="$accent7" fontFamily="$oswald">
                            {t('profile.measurementSection.title')}
                        </H5>
                    </XStack>
                    <Separator/>
                    {isEditing ? (
                        <RadioGroup value={selectedMeasurement}
                                    onValueChange={(val) => setSelectedMeasurement(val as MeasurementSystem)}
                                    gap="$3">
                            <XStack alignItems="center" gap="$3" padding="$3"
                                    backgroundColor={selectedMeasurement === MeasurementSystem.METRIC ? "$accent2" : "transparent"}
                                    borderRadius="$4">
                                <RadioGroup.Item value={MeasurementSystem.METRIC}
                                                 id="measure-metric" size="$4">
                                    <RadioGroup.Indicator/>
                                </RadioGroup.Item>
                                <Label htmlFor="measure-metric" flex={1} color="$color"
                                       fontSize={16}>{t('profile.measurementSection.metric')}</Label>
                                {selectedMeasurement === MeasurementSystem.METRIC &&
                                    <Check size={20} color="$accent7"/>}
                            </XStack>
                            <XStack alignItems="center" gap="$3" padding="$3"
                                    backgroundColor={selectedMeasurement === MeasurementSystem.IMPERIAL ? "$accent2" : "transparent"}
                                    borderRadius="$4">
                                <RadioGroup.Item value={MeasurementSystem.IMPERIAL}
                                                 id="measure-imperial" size="$4">
                                    <RadioGroup.Indicator/>
                                </RadioGroup.Item>
                                <Label htmlFor="measure-imperial" flex={1} color="$color"
                                       fontSize={16}>{t('profile.measurementSection.imperial')}</Label>
                                {selectedMeasurement === MeasurementSystem.IMPERIAL &&
                                    <Check size={20} color="$accent7"/>}
                            </XStack>
                        </RadioGroup>
                    ) : (
                        <Text color="$color" fontSize={16} paddingLeft="$3">
                            {selectedMeasurement === MeasurementSystem.METRIC
                                ? t('profile.measurementSection.metric')
                                : t('profile.measurementSection.imperial')}
                        </Text>
                    )}
                </YStack>
            </Card>

            {isEditing && (
                <YStack gap="$3" paddingTop="$2">
                    {selectedRoles.length === 0 && (
                        <Card backgroundColor="$warning2" borderRadius="$4" padding="$3"
                              borderWidth={1} borderColor="$warning5">
                            <Text textAlign="center" color="$warning10" fontSize={14}>
                                {t('profile.validation.selectAtLeastOneActivity')}
                            </Text>
                        </Card>
                    )}
                    <XStack gap="$3" justifyContent="flex-end">
                        <Button
                            flex={1}
                            size="$4"
                            backgroundColor="$content2"
                            color="$color"
                            borderWidth={1}
                            borderColor="$borderColor"
                            pressStyle={{backgroundColor: "$content3"}}
                            hoverStyle={{backgroundColor: "$content1"}}
                            onPress={handleCancel}
                            disabled={updateProfileStatus.loading}
                        >
                            {t('profile.actions.cancel')}
                        </Button>
                        <Button
                            flex={1}
                            size="$4"
                            backgroundColor="$accent7"
                            color="white"
                            pressStyle={{backgroundColor: "$accent6"}}
                            hoverStyle={{backgroundColor: "$accent2"}}
                            disabled={updateProfileStatus.loading || selectedRoles.length === 0}
                            opacity={updateProfileStatus.loading || selectedRoles.length === 0 ? 0.6 : 1}
                            onPress={handleSave}
                            icon={updateProfileStatus.loading ?
                                <Spinner color="white"/> : undefined}
                        >
                            {updateProfileStatus.loading ? t('profile.actions.saving') : t('profile.actions.saveChanges')}
                        </Button>
                    </XStack>
                </YStack>
            )}
        </YStack>
    );
};