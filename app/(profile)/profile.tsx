import {useRouter} from 'expo-router';
import {useState, useEffect} from 'react';
import {ScrollView, SafeAreaView} from "react-native";
import {
    Button,
    Text,
    View,
    YStack,
    XStack,
    Card,
    H2,
    H5,
    H4,
    Spinner,
    Separator,
    RadioGroup,
    Label,
    Tabs
} from "tamagui";
import {User, Globe, Activity, Ruler, Check, Anchor} from '@tamagui/lucide-icons';
import {useToast} from '@/components/useToast';
import {useSession} from '@/context/SessionContext';
import {useUser} from '@/hooks/useUser';
import {ActivityRole, Language, MeasurementSystem} from '@/api/models/profile';
import {useTranslation} from '@/hooks/useTranslation';

export default function ProfileScreen() {
    const router = useRouter();
    const {t, changeLanguage} = useTranslation();
    const {session, updateProfile: updateSessionProfile} = useSession();
    const {getProfile, getProfileStatus, updateProfile, updateProfileStatus} = useUser();
    const toast = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.DE);
    const [selectedRoles, setSelectedRoles] = useState<ActivityRole[]>([]);
    const [selectedMeasurement, setSelectedMeasurement] = useState<MeasurementSystem>(MeasurementSystem.METRIC);

    useEffect(() => {
        const loadProfile = async () => {
            if (!session?.profile) {
                const profile = await getProfile();
                if (profile) {
                    updateSessionProfile(profile);
                }
            }
        };
        loadProfile();
    }, []);

    useEffect(() => {
        if (session?.profile) {
            setSelectedLanguage(session.profile.language);
            setSelectedRoles(session.profile.roles || []);
            setSelectedMeasurement(session.profile.measurementSystem);
        }
    }, [session?.profile]);

    useEffect(() => {
        if (session?.profile) {
            const langCode = session.profile.language === Language.DE ? 'de' : 'en';
            changeLanguage(langCode);
        }
    }, [session?.profile?.language]);

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
                duration: 3000
            });

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error(t('profile.saveError'), {
                message: error instanceof Error ? error.message : t('profile.saveErrorGeneric'),
                duration: 5000
            });
        }
    };

    const handleCancel = () => {
        if (session?.profile) {
            setSelectedLanguage(session.profile.language);
            setSelectedRoles(session.profile.roles || []);
            setSelectedMeasurement(session.profile.measurementSystem);
        }
        setIsEditing(false);
    };

    if (!session?.profile && getProfileStatus.loading) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <YStack flex={1} backgroundColor="$content3" alignItems="center" justifyContent="center" gap="$4">
                    <Spinner size="large" color="$accent7"/>
                    <Text color="$color" opacity={0.7}>{t('profile.loadingProfile')}</Text>
                </YStack>
            </SafeAreaView>
        );
    }

    if (!session?.profile && !getProfileStatus.loading) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <YStack flex={1} backgroundColor="$content3" alignItems="center" justifyContent="center" gap="$5"
                        padding="$4">
                    <View
                        width={100}
                        height={100}
                        backgroundColor="$accent2"
                        borderRadius="$12"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <User size={50} color="$accent7"/>
                    </View>
                    <YStack gap="$3" alignItems="center" maxWidth={400}>
                        <H2 color="$accent7" fontFamily="$oswald">{t('profile.noProfileFound')}</H2>
                        <Text color="$color" opacity={0.8} textAlign="center" fontSize={16}>
                            {t('profile.noProfileMessage')}
                        </Text>
                    </YStack>
                    <Button
                        size="$4"
                        backgroundColor="$accent7"
                        color="white"
                        pressStyle={{backgroundColor: "$accent6"}}
                        hoverStyle={{backgroundColor: "$accent4"}}
                        onPress={() => router.push('/(profile)/create-profile')}
                    >
                        {t('profile.createProfile')}
                    </Button>
                </YStack>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content3">
                <ScrollView>
                    <YStack padding="$4" gap="$4" paddingBottom="$8" paddingTop="$6">
                        <Tabs
                            defaultValue="profile"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            orientation="horizontal"
                            flexDirection="column"
                            width="100%"
                            borderRadius="$4"
                            overflow="hidden"
                        >
                            <Tabs.List
                                separator={<Separator vertical borderColor="$borderColor" opacity={0.3}/>}
                                disablePassBorderRadius="bottom"
                                backgroundColor="$conten1"
                                borderRadius="$6"
                                padding="$2"
                                borderWidth={2}
                                borderColor="$borderColor"
                                elevation="$3"
                            >
                                <Tabs.Tab
                                    flex={1}
                                    value="profile"
                                    borderRadius="$4"
                                    paddingVertical="$3.5"
                                    paddingHorizontal="$4"
                                    backgroundColor={activeTab === "profile" ? "$accent7" : "transparent"}
                                    borderWidth={activeTab === "profile" ? 2 : 0}
                                    borderColor={activeTab === "profile" ? "$accent8" : "transparent"}
                                    elevation={activeTab === "profile" ? "$2" : 0}
                                    pressStyle={{
                                        backgroundColor: activeTab === "profile" ? "$accent6" : "$accent2",
                                        scale: 0.98
                                    }}
                                    hoverStyle={{backgroundColor: activeTab === "profile" ? "$accent5" : "$content2"}}
                                    animation="quick"
                                    scale={activeTab === "profile" ? 1 : 0.95}
                                >
                                    <XStack gap="$3" alignItems="center" justifyContent="center">
                                        <User size={activeTab === "profile" ? 22 : 20}
                                              color={"$accent7"}/>
                                        <Text
                                            fontSize={activeTab === "profile" ? "$5" : "$4"}
                                            fontWeight={activeTab === "profile" ? "800" : "600"}
                                            color={"$accent7"}
                                            letterSpacing={activeTab === "profile" ? 0.5 : 0}
                                        >
                                            {t('profile.tabs.profile')}
                                        </Text>
                                    </XStack>
                                </Tabs.Tab>
                                <Tabs.Tab
                                    flex={1}
                                    value="boats"
                                    borderRadius="$4"
                                    paddingVertical="$3.5"
                                    paddingHorizontal="$4"
                                    backgroundColor={activeTab === "boats" ? "$accent7" : "transparent"}
                                    borderWidth={activeTab === "boats" ? 2 : 0}
                                    borderColor={activeTab === "boats" ? "$accent8" : "transparent"}
                                    elevation={activeTab === "boats" ? "$2" : 0}
                                    pressStyle={{
                                        backgroundColor: activeTab === "boats" ? "$accent6" : "$accent2",
                                        scale: 0.98
                                    }}
                                    hoverStyle={{backgroundColor: activeTab === "boats" ? "$accent5" : "$content2"}}
                                    animation="quick"
                                    scale={activeTab === "boats" ? 1 : 0.95}
                                >
                                    <XStack gap="$3" alignItems="center" justifyContent="center">
                                        <Anchor size={activeTab === "boats" ? 22 : 20}
                                                color={"$accent7"}/>
                                        <Text
                                            fontSize={activeTab === "boats" ? "$5" : "$4"}
                                            fontWeight={activeTab === "boats" ? "800" : "600"}
                                            color={"$accent7"}
                                            letterSpacing={activeTab === "boats" ? 0.5 : 0}
                                        >
                                            {t('profile.tabs.boats')}
                                        </Text>
                                    </XStack>
                                </Tabs.Tab>
                            </Tabs.List>

                            <Separator/>

                            <Tabs.Content value="profile" padding="$0" marginTop="$4">
                                <YStack gap="$4">
                                    <XStack justifyContent="flex-end" alignItems="center">
                                        {!isEditing ? (
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
                                        ) : null}
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
                                                <H5 color="$accent7"
                                                    fontFamily="$oswald">{t('profile.languageSection.title')}</H5>
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
                                                <H5 color="$accent7"
                                                    fontFamily="$oswald">{t('profile.activitiesSection.title')}</H5>
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
                                                <H5 color="$accent7"
                                                    fontFamily="$oswald">{t('profile.measurementSection.title')}</H5>
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
                            </Tabs.Content>

                            <Tabs.Content value="boats" padding="$0" marginTop="$4">
                                <YStack gap="$4">
                                    <Card elevate backgroundColor="$content1" borderRadius="$6" padding="$5"
                                          borderWidth={1} borderColor="$borderColor">
                                        <YStack gap="$4" alignItems="center" paddingVertical="$6">
                                            <View
                                                width={80}
                                                height={80}
                                                backgroundColor="$accent2"
                                                borderRadius="$10"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Anchor size={40} color="$accent7"/>
                                            </View>
                                            <YStack gap="$2" alignItems="center">
                                                <H4 color="$accent7"
                                                    fontFamily="$oswald">{t('profile.boats.title')}</H4>
                                                <Text color="$color" opacity={0.7} textAlign="center">
                                                    {t('profile.boats.noBoats')}
                                                </Text>
                                            </YStack>
                                            <Button
                                                size="$4"
                                                backgroundColor="$accent7"
                                                color="white"
                                                pressStyle={{backgroundColor: "$accent6"}}
                                                hoverStyle={{backgroundColor: "$accent4"}}
                                                icon={<Anchor size={16}/>}
                                            >
                                                {t('profile.boats.addBoat')}
                                            </Button>
                                        </YStack>
                                    </Card>
                                </YStack>
                            </Tabs.Content>
                        </Tabs>
                    </YStack>
                </ScrollView>
            </YStack>
        </SafeAreaView>
    );
}

