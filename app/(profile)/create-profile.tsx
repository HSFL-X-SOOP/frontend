import {useRouter} from 'expo-router';
import {useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {Text, YStack, XStack, H2, H5, Card, RadioGroup, Label, Separator, View, Spinner} from 'tamagui';
import {Globe, Activity, Ruler, Check, User} from '@tamagui/lucide-icons';
import {useUser} from '@/hooks/data';
import {ActivityRole, Language, MeasurementSystem} from '@/api/models/profile';
import {useSession} from '@/context/SessionContext';
import {useTranslation, useToast} from '@/hooks/ui';
import {EmailInput} from '@/components/auth/EmailInput';
import {PrimaryButton, PrimaryButtonText} from '@/types/button';
import { createLogger } from '@/utils/logger';

const logger = createLogger('Profile:CreateProfile');

export default function CreateProfileScreen() {
    const router = useRouter();
    const {t, changeLanguage} = useTranslation();
    const toast = useToast();
    const {createProfile} = useUser();
    const {updateProfile: updateSessionProfile} = useSession();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.DE);
    const [selectedRoles, setSelectedRoles] = useState<ActivityRole[]>([]);
    const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementSystem>(MeasurementSystem.METRIC);
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleToggle = (role: ActivityRole) => {
        logger.debug('Toggling role:', { role });
        setSelectedRoles(prev => {
            const newRoles = prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role];
            logger.debug('Selected roles after toggle:', { roles: newRoles });
            return newRoles;
        });
    };

    const handleSubmit = async () => {
        logger.debug('Starting profile creation with:', {
            firstName,
            lastName,
            language: selectedLanguage,
            selectedRoles: selectedRoles,
            selectedRolesLength: selectedRoles.length,
            selectedRolesValues: selectedRoles.join(', '),
            measurementSystem: selectedMeasurement
        });

        // Validierung
        if (!firstName.trim() || !lastName.trim()) {
            toast.error(t('profile.validation.nameRequired'));
            return;
        }

        if (selectedRoles.length === 0) {
            toast.error(t('profile.validation.selectAtLeastOneActivity'));
            return;
        }

        const requestData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            language: selectedLanguage,
            roles: selectedRoles,
            measurementSystem: selectedMeasurement
        };
        logger.debug('Sending request:', requestData);

        setIsLoading(true);
        await createProfile(
            requestData,
            (profile) => {
                logger.info('Profile created successfully', { profile });
                updateSessionProfile(profile);
                logger.debug('Profile saved to session');

                const langCode = selectedLanguage === Language.DE ? 'de' : 'en';
                changeLanguage(langCode);

                toast.success(t('profile.createProfile'), {
                    message: t('profile.profileCreated')
                });

                router.replace('/map');
            },
            (error) => {
                toast.error(t('profile.errors.creationFailed'), {
                    message: t(error.onGetMessage())
                });
            }
        );
        setIsLoading(false);
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content3">
                <ScrollView>
                    <YStack padding="$4" gap="$5" paddingBottom="$8" paddingTop="$6">
                        <YStack gap="$3">
                            <H2 color="$accent7" fontFamily="$oswald">
                                {t('profile.createProfile')}
                            </H2>
                            <Text color="$color" opacity={0.8} fontSize={16}>
                                {t('profile.noProfileMessage')}
                            </Text>
                        </YStack>

                        <YStack gap="$4">
                            {/* Name Section */}
                            <Card elevate backgroundColor="$content1" borderRadius="$6" padding="$5" borderWidth={1}
                                  borderColor="$borderColor">
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
                                            <User size={22} color="$accent7"/>
                                        </View>
                                        <H5 color="$accent7" fontFamily="$oswald">
                                            {t('profile.nameSection.title')}
                                        </H5>
                                    </XStack>
                                    <Separator/>
                                    <YStack gap="$3">
                                        <YStack gap="$2">
                                            <EmailInput
                                                value={firstName}
                                                onChangeText={setFirstName}
                                                placeholder={t('profile.nameSection.firstNamePlaceholder')}
                                                label={t('profile.nameSection.firstName')}
                                            />
                                        </YStack>
                                        <YStack gap="$2">
                                            <EmailInput
                                                value={lastName}
                                                onChangeText={setLastName}
                                                placeholder={t('profile.nameSection.lastNamePlaceholder')}
                                                label={t('profile.nameSection.lastName')}
                                            />
                                        </YStack>
                                    </YStack>
                                </YStack>
                            </Card>

                            {/* Language Section */}
                            <Card elevate backgroundColor="$content1" borderRadius="$6" padding="$5" borderWidth={1}
                                  borderColor="$borderColor">
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
                                        <H5 color="$accent7"
                                            fontFamily="$oswald">{t('profile.languageSection.title')}</H5>
                                    </XStack>
                                    <Separator/>
                                    <RadioGroup value={selectedLanguage}
                                                onValueChange={(val) => setSelectedLanguage(val as Language)} gap="$3">
                                        <XStack alignItems="center" gap="$3" padding="$3"
                                                backgroundColor={selectedLanguage === Language.DE ? "$accent2" : "transparent"}
                                                borderRadius="$4">
                                            <RadioGroup.Item value={Language.DE} id="create-lang-de" size="$4">
                                                <RadioGroup.Indicator/>
                                            </RadioGroup.Item>
                                            <Label htmlFor="create-lang-de" flex={1} color="$color"
                                                   fontSize={16}>{t('profile.languageSection.german')}</Label>
                                            {selectedLanguage === Language.DE && <Check size={20} color="$accent7"/>}
                                        </XStack>
                                        <XStack alignItems="center" gap="$3" padding="$3"
                                                backgroundColor={selectedLanguage === Language.EN ? "$accent2" : "transparent"}
                                                borderRadius="$4">
                                            <RadioGroup.Item value={Language.EN} id="create-lang-en" size="$4">
                                                <RadioGroup.Indicator/>
                                            </RadioGroup.Item>
                                            <Label htmlFor="create-lang-en" flex={1} color="$color"
                                                   fontSize={16}>{t('profile.languageSection.english')}</Label>
                                            {selectedLanguage === Language.EN && <Check size={20} color="$accent7"/>}
                                        </XStack>
                                    </RadioGroup>
                                </YStack>
                            </Card>

                            <Card elevate backgroundColor="$content1" borderRadius="$6" padding="$5" borderWidth={1}
                                  borderColor="$borderColor">
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
                                        <H5 color="$accent7"
                                            fontFamily="$oswald">{t('profile.activitiesSection.title')}</H5>
                                    </XStack>
                                    <Separator/>
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
                                                    {selectedRoles.includes(role) && <Check size={16} color="white"/>}
                                                </View>
                                                <Text flex={1} color="$color" fontSize={16}>
                                                    {t(`profile.activitiesSection.roles.${role}`)}
                                                </Text>
                                            </XStack>
                                        ))}
                                    </YStack>
                                </YStack>
                            </Card>

                            <Card elevate backgroundColor="$content1" borderRadius="$6" padding="$5" borderWidth={1}
                                  borderColor="$borderColor">
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
                                        <H5 color="$accent7"
                                            fontFamily="$oswald">{t('profile.measurementSection.title')}</H5>
                                    </XStack>
                                    <Separator/>
                                    <RadioGroup value={selectedMeasurement}
                                                onValueChange={(val) => setSelectedMeasurement(val as MeasurementSystem)}
                                                gap="$3">
                                        <XStack alignItems="center" gap="$3" padding="$3"
                                                backgroundColor={selectedMeasurement === MeasurementSystem.METRIC ? "$accent2" : "transparent"}
                                                borderRadius="$4">
                                            <RadioGroup.Item value={MeasurementSystem.METRIC} id="create-measure-metric"
                                                             size="$4">
                                                <RadioGroup.Indicator/>
                                            </RadioGroup.Item>
                                            <Label htmlFor="create-measure-metric" flex={1} color="$color"
                                                   fontSize={16}>{t('profile.measurementSection.metric')}</Label>
                                            {selectedMeasurement === MeasurementSystem.METRIC &&
                                                <Check size={20} color="$accent7"/>}
                                        </XStack>
                                        <XStack alignItems="center" gap="$3" padding="$3"
                                                backgroundColor={selectedMeasurement === MeasurementSystem.IMPERIAL ? "$accent2" : "transparent"}
                                                borderRadius="$4">
                                            <RadioGroup.Item value={MeasurementSystem.IMPERIAL}
                                                             id="create-measure-imperial" size="$4">
                                                <RadioGroup.Indicator/>
                                            </RadioGroup.Item>
                                            <Label htmlFor="create-measure-imperial" flex={1} color="$color"
                                                   fontSize={16}>{t('profile.measurementSection.imperial')}</Label>
                                            {selectedMeasurement === MeasurementSystem.IMPERIAL &&
                                                <Check size={20} color="$accent7"/>}
                                        </XStack>
                                    </RadioGroup>
                                </YStack>
                            </Card>

                            <YStack gap="$3" paddingTop="$2">
                                {selectedRoles.length === 0 && (
                                    <Card borderRadius="$4" backgroundColor={"$orange6"} padding="$3" borderWidth={1}
                                          borderColor="$warning5">
                                        <Text textAlign="center" color="$warning10" fontSize={14}>
                                            {t('profile.validation.selectAtLeastOneActivity')}
                                        </Text>
                                    </Card>
                                )}
                                <XStack gap="$3" justifyContent="flex-end">
                                    <PrimaryButton
                                        flex={1}
                                        size="$4"
                                        disabled={isLoading || selectedRoles.length === 0}
                                        onPress={handleSubmit}
                                        icon={isLoading ? <Spinner color="white"/> : undefined}
                                    >
                                        <PrimaryButtonText>
                                            {isLoading ? t('profile.actions.saving') : t('profile.createProfile')}
                                        </PrimaryButtonText>
                                    </PrimaryButton>
                                </XStack>
                            </YStack>
                        </YStack>
                    </YStack>
                </ScrollView>
            </YStack>
        </SafeAreaView>
    );
}
