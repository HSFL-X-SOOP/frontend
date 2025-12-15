import {useRouter} from 'expo-router';
import {useState, useEffect} from 'react';
import {ScrollView} from "react-native";
import {
    Button,
    Text,
    View,
    YStack,
    XStack,
    H2,
    Spinner,
    Separator,
    Tabs
} from "tamagui";
import {User, Anchor, Home} from '@tamagui/lucide-icons';
import {useSession} from '@/context/SessionContext';
import {useTranslation, useToast} from '@/hooks/ui';
import {ProfileTab} from '@/components/profile/ProfileTab';
import {BoatsTab} from '@/components/profile/BoatsTab';
import {HarborMasterTab} from '@/components/profile/HarborMasterTab';
import {MyNotificationsTab} from '@/components/profile/MyNotificationsTab';
import {useLocationInfo, useUser} from '@/hooks/data';

export default function ProfileScreen() {
    const router = useRouter();
    const {t} = useTranslation();
    const toast = useToast();
    const {session, updateProfile: updateSessionProfile} = useSession();
    const {getProfile, loading: isLoadingProfile} = useUser();
    const {
        isHarborMaster
    } = useLocationInfo();

    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        if (!session?.profile) {
            void getProfile(
                (profile) => {
                    updateSessionProfile(profile);
                },
                (error) => {
                    toast.error(t('harbor.errorLoading'), {
                        message: t(error.onGetMessage())
                    });
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.profile]); // getProfile is a hook function and changes on every render

    if (!session?.profile && isLoadingProfile) {
        return (
            <View style={{flex: 1}}>
                <YStack flex={1} backgroundColor="$content3" alignItems="center" justifyContent="center" gap="$4">
                    <Spinner size="large" color="$accent7"/>
                    <Text color="$color" opacity={0.7}>{t('profile.loadingProfile')}</Text>
                </YStack>
            </View>
        );
    }

    if (!session?.profile && !isLoadingProfile) {
        return (
            <View style={{flex: 1}}>
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
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content1">
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
                                backgroundColor="$content1"
                                borderRadius="$6"
                                padding="$2"
                                borderWidth={2}
                                borderColor="$borderColor"
                                elevation="$3"
                            >
                                <Tabs.Tab
                                    flex={0.5}
                                    value="profile"
                                    borderRadius="$4"
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
                                {/* <Tabs.Tab
                                    flex={1}
                                    value="boats"
                                    borderRadius="$4"
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
                                    <XStack gap="$3" alignItems="center" justifyContent="center" >
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
                                </Tabs.Tab> */}
                                <Tabs.Tab
                                    flex={1}
                                    value="myNotifications"
                                    borderRadius="$4"
                                    paddingHorizontal="$4"
                                    backgroundColor={activeTab === "myNotifications" ? "$accent7" : "transparent"}
                                    borderWidth={activeTab === "myNotifications" ? 2 : 0}
                                    borderColor={activeTab === "myNotifications" ? "$accent8" : "transparent"}
                                    elevation={activeTab === "myNotifications" ? "$2" : 0}
                                    pressStyle={{
                                        backgroundColor: activeTab === "myNotifications" ? "$accent6" : "$accent2",
                                        scale: 0.98
                                    }}
                                    hoverStyle={{backgroundColor: activeTab === "myNotifications" ? "$accent5" : "$content2"}}
                                    animation="quick"
                                    scale={activeTab === "myNotifications" ? 1 : 0.95}
                                >
                                    <XStack gap="$3" alignItems="center" justifyContent="center">
                                        <Text
                                            fontSize={activeTab === "myNotifications" ? "$5" : "$4"}
                                            fontWeight={activeTab === "myNotifications" ? "800" : "600"}
                                            color={"$accent7"}
                                            letterSpacing={activeTab === "myNotifications" ? 0.5 : 0}
                                        >
                                            {t('profile.tabs.myNotifications')}
                                        </Text>
                                    </XStack>
                                </Tabs.Tab>
                                {isHarborMaster && (
                                    <Tabs.Tab
                                        flex={1}
                                        value="harbor"
                                        borderRadius="$4"
                                        paddingVertical="$3.5"
                                        paddingHorizontal="$4"
                                        backgroundColor={activeTab === "harbor" ? "$accent7" : "transparent"}
                                        borderWidth={activeTab === "harbor" ? 2 : 0}
                                        borderColor={activeTab === "harbor" ? "$accent8" : "transparent"}
                                        elevation={activeTab === "harbor" ? "$2" : 0}
                                        pressStyle={{
                                            backgroundColor: activeTab === "harbor" ? "$accent6" : "$accent2",
                                            scale: 0.98
                                        }}
                                        hoverStyle={{backgroundColor: activeTab === "harbor" ? "$accent5" : "$content2"}}
                                        animation="quick"
                                        scale={activeTab === "harbor" ? 1 : 0.95}
                                    >
                                        <XStack gap="$3" alignItems="center" justifyContent="center">
                                            <Home size={activeTab === "harbor" ? 22 : 20}
                                                  color={"$accent7"}/>
                                            <Text
                                                fontSize={activeTab === "harbor" ? "$5" : "$4"}
                                                fontWeight={activeTab === "harbor" ? "800" : "600"}
                                                color={"$accent7"}
                                                letterSpacing={activeTab === "harbor" ? 0.5 : 0}
                                            >
                                                {t('harbor.title')}
                                            </Text>
                                        </XStack>
                                    </Tabs.Tab>
                                )}
                            </Tabs.List>

                            <Separator/>

                            <Tabs.Content value="profile" padding="$0" marginTop="$4">
                                <ProfileTab/>
                            </Tabs.Content>

                            <Tabs.Content value="boats" padding="$0" marginTop="$4">
                                <BoatsTab/>
                            </Tabs.Content>

                            <Tabs.Content value="myNotifications" padding="$0" marginTop="$4">
                                <MyNotificationsTab/>
                            </Tabs.Content>

                            {isHarborMaster && (
                                <Tabs.Content value="harbor" padding="$0" marginTop="$4">
                                    <HarborMasterTab/>
                                </Tabs.Content>
                            )}
                        </Tabs>
                    </YStack>
                </ScrollView>
            </YStack>
        </View>
    );
}
