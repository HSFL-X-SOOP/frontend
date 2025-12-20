import React, {useState, useEffect} from 'react';
import {
    YStack,
    XStack,
    Card,
    H5,
    Text,
    Spinner,
    View,
    Separator,
    RadioGroup,
    Label,
    Dialog,
    Button
} from 'tamagui';
import {Globe, Activity, Ruler, Check, LogOut, User, Trash2} from '@tamagui/lucide-icons';
import {useTranslation,useToast} from '@/hooks/ui';
import {useRouter} from 'expo-router';

import {useSession} from '@/context/SessionContext';
import {useUser} from '@/hooks/data';
import {ActivityRole, Language, MeasurementSystem} from '@/api/models/profile';
import {UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';
import {getMapRoute} from '@/utils/navigation';

export const ProfileTab: React.FC = () => {
    const {t, changeLanguage} = useTranslation();
    const {session, updateProfile: updateSessionProfile, logout} = useSession();
    const {updateProfile, deleteProfile} = useUser();
    const toast = useToast();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.DE);
    const [selectedRoles, setSelectedRoles] = useState<ActivityRole[]>([]);
    const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementSystem>(MeasurementSystem.METRIC);

    useEffect(() => {
        if (session?.profile) {
            setSelectedLanguage(session.profile.language ?? Language.DE);
            setSelectedRoles(session.profile.activityRoles || []);
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
        setIsLoading(true);

        await updateProfile(
            {
                language: selectedLanguage,
                roles: selectedRoles,
                measurementSystem: selectedMeasurement
            },
            (updatedProfile) => {
                updateSessionProfile(updatedProfile);

                const langCode = selectedLanguage === Language.DE ? 'de' : 'en';
                changeLanguage(langCode);

                toast.success(t('profile.saveSuccess'), {
                    message: t('profile.settingsUpdated')
                });

                setIsEditing(false);
            },
            (error) => {
                toast.error(t('profile.saveError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG
                });
            }
        );
        setIsLoading(false);
    };

    const handleCancel = () => {
        if (session?.profile) {
            setSelectedLanguage(session.profile.language ?? Language.DE);
            setSelectedRoles(session.profile.activityRoles || []);
            setSelectedMeasurement(session.profile.measurementSystem ?? MeasurementSystem.METRIC);
        }
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        toast.info(t('auth.logoutSuccess'), {
            message: t('auth.logoutMessage'),
            duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM
        });
        router.push(getMapRoute());
    };

    const handleDeleteProfile = async () => {
        setIsDeleting(true);
        await deleteProfile(
            () => {
                toast.success(t('profile.deleteSuccess'), {
                    message: t('profile.accountDeleted'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG
                });
                logout();
                router.push(getMapRoute());
            },
            (error) => {
                toast.error(t('profile.deleteError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG
                });
            }
        );
        setIsDeleting(false);
        setShowDeleteDialog(false);
    };

    return (
        <YStack gap="$4">

            <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                  borderWidth={1} borderColor="$borderColor">
                <YStack gap="$4">
                    <XStack alignItems="center" gap="$3">
                        <View
                            width={40}
                            height={40}
                            backgroundColor="$content2"
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
                                    backgroundColor={selectedLanguage === Language.DE ? "$content2" : "transparent"}
                                    borderRadius="$6">
                                <RadioGroup.Item value={Language.DE} id="lang-de" size="$4">
                                    <RadioGroup.Indicator/>
                                </RadioGroup.Item>
                                <Label htmlFor="lang-de" flex={1} color="$color"
                                       fontSize={16}>{t('profile.languageSection.german')}</Label>
                                {selectedLanguage === Language.DE &&
                                    <Check size={20} color="$accent7"/>}
                            </XStack>
                            <XStack alignItems="center" gap="$3" padding="$3"
                                    backgroundColor={selectedLanguage === Language.EN ? "$content2" : "transparent"}
                                    borderRadius="$6">
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
                            backgroundColor="$content2"
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
                                    backgroundColor={selectedRoles.includes(role) ? "$content2" : "transparent"}
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
                            backgroundColor="$content2"
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
                                    backgroundColor={selectedMeasurement === MeasurementSystem.METRIC ? "$content2" : "transparent"}
                                    borderRadius="$6">
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
                                    backgroundColor={selectedMeasurement === MeasurementSystem.IMPERIAL ? "$content2" : "transparent"}
                                    borderRadius="$6">
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
                        <SecondaryButton
                            flex={1}
                            size="$4"
                            onPress={handleCancel}
                            disabled={isLoading}
                        >
                            <SecondaryButtonText>
                                {t('profile.actions.cancel')}
                            </SecondaryButtonText>
                        </SecondaryButton>
                        <PrimaryButton
                            flex={1}
                            size="$4"
                            disabled={isLoading || selectedRoles.length === 0}
                            onPress={handleSave}
                            icon={isLoading ?
                                <Spinner color="white"/> : undefined}
                        >
                            <PrimaryButtonText>
                                {isLoading ? t('profile.actions.saving') : t('profile.actions.saveChanges')}
                            </PrimaryButtonText>
                        </PrimaryButton>
                    </XStack>
                </YStack>
            )}

            {/* Account Actions */}
            {!isEditing && (
                <YStack gap="$3" marginTop="$2">
                    <Separator borderColor="$borderColor"/>
                    <Card backgroundColor="$content1" borderRadius="$6" padding="$4"
                          borderWidth={1} borderColor="$borderColor">
                        <YStack gap="$3">
                            <Text fontSize={15} fontWeight="600" color="$color">
                                {t('profile.accountActions')}
                            </Text>

                            <PrimaryButton
                                width="100%"
                                size="$4"
                                onPress={() => setIsEditing(true)}
                                icon={<User size={18} color="white"/>}
                            >
                                <PrimaryButtonText>
                                    {t('profile.edit')}
                                </PrimaryButtonText>
                            </PrimaryButton>

                            <SecondaryButton
                                width="100%"
                                size="$4"
                                onPress={handleLogout}
                                borderColor="$red10"
                                hoverStyle={{borderColor: "$red11"}}
                                pressStyle={{scale: 0.98, borderColor: "$red11"}}
                            >
                                <XStack alignItems="center" gap="$2" justifyContent="center">
                                    <LogOut size={20} color="$red10"/>
                                    <SecondaryButtonText color="$red10" fontWeight="600">
                                        {t('auth.logout')}
                                    </SecondaryButtonText>
                                </XStack>
                            </SecondaryButton>

                            <Separator marginVertical="$2" borderColor="$borderColor"/>

                            <Text fontSize={13} fontWeight="600" color="$red10">
                                {t('profile.dangerZone')}
                            </Text>

                            <PrimaryButton
                                width="100%"
                                size="$4"
                                onPress={() => setShowDeleteDialog(true)}
                                backgroundColor="$red9"
                                borderColor="$red10"
                                shadowColor="transparent"
                                shadowOffset={{width: 0, height: 0}}
                                shadowOpacity={0}
                                shadowRadius={0}
                                elevation={0}
                                hoverStyle={{backgroundColor: "$red10", borderColor: "$red11", shadowOpacity: 0}}
                                pressStyle={{backgroundColor: "$red8", scale: 0.98, borderColor: "$red10", shadowOpacity: 0}}
                                focusStyle={{borderColor: "$red11", shadowOpacity: 0}}
                                disabled={isDeleting}
                            >
                                <XStack alignItems="center" gap="$2" justifyContent="center">
                                    {isDeleting ? (
                                        <Spinner color="white" />
                                    ) : (
                                        <Trash2 size={20} color="white"/>
                                    )}
                                    <PrimaryButtonText fontWeight="600">
                                        {isDeleting ? t('profile.deleting') : t('profile.deleteAccount')}
                                    </PrimaryButtonText>
                                </XStack>
                            </PrimaryButton>
                        </YStack>
                    </Card>
                </YStack>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog modal open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                    <Dialog.Content
                        bordered
                        elevate
                        key="content"
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                        gap="$4"
                        backgroundColor="$content1"
                        maxWidth={400}
                        width="90%"
                    >
                        <Dialog.Title fontSize={20} fontWeight="700" color="$red10">
                            {t('profile.deleteDialogTitle')}
                        </Dialog.Title>
                        <Dialog.Description color="$color">
                            {t('profile.deleteDialogMessage')}
                        </Dialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <Dialog.Close asChild>
                                <SecondaryButton size="$4">
                                    <SecondaryButtonText>
                                        {t('profile.actions.cancel')}
                                    </SecondaryButtonText>
                                </SecondaryButton>
                            </Dialog.Close>
                            <PrimaryButton
                                size="$4"
                                backgroundColor="$red9"
                                borderColor="$red10"
                                shadowColor="transparent"
                                shadowOffset={{width: 0, height: 0}}
                                shadowOpacity={0}
                                shadowRadius={0}
                                elevation={0}
                                hoverStyle={{backgroundColor: "$red10", borderColor: "$red11", shadowOpacity: 0}}
                                pressStyle={{backgroundColor: "$red8", scale: 0.98, borderColor: "$red10", shadowOpacity: 0}}
                                focusStyle={{borderColor: "$red11", shadowOpacity: 0}}
                                onPress={handleDeleteProfile}
                                disabled={isDeleting}
                            >
                                <XStack alignItems="center" gap="$2">
                                    {isDeleting && <Spinner color="white" />}
                                    <PrimaryButtonText fontWeight="600">
                                        {isDeleting ? t('profile.deleting') : t('profile.confirmDelete')}
                                    </PrimaryButtonText>
                                </XStack>
                            </PrimaryButton>
                        </XStack>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>
        </YStack>
    );
};
