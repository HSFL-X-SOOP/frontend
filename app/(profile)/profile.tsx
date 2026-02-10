import {useRouter, useFocusEffect, useLocalSearchParams} from 'expo-router';
import {useState, useEffect, useCallback, useRef} from 'react';
import {Platform, ScrollView, RefreshControl} from "react-native";
import {
    Text,
    View,
    YStack,
    Spinner,
    Separator,
    Tabs,
    H2,
    Button
} from "tamagui";
import {User, Anchor, Bell, CreditCard} from '@tamagui/lucide-icons';
import {useSession} from '@/context/SessionContext';
import {useTranslation, useToast} from '@/hooks/ui';
import {ProfileTab} from '@/components/profile/ProfileTab';
import {BoatsTab} from '@/components/profile/BoatsTab';
import {HarborMasterTab} from '@/components/profile/HarborMasterTab';
import {MyNotificationsTab} from '@/components/profile/MyNotificationsTab';
import {SubscriptionTab} from '@/components/profile/SubscriptionTab';
import {useLocationInfo, useUser} from '@/hooks/data';
import {DetailedLocationDTO} from '@/api/models/location';
import {getMapRoute} from '@/utils/navigation';
import {UI_CONSTANTS} from '@/config/constants';

export default function ProfileScreen() {
    const router = useRouter();
    const {t} = useTranslation();
    const toast = useToast();
    const params = useLocalSearchParams<{ subscription_status?: string; subscription_type?: string }>();
    const {session, updateProfile: updateSessionProfile} = useSession();
    const {getProfile, loading: isLoadingProfile} = useUser();
    const {
        isHarborMaster,
        fetchLocationInfo
    } = useLocationInfo();

    const [activeTab, setActiveTab] = useState("profile");
    const [harborLocation, setHarborLocation] = useState<DetailedLocationDTO | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const isWeb = Platform.OS === 'web';
    const isRefreshingRef = useRef(false);
    const hasHandledSubscriptionReturn = useRef(false);

    useEffect(() => {
        if (hasHandledSubscriptionReturn.current) return;

        const status = params.subscription_status
            ?? (isWeb && typeof window !== 'undefined'
                ? new URLSearchParams(window.location.search).get('subscription_status')
                : null);
        const subType = params.subscription_type
            ?? (isWeb && typeof window !== 'undefined'
                ? new URLSearchParams(window.location.search).get('subscription_type')
                : null);

        if (!status) return;
        hasHandledSubscriptionReturn.current = true;

        if (status === 'success') {
            if (subType === 'APP_NOTIFICATION') {
                setActiveTab('myNotifications');
                toast.success(t('subscription.successTitle'), {
                    message: t('subscription.successNotificationsMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            } else {
                setActiveTab('subscription');
                toast.success(t('subscription.successTitle'), {
                    message: t('subscription.successGenericMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        }

        // Clean up URL params on web
        if (isWeb && typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('subscription_status');
            url.searchParams.delete('subscription_type');
            window.history.replaceState({}, '', url.toString());
        }
    }, [params, isWeb, t, toast]);

    useEffect(() => {
        if (!session) {
            router.replace(getMapRoute());
        }
    }, [session, router]);

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

    // Fetch harbor location if user is harbor master
    useEffect(() => {
        if (isHarborMaster && !harborLocation) {
            void fetchLocationInfo(
                (locationData) => {
                    setHarborLocation(locationData);
                },
                (error) => {
                    // Silent fail - harbor name just won't show in tab
                    console.error('Failed to fetch harbor location:', error);
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHarborMaster, harborLocation]);

    const refreshData = useCallback(async (showIndicator: boolean = false) => {
        if (isRefreshingRef.current) {
            return;
        }

        isRefreshingRef.current = true;

        if (showIndicator) {
            setRefreshing(true);
        }

        await getProfile(
            (profile) => {
                updateSessionProfile(profile);
            },
            (error) => {
                console.error('Failed to refresh profile:', error);
            }
        );

        // Refresh harbor location if harbor master
        if (isHarborMaster) {
            await fetchLocationInfo(
                (locationData) => {
                    setHarborLocation(locationData);
                },
                (error) => {
                    console.error('Failed to fetch harbor location:', error);
                }
            );
        }

        if (showIndicator) {
            setRefreshing(false);
        }

        isRefreshingRef.current = false;
    }, [getProfile, updateSessionProfile, isHarborMaster, fetchLocationInfo]);

    // Manual pull-to-refresh (shows indicator)
    const handleManualRefresh = useCallback(async () => {
        await refreshData(true);
    }, [refreshData]);

    useFocusEffect(
        useCallback(() => {
            if (!isRefreshingRef.current) {
                void refreshData(false);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

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

    if ((!session?.profile || session?.profile?.profileCreatedAt === null) && !isLoadingProfile) {
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
                <ScrollView
                    refreshControl={
                        Platform.OS !== 'web' ? (
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleManualRefresh}
                                tintColor="$accent7"
                                colors={['$accent7']}
                            />
                        ) : undefined
                    }
                >
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

                            <View>
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
                                        flex={1}
                                        value="profile"
                                        borderRadius="$4"
                                        paddingHorizontal="$3"
                                        paddingVertical="$3"
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
                                        minHeight={60}
                                    >
                                        <YStack gap="$1.5" alignItems="center" justifyContent="center" width="100%">
                                            <User size={activeTab === "profile" ? 20 : 18}
                                                  color={"$accent7"}/>
                                            {(isWeb || activeTab === "profile") && (
                                                <Text
                                                    fontSize={activeTab === "profile" ? 13 : 12}
                                                    fontWeight={activeTab === "profile" ? "700" : "600"}
                                                    color={"$accent7"}
                                                    textAlign="center"
                                                    width="100%"
                                                    paddingHorizontal="$1"
                                                    numberOfLines={1}
                                                >
                                                    {session?.profile?.firstName && session?.profile?.lastName
                                                        ? `${session.profile.firstName} ${session.profile.lastName}`
                                                        : t('profile.tabs.profile')}
                                                </Text>
                                            )}
                                        </YStack>
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        flex={activeTab === "myNotifications" ? 1.5 : 1}
                                        value="myNotifications"
                                        borderRadius="$4"
                                        paddingHorizontal="$3"
                                        paddingVertical="$3"
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
                                        minHeight={60}
                                    >
                                        <YStack gap="$1.5" alignItems="center" justifyContent="center" width="100%">
                                            <Bell size={activeTab === "myNotifications" ? 20 : 18}
                                                  color={"$accent7"}/>
                                            {(isWeb || activeTab === "myNotifications") && (
                                                <Text
                                                    fontSize={activeTab === "myNotifications" ? 12 : 9}
                                                    fontWeight={activeTab === "myNotifications" ? "700" : "600"}
                                                    color={"$accent7"}
                                                    textAlign="center"
                                                    width="100%"
                                                    paddingHorizontal="$1"
                                                    numberOfLines={1}
                                                >
                                                    {t('profile.tabs.myNotifications')}
                                                </Text>
                                            )}
                                        </YStack>
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        flex={activeTab === "subscription" ? 1.5 : 1}
                                        value="subscription"
                                        borderRadius="$4"
                                        paddingHorizontal="$3"
                                        paddingVertical="$3"
                                        backgroundColor={activeTab === "subscription" ? "$accent7" : "transparent"}
                                        borderWidth={activeTab === "subscription" ? 2 : 0}
                                        borderColor={activeTab === "subscription" ? "$accent8" : "transparent"}
                                        elevation={activeTab === "subscription" ? "$2" : 0}
                                        pressStyle={{
                                            backgroundColor: activeTab === "subscription" ? "$accent6" : "$accent2",
                                            scale: 0.98
                                        }}
                                        hoverStyle={{backgroundColor: activeTab === "subscription" ? "$accent5" : "$content2"}}
                                        animation="quick"
                                        scale={activeTab === "subscription" ? 1 : 0.95}
                                        minHeight={60}
                                    >
                                        <YStack gap="$1.5" alignItems="center" justifyContent="center" width="100%">
                                            <CreditCard size={activeTab === "subscription" ? 20 : 18}
                                                  color={"$accent7"}/>
                                            {(isWeb || activeTab === "subscription") && (
                                                <Text
                                                    fontSize={activeTab === "subscription" ? 12 : 9}
                                                    fontWeight={activeTab === "subscription" ? "700" : "600"}
                                                    color={"$accent7"}
                                                    textAlign="center"
                                                    width="100%"
                                                    paddingHorizontal="$1"
                                                    numberOfLines={1}
                                                >
                                                    {t('profile.tabs.subscription')}
                                                </Text>
                                            )}
                                        </YStack>
                                    </Tabs.Tab>
                                    {isHarborMaster && (
                                        <Tabs.Tab
                                            flex={1}
                                            value="harbor"
                                            borderRadius="$4"
                                            paddingHorizontal="$3"
                                            paddingVertical="$3"
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
                                            minHeight={60}
                                        >
                                            <YStack gap="$1.5" alignItems="center" justifyContent="center" width="100%">
                                                <Anchor size={activeTab === "harbor" ? 20 : 18}
                                                      color={"$accent7"}/>
                                                {(isWeb || activeTab === "harbor") && (
                                                    <Text
                                                        fontSize={activeTab === "harbor" ? 13 : 12}
                                                        fontWeight={activeTab === "harbor" ? "700" : "600"}
                                                        color={"$accent7"}
                                                        textAlign="center"
                                                        width="100%"
                                                        paddingHorizontal="$1"
                                                    >
                                                        {harborLocation?.name || t('harbor.manageHarbor')}
                                                    </Text>
                                                )}
                                            </YStack>
                                        </Tabs.Tab>
                                    )}
                                </Tabs.List>

                                <Separator marginTop={isWeb ? "$2" : "$3"}/>
                            </View>

                            <Tabs.Content value="profile" padding="$0" marginTop="$4">
                                <ProfileTab/>
                            </Tabs.Content>

                            <Tabs.Content value="boats" padding="$0" marginTop="$4">
                                <BoatsTab/>
                            </Tabs.Content>

                            <Tabs.Content value="myNotifications" padding="$0" marginTop="$4">
                                <MyNotificationsTab/>
                            </Tabs.Content>

                            <Tabs.Content value="subscription" padding="$0" marginTop="$4">
                                <SubscriptionTab refreshing={refreshing}/>
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
