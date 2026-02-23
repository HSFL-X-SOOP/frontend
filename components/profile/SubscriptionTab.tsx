import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Clipboard, Platform} from 'react-native';
import {
    YStack,
    XStack,
    Card,
    H5,
    Text,
    Spinner,
    View,
    Separator,
    Dialog,
    Tabs,
    Input,
} from 'tamagui';
import {Bell, Code, Check, Pause, Play, ExternalLink, Key, Trash2, Copy} from '@tamagui/lucide-icons';
import {useTranslation, useToast} from '@/hooks/ui';
import {useFocusEffect} from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import {useApiKey, useSubscription} from '@/hooks/data';
import {
    SubscriptionType,
    SubscriptionStatus,
    SubscriptionInfo,
    SubscriptionStatusResponse,
} from '@/api/models/subscription';
import {ApiKeyInfo, CreateApiKeyResponse} from '@/api/models/apiKey';
import {useStripePayment} from '@/hooks/useStripePayment';
import {WebPaymentDialog} from '@/components/profile/WebPaymentDialog';
import {StripeProviderWrapper} from '@/components/providers/StripeProviderWrapper';
import {APP_METADATA, UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';
import {MyNotificationsTab} from '@/components/profile/MyNotificationsTab';
import {SubscriptionBillingSection} from '@/components/profile/SubscriptionBillingSection';
import {useSubscriptionCheckout} from '@/hooks/profile/useSubscriptionCheckout';

const STATUS_COLORS: Record<string, string> = {
    [SubscriptionStatus.ACTIVE]: '#22c55e',
    [SubscriptionStatus.TRIALING]: '#3b82f6',
    [SubscriptionStatus.PAST_DUE]: '#f97316',
    [SubscriptionStatus.CANCELED]: '#ef4444',
    [SubscriptionStatus.PAUSED]: '#a855f7',
};

const INACTIVE_COLOR = '#9ca3af';

function getStatusColor(status: SubscriptionStatus | null): string {
    if (!status) return INACTIVE_COLOR;
    return STATUS_COLORS[status] ?? INACTIVE_COLOR;
}

function getStatusLabel(status: SubscriptionStatus | null, t: (key: string) => string): string {
    if (!status) return t('subscription.status.inactive');
    const map: Record<string, string> = {
        [SubscriptionStatus.ACTIVE]: t('subscription.status.active'),
        [SubscriptionStatus.TRIALING]: t('subscription.status.trialing'),
        [SubscriptionStatus.PAST_DUE]: t('subscription.status.past_due'),
        [SubscriptionStatus.CANCELED]: t('subscription.status.canceled'),
        [SubscriptionStatus.PAUSED]: t('subscription.status.paused'),
    };
    return map[status] ?? t('subscription.status.inactive');
}

function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'});
}

function isSubscriptionActive(sub: SubscriptionInfo | null): boolean {
    if (!sub) return false;
    return sub.status === SubscriptionStatus.ACTIVE || sub.status === SubscriptionStatus.TRIALING;
}

interface SubscriptionTabProps {
    refreshing?: boolean;
}

export const SubscriptionTab: React.FC<SubscriptionTabProps> = (props) => (
    <StripeProviderWrapper>
        <SubscriptionTabContent {...props} />
    </StripeProviderWrapper>
);

const SubscriptionTabContent: React.FC<SubscriptionTabProps> = ({refreshing = false}) => {
    const {t} = useTranslation();
    const toast = useToast();
    const isWeb = Platform.OS === 'web';
    const {
        loading,
        getStatus,
        createSubscription,
        createPortalSession,
        cancelSubscription,
        reactivateSubscription,
        getInvoices,
        createSetupIntent,
        pauseSubscription,
        resumeSubscription
    } = useSubscription();
    const {listApiKeys, createApiKey, revokeApiKey} = useApiKey();
    const {presentPayment} = useStripePayment();

    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatusResponse | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [cancelTarget, setCancelTarget] = useState<SubscriptionType | null>(null);
    const [isCanceling, setIsCanceling] = useState(false);
    const [reactivateTarget, setReactivateTarget] = useState<SubscriptionType | null>(null);
    const [isReactivating, setIsReactivating] = useState(false);
    const [pauseTarget, setPauseTarget] = useState<SubscriptionType | null>(null);
    const [isPausing, setIsPausing] = useState(false);
    const [resumeTarget, setResumeTarget] = useState<SubscriptionType | null>(null);
    const [isResuming, setIsResuming] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const prevRefreshingRef = useRef(refreshing);
    const [technicalTab, setTechnicalTab] = useState('notifications');
    const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
    const [apiKeyName, setApiKeyName] = useState('');
    const [newApiKey, setNewApiKey] = useState<CreateApiKeyResponse | null>(null);
    const [apiKeysLoading, setApiKeysLoading] = useState(false);
    const [isCreatingApiKey, setIsCreatingApiKey] = useState(false);
    const [revokingApiKeyId, setRevokingApiKeyId] = useState<string | null>(null);

    const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);
    const {
        paymentDialogParams,
        handleSubscribe,
        handlePaymentSuccess,
        closePaymentDialog,
    } = useSubscriptionCheckout({
        createSubscription,
        presentPayment,
        onTriggerRefresh: triggerRefresh,
    });
    const notificationsSub = subscriptionStatus?.notifications ?? null;
    const apiAccessSub = subscriptionStatus?.apiAccess ?? null;
    const hasNotificationsAccess = isSubscriptionActive(notificationsSub);
    const hasApiAccess = isSubscriptionActive(apiAccessSub);

    const loadApiKeys = useCallback((showErrorToast = true) => {
        setApiKeysLoading(true);
        void listApiKeys(
            (data) => {
                setApiKeys(data);
                setApiKeysLoading(false);
            },
            (error) => {
                setApiKeysLoading(false);
                if (!showErrorToast) {
                    return;
                }
                toast.error(t('subscription.apiKeyLoadErrorTitle'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
    }, [listApiKeys, t, toast]);

    useEffect(() => {
        void getStatus(
            (data) => {
                setSubscriptionStatus(data);
                const hasApiAccessPlan = isSubscriptionActive(data.apiAccess ?? null);
                if (hasApiAccessPlan) {
                    loadApiKeys(false);
                } else {
                    setApiKeys([]);
                    setNewApiKey(null);
                    setApiKeysLoading(false);
                }
                setIsInitialLoading(false);
            },
            (error) => {
                toast.error(t('subscription.statusError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
                setIsInitialLoading(false);
            }
        );
        // Intentionally keyed only by refreshKey to avoid request loops from unstable hook callbacks.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    useFocusEffect(
        useCallback(() => {
            triggerRefresh();
        }, [triggerRefresh])
    );

    useEffect(() => {
        if (refreshing && !prevRefreshingRef.current) {
            triggerRefresh();
        }
        prevRefreshingRef.current = refreshing;
    }, [refreshing, triggerRefresh]);

    useEffect(() => {
        if (technicalTab === 'notifications' && !hasNotificationsAccess && hasApiAccess) {
            setTechnicalTab('apiKeys');
            return;
        }
        if (technicalTab === 'apiKeys' && !hasApiAccess && hasNotificationsAccess) {
            setTechnicalTab('notifications');
        }
    }, [technicalTab, hasNotificationsAccess, hasApiAccess]);

    const updateLocalSubscription = useCallback((type: SubscriptionType, updater: (sub: SubscriptionInfo) => SubscriptionInfo) => {
        setSubscriptionStatus(prev => {
            if (!prev) return prev;
            const key = type === SubscriptionType.APP_NOTIFICATION ? 'notifications' : 'apiAccess';
            const current = prev[key];
            if (!current) return prev;
            return {...prev, [key]: updater(current)};
        });
    }, []);

    const handleCancel = async () => {
        if (!cancelTarget) return;
        setIsCanceling(true);

        await cancelSubscription(
            {subscriptionType: cancelTarget},
            () => {
                toast.success(t('subscription.cancelSuccess'), {
                    message: t('subscription.cancelSuccessMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
                updateLocalSubscription(cancelTarget, sub => ({...sub, cancelAtPeriodEnd: true}));
                setCancelTarget(null);
            },
            (error) => {
                toast.error(t('subscription.cancelError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
        setIsCanceling(false);
    };

    const handleReactivateConfirm = async () => {
        if (!reactivateTarget) return;
        setIsReactivating(true);

        await reactivateSubscription(
            {subscriptionType: reactivateTarget},
            () => {
                toast.success(t('subscription.reactivateSuccess'), {
                    message: t('subscription.reactivateSuccessMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
                updateLocalSubscription(reactivateTarget, sub => ({...sub, cancelAtPeriodEnd: false}));
                setReactivateTarget(null);
            },
            (error) => {
                toast.error(t('subscription.reactivateError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
        setIsReactivating(false);
    };

    const handlePause = async () => {
        if (!pauseTarget) return;
        setIsPausing(true);

        await pauseSubscription(
            {subscriptionType: pauseTarget},
            (updatedSub) => {
                toast.success(t('subscription.pauseSuccess'), {
                    message: t('subscription.pauseSuccessMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
                updateLocalSubscription(pauseTarget, () => updatedSub);
                setPauseTarget(null);
            },
            (error) => {
                toast.error(t('subscription.pauseError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
        setIsPausing(false);
    };

    const handleResume = async () => {
        if (!resumeTarget) return;
        setIsResuming(true);

        await resumeSubscription(
            {subscriptionType: resumeTarget},
            (updatedSub) => {
                toast.success(t('subscription.resumeSuccess'), {
                    message: t('subscription.resumeSuccessMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
                updateLocalSubscription(resumeTarget, () => updatedSub);
                setResumeTarget(null);
            },
            (error) => {
                toast.error(t('subscription.resumeError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
        setIsResuming(false);
    };

    const handleOpenApiDocs = () => {
        if (isWeb && typeof window !== 'undefined') {
            window.open(APP_METADATA.API_DOCS, '_blank', 'noopener,noreferrer');
            return;
        }
        void WebBrowser.openBrowserAsync(APP_METADATA.API_DOCS);
    };

    const handleCopyApiKey = async () => {
        if (!newApiKey?.key) {
            return;
        }

        try {
            if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(newApiKey.key);
            } else if (Platform.OS === 'web' && typeof document !== 'undefined') {
                const textArea = document.createElement('textarea');
                textArea.value = newApiKey.key;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const copied = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (!copied) {
                    throw new Error('copy failed');
                }
            } else {
                Clipboard.setString(newApiKey.key);
            }

            toast.success(t('subscription.apiKeyCopiedTitle'), {
                message: t('subscription.apiKeyCopiedMessage'),
                duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM,
            });
        } catch {
            toast.error(t('subscription.apiKeyCopyErrorTitle'), {
                message: t('subscription.apiKeyCopyErrorMessage'),
                duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM,
            });
        }
    };

    const handleCreateApiKey = async () => {
        if (!hasApiAccess || isCreatingApiKey) {
            return;
        }

        setIsCreatingApiKey(true);
        const trimmedName = apiKeyName.trim();

        await createApiKey(
            trimmedName ? {name: trimmedName} : {},
            (data) => {
                setNewApiKey(data);
                setApiKeyName('');
                toast.success(t('subscription.apiKeyCreatedTitle'), {
                    message: t('subscription.apiKeyCreatedMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM,
                });
                loadApiKeys(false);
            },
            (error) => {
                toast.error(t('subscription.apiKeyCreateErrorTitle'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );

        setIsCreatingApiKey(false);
    };

    const handleRevokeApiKey = async (id: string) => {
        if (revokingApiKeyId || isCreatingApiKey) {
            return;
        }

        setRevokingApiKeyId(id);
        await revokeApiKey(
            id,
            (data) => {
                if (!data.revoked) {
                    toast.error(t('subscription.apiKeyRevokeErrorTitle'), {
                        message: t('subscription.apiKeyRevokeErrorMessage'),
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                    });
                    return;
                }

                setApiKeys((prev) => prev.filter((item) => item.id !== id));
                if (newApiKey?.id === id) {
                    setNewApiKey(null);
                }
                toast.success(t('subscription.apiKeyRevokedTitle'), {
                    message: t('subscription.apiKeyRevokedMessage'),
                    duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM,
                });
            },
            (error) => {
                toast.error(t('subscription.apiKeyRevokeErrorTitle'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
        setRevokingApiKeyId(null);
    };

    if (isInitialLoading) {
        return (
            <YStack alignItems="center" justifyContent="center" padding="$8" gap="$4">
                <Spinner size="large" color="$accent7"/>
                <Text color="$color" opacity={0.7}>{t('common.loading')}</Text>
            </YStack>
        );
    }

    const notificationsTabDisabled = !hasNotificationsAccess;
    const apiKeysTabDisabled = !hasApiAccess;
    const notificationsTabActive = technicalTab === 'notifications' && !notificationsTabDisabled;
    const apiKeysTabActive = technicalTab === 'apiKeys' && !apiKeysTabDisabled;

    return (
        <YStack gap="$4">
            {/* APP_NOTIFICATION Plan Card */}
            <XStack gap="$4" flexWrap="wrap">
                <YStack flex={1} minWidth={310}>
                    <PlanCard
                        icon={<Bell size={22} color="$accent7"/>}
                        title={t('subscription.appNotifications')}
                        description={t('subscription.appNotificationsDesc')}
                        price="4.99€"
                        features={[
                            t('subscription.features.notifications.1'),
                            t('subscription.features.notifications.2'),
                            t('subscription.features.notifications.3'),
                        ]}
                        subscription={notificationsSub}
                        subscriptionType={SubscriptionType.APP_NOTIFICATION}
                        onSubscribe={handleSubscribe}
                        onCancel={(type) => setCancelTarget(type)}
                        onReactivate={(type) => setReactivateTarget(type)}
                        onPause={(type) => setPauseTarget(type)}
                        onResume={(type) => setResumeTarget(type)}
                        isLoading={loading}
                        t={t}
                    />
                </YStack>

                {/* API_ACCESS Plan Card */}
                <YStack flex={1} minWidth={310}>
                    <PlanCard
                        icon={<Code size={22} color="$accent7"/>}
                        title={t('subscription.apiAccess')}
                        description={t('subscription.apiAccessDesc')}
                        price="9.99€"
                        features={[
                            t('subscription.features.api.1'),
                            t('subscription.features.api.2'),
                            t('subscription.features.api.3'),
                        ]}
                        subscription={apiAccessSub}
                        subscriptionType={SubscriptionType.API_ACCESS}
                        onSubscribe={handleSubscribe}
                        onCancel={(type) => setCancelTarget(type)}
                        onReactivate={(type) => setReactivateTarget(type)}
                        onPause={(type) => setPauseTarget(type)}
                        onResume={(type) => setResumeTarget(type)}
                        isLoading={loading}
                        t={t}
                    />
                </YStack>
            </XStack>

            <SubscriptionBillingSection
                loading={loading}
                createPortalSession={createPortalSession}
                createSetupIntent={createSetupIntent}
                getInvoices={getInvoices}
                onTriggerRefresh={triggerRefresh}
            />

            <Card backgroundColor="$content1" borderRadius="$7" padding="$4" borderWidth={1} borderColor="$borderColor">
                <Tabs
                    value={technicalTab}
                    onValueChange={setTechnicalTab}
                    orientation="horizontal"
                    flexDirection="column"
                    width="100%"
                >
                    <Tabs.List
                        disablePassBorderRadius="bottom"
                        backgroundColor="$content2"
                        borderRadius="$6"
                        padding="$2"
                        borderWidth={1}
                        borderColor="$borderColor"
                    >
                        <Tabs.Tab
                            flex={1}
                            value="notifications"
                            disabled={notificationsTabDisabled}
                            opacity={notificationsTabDisabled ? 0.55 : 1}
                            borderRadius="$4"
                            backgroundColor={notificationsTabActive ? '$accent10' : 'transparent'}
                            borderWidth={notificationsTabActive ? 1 : 0}
                            borderColor={notificationsTabActive ? '$accent11' : 'transparent'}
                            pressStyle={{
                                backgroundColor: notificationsTabActive ? '$accent9' : '$accent2',
                                scale: 0.98
                            }}
                        >
                            <XStack alignItems="center" gap="$2">
                                <Bell
                                    size={16}
                                    color={notificationsTabDisabled ? '#9ca3af' : (notificationsTabActive ? 'white' : '$accent7')}
                                />
                                <Text
                                    fontSize={13}
                                    fontWeight="700"
                                    color={notificationsTabDisabled ? '$color' : (notificationsTabActive ? 'white' : '$accent7')}
                                >
                                    {t('subscription.technicalTabNotifications')}
                                </Text>
                            </XStack>
                        </Tabs.Tab>
                        <Tabs.Tab
                            flex={1}
                            value="apiKeys"
                            disabled={apiKeysTabDisabled}
                            opacity={apiKeysTabDisabled ? 0.55 : 1}
                            borderRadius="$4"
                            backgroundColor={apiKeysTabActive ? '$accent10' : 'transparent'}
                            borderWidth={apiKeysTabActive ? 1 : 0}
                            borderColor={apiKeysTabActive ? '$accent11' : 'transparent'}
                            pressStyle={{
                                backgroundColor: apiKeysTabActive ? '$accent9' : '$accent2',
                                scale: 0.98
                            }}
                        >
                            <XStack alignItems="center" gap="$2">
                                <Code
                                    size={16}
                                    color={apiKeysTabDisabled ? '#9ca3af' : (apiKeysTabActive ? 'white' : '$accent7')}
                                />
                                <Text
                                    fontSize={13}
                                    fontWeight="700"
                                    color={apiKeysTabDisabled ? '$color' : (apiKeysTabActive ? 'white' : '$accent7')}
                                >
                                    {t('subscription.technicalTabApiKeys')}
                                </Text>
                            </XStack>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Content value="notifications" padding="$0" marginTop="$4">
                        {hasNotificationsAccess ? (
                            <MyNotificationsTab />
                        ) : (
                            <Card
                                backgroundColor="$content2"
                                borderRadius="$6"
                                padding="$4"
                                borderWidth={1}
                                borderColor="$borderColor"
                            >
                                <YStack gap="$2.5">
                                    <H5 color="$accent7" fontFamily="$oswald">
                                        {t('subscription.technicalTabNotifications')}
                                    </H5>
                                    <Text color="$color" opacity={0.78}>
                                        {t('subscription.notificationsRequiresPlan')}
                                    </Text>
                                </YStack>
                            </Card>
                        )}
                    </Tabs.Content>

                    <Tabs.Content value="apiKeys" padding="$0" marginTop="$4">
                        <Card backgroundColor="$content2" borderRadius="$6" padding="$4" borderWidth={1} borderColor="$borderColor">
                            <YStack gap="$4">
                                <XStack alignItems="center" justifyContent="space-between" gap="$3" flexWrap="wrap">
                                    <H5 color="$accent7" fontFamily="$oswald">
                                        {t('subscription.apiKeyTitle')}
                                    </H5>
                                    <XStack gap="$2" flexWrap="wrap">
                                        <SecondaryButton size="$3" onPress={handleOpenApiDocs}>
                                            <XStack alignItems="center" gap="$2">
                                                <ExternalLink size={14} color="$accent7" />
                                                <SecondaryButtonText>{t('subscription.viewDocs')}</SecondaryButtonText>
                                            </XStack>
                                        </SecondaryButton>
                                    </XStack>
                                </XStack>

                                <Text color="$color" opacity={0.82}>
                                    {hasApiAccess
                                        ? t('subscription.apiKeyDescription')
                                        : t('subscription.apiKeyRequiresPlan')}
                                </Text>

                                {hasApiAccess && (
                                    <YStack gap="$3">
                                        <XStack alignItems="center" gap="$3" flexWrap="wrap">
                                            <Input
                                                flex={1}
                                                minWidth={220}
                                                value={apiKeyName}
                                                onChangeText={setApiKeyName}
                                                placeholder={t('subscription.apiKeyNamePlaceholder')}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                width="100%"
                                            />
                                            <PrimaryButton
                                                size="$4"
                                                onPress={handleCreateApiKey}
                                                disabled={isCreatingApiKey || revokingApiKeyId !== null}
                                            >
                                                <XStack alignItems="center" gap="$2">
                                                    {isCreatingApiKey ? (
                                                        <Spinner size="small" color="white" />
                                                    ) : (
                                                        <Key size={16} color="white" />
                                                    )}
                                                    <PrimaryButtonText>
                                                        {isCreatingApiKey
                                                            ? t('subscription.apiKeyCreating')
                                                            : t('subscription.apiKeyCreate')}
                                                    </PrimaryButtonText>
                                                </XStack>
                                            </PrimaryButton>
                                        </XStack>

                                        {newApiKey && (
                                            <Card
                                                backgroundColor="$content1"
                                                borderRadius="$5"
                                                padding="$3.5"
                                                borderWidth={1}
                                                borderColor="$borderColor"
                                            >
                                                <YStack gap="$2.5">
                                                    <XStack alignItems="center" gap="$2">
                                                        <Key size={14} color="$accent7" />
                                                        <Text color="$accent7" fontWeight="700">
                                                            {t('subscription.apiKeyOneTimeTitle')}
                                                        </Text>
                                                    </XStack>
                                                    <Text color="$color" opacity={0.85}>{t('subscription.apiKeyOneTimeDescription')}</Text>
                                                    <XStack alignItems="center" gap="$2">
                                                        <Input
                                                            flex={1}
                                                            value={newApiKey.key}
                                                            autoCapitalize="none"
                                                            autoCorrect={false}
                                                            showSoftInputOnFocus={false}
                                                            selectTextOnFocus
                                                            onPressIn={() => void handleCopyApiKey()}
                                                            cursor={isWeb ? 'pointer' : undefined}
                                                            backgroundColor="$content2"
                                                            borderColor="$borderColor"
                                                            color="$color"
                                                            opacity={1}
                                                        />
                                                        <SecondaryButton
                                                            size="$3"
                                                            onPress={() => void handleCopyApiKey()}
                                                            cursor={isWeb ? 'pointer' : undefined}
                                                        >
                                                            <Copy size={14} color="$accent7" />
                                                        </SecondaryButton>
                                                    </XStack>
                                                    <XStack justifyContent="space-between" alignItems="center" gap="$2" flexWrap="wrap">
                                                        <Text fontSize={12} color="$color" opacity={0.7}>
                                                            {t('subscription.apiKeyPrefixValue', {prefix: newApiKey.prefix})}
                                                        </Text>
                                                        <SecondaryButton size="$3" onPress={() => setNewApiKey(null)}>
                                                            <SecondaryButtonText>{t('common.close')}</SecondaryButtonText>
                                                        </SecondaryButton>
                                                    </XStack>
                                                </YStack>
                                            </Card>
                                        )}

                                        {apiKeysLoading ? (
                                            <XStack alignItems="center" gap="$2.5">
                                                <Spinner size="small" color="$accent7" />
                                                <Text color="$color" opacity={0.8}>
                                                    {t('common.loading')}
                                                </Text>
                                            </XStack>
                                        ) : apiKeys.length === 0 ? (
                                            <Text color="$color" opacity={0.7}>
                                                {t('subscription.apiKeyNoKeys')}
                                            </Text>
                                        ) : (
                                            <YStack gap="$2.5">
                                                {apiKeys.map((apiKey) => (
                                                    <Card
                                                        key={apiKey.id}
                                                        backgroundColor="$content1"
                                                        borderRadius="$5"
                                                        padding="$3.5"
                                                        borderWidth={1}
                                                        borderColor="$borderColor"
                                                    >
                                                        <XStack alignItems="center" justifyContent="space-between" gap="$3" flexWrap="wrap">
                                                            <YStack flex={1} minWidth={220} gap="$1">
                                                                <XStack alignItems="center" gap="$2">
                                                                    <Text color="$accent7" fontSize={15} fontWeight="700">
                                                                        {apiKey.prefix}
                                                                    </Text>
                                                                    {apiKey.name ? (
                                                                        <Text color="$color" fontSize={13} opacity={0.85}>
                                                                            {apiKey.name}
                                                                        </Text>
                                                                    ) : (
                                                                        <Text color="$color" fontSize={13} opacity={0.65}>
                                                                            {t('subscription.apiKeyUnnamed')}
                                                                        </Text>
                                                                    )}
                                                                </XStack>
                                                                <XStack alignItems="center" gap="$2">
                                                                    {apiKey.isActive ? (
                                                                        <Check size={14} color="#22c55e" />
                                                                    ) : (
                                                                        <Pause size={14} color="#9ca3af" />
                                                                    )}
                                                                    <Text color="$color" fontSize={12} opacity={0.75}>
                                                                        {apiKey.isActive
                                                                            ? t('subscription.status.active')
                                                                            : t('subscription.status.inactive')}
                                                                    </Text>
                                                                </XStack>
                                                                <Text color="$color" fontSize={12} opacity={0.65}>
                                                                    {t('subscription.apiKeyCreatedAt', {date: formatDate(apiKey.createdAt)})}
                                                                </Text>
                                                                <Text color="$color" fontSize={12} opacity={0.65}>
                                                                    {apiKey.lastUsedAt
                                                                        ? t('subscription.apiKeyLastUsedAt', {date: formatDate(apiKey.lastUsedAt)})
                                                                        : t('subscription.apiKeyNeverUsed')}
                                                                </Text>
                                                            </YStack>
                                                            <SecondaryButton
                                                                size="$3"
                                                                borderColor="$red10"
                                                                hoverStyle={{borderColor: "$red11"}}
                                                                pressStyle={{scale: 0.98, borderColor: "$red11"}}
                                                                onPress={() => handleRevokeApiKey(apiKey.id)}
                                                                disabled={revokingApiKeyId !== null || isCreatingApiKey}
                                                            >
                                                                <XStack alignItems="center" gap="$2">
                                                                    {revokingApiKeyId === apiKey.id ? (
                                                                        <Spinner size="small" color="$red10" />
                                                                    ) : (
                                                                        <Trash2 size={14} color="$red10" />
                                                                    )}
                                                                    <SecondaryButtonText color="$red10">
                                                                        {revokingApiKeyId === apiKey.id
                                                                            ? t('subscription.apiKeyRevoking')
                                                                            : t('subscription.apiKeyRevoke')}
                                                                    </SecondaryButtonText>
                                                                </XStack>
                                                            </SecondaryButton>
                                                        </XStack>
                                                    </Card>
                                                ))}
                                            </YStack>
                                        )}
                                    </YStack>
                                )}
                            </YStack>
                        </Card>
                    </Tabs.Content>
                </Tabs>
            </Card>

            {/* Cancel Confirmation Dialog */}
            <Dialog modal open={cancelTarget !== null} onOpenChange={(open) => {
                if (!open) setCancelTarget(null);
            }}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{opacity: 0}}
                        exitStyle={{opacity: 0}}
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
                        enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
                        exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
                        gap="$4"
                        backgroundColor="$content1"
                        maxWidth={400}
                        width="90%"
                    >
                        <Dialog.Title fontSize={20} fontWeight="700" color="$red10">
                            {t('subscription.cancelDialogTitle')}
                        </Dialog.Title>
                        <Dialog.Description color="$color">
                            {t('subscription.cancelDialogMessage')}
                        </Dialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <Dialog.Close asChild>
                                <SecondaryButton size="$4">
                                    <SecondaryButtonText>
                                        {t('common.cancel')}
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
                                pressStyle={{
                                    backgroundColor: "$red8",
                                    scale: 0.98,
                                    borderColor: "$red10",
                                    shadowOpacity: 0
                                }}
                                focusStyle={{borderColor: "$red11", shadowOpacity: 0}}
                                onPress={handleCancel}
                                disabled={isCanceling}
                            >
                                <XStack alignItems="center" gap="$2">
                                    {isCanceling && <Spinner color="white"/>}
                                    <PrimaryButtonText fontWeight="600">
                                        {isCanceling ? t('subscription.canceling') : t('subscription.confirmCancel')}
                                    </PrimaryButtonText>
                                </XStack>
                            </PrimaryButton>
                        </XStack>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>

            {/* Reactivate Confirmation Dialog */}
            <Dialog modal open={reactivateTarget !== null} onOpenChange={(open) => {
                if (!open) setReactivateTarget(null);
            }}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        key="overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{opacity: 0}}
                        exitStyle={{opacity: 0}}
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
                        enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
                        exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
                        gap="$4"
                        backgroundColor="$content1"
                        maxWidth={400}
                        width="90%"
                    >
                        <Dialog.Title fontSize={20} fontWeight="700" color="$accent7">
                            {t('subscription.reactivateDialogTitle')}
                        </Dialog.Title>
                        <Dialog.Description color="$color">
                            {t('subscription.reactivateDialogMessage')}
                        </Dialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <Dialog.Close asChild>
                                <SecondaryButton size="$4">
                                    <SecondaryButtonText>
                                        {t('common.cancel')}
                                    </SecondaryButtonText>
                                </SecondaryButton>
                            </Dialog.Close>
                            <PrimaryButton
                                size="$4"
                                onPress={handleReactivateConfirm}
                                disabled={isReactivating}
                            >
                                <XStack alignItems="center" gap="$2">
                                    {isReactivating && <Spinner color="white"/>}
                                    <PrimaryButtonText fontWeight="600">
                                        {isReactivating ? t('subscription.reactivating') : t('subscription.confirmReactivate')}
                                    </PrimaryButtonText>
                                </XStack>
                            </PrimaryButton>
                        </XStack>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>

            {/* Pause Confirmation Dialog */}
            <Dialog modal open={pauseTarget !== null} onOpenChange={(open) => {
                if (!open) setPauseTarget(null);
            }}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        key="pause-overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{opacity: 0}}
                        exitStyle={{opacity: 0}}
                    />
                    <Dialog.Content
                        bordered
                        elevate
                        key="pause-content"
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
                        exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
                        gap="$4"
                        backgroundColor="$content1"
                        maxWidth={400}
                        width="90%"
                    >
                        <Dialog.Title fontSize={20} fontWeight="700" color="$accent7">
                            {t('subscription.pauseDialogTitle')}
                        </Dialog.Title>
                        <Dialog.Description color="$color">
                            {t('subscription.pauseDialogMessage')}
                        </Dialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <Dialog.Close asChild>
                                <SecondaryButton size="$4">
                                    <SecondaryButtonText>
                                        {t('common.cancel')}
                                    </SecondaryButtonText>
                                </SecondaryButton>
                            </Dialog.Close>
                            <PrimaryButton
                                size="$4"
                                onPress={handlePause}
                                disabled={isPausing}
                            >
                                <XStack alignItems="center" gap="$2">
                                    {isPausing && <Spinner color="white"/>}
                                    <PrimaryButtonText fontWeight="600">
                                        {isPausing ? t('subscription.pausing') : t('subscription.confirmPause')}
                                    </PrimaryButtonText>
                                </XStack>
                            </PrimaryButton>
                        </XStack>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>

            {/* Resume Confirmation Dialog */}
            <Dialog modal open={resumeTarget !== null} onOpenChange={(open) => {
                if (!open) setResumeTarget(null);
            }}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        key="resume-overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{opacity: 0}}
                        exitStyle={{opacity: 0}}
                    />
                    <Dialog.Content
                        bordered
                        elevate
                        key="resume-content"
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                        enterStyle={{x: 0, y: -20, opacity: 0, scale: 0.9}}
                        exitStyle={{x: 0, y: 10, opacity: 0, scale: 0.95}}
                        gap="$4"
                        backgroundColor="$content1"
                        maxWidth={400}
                        width="90%"
                    >
                        <Dialog.Title fontSize={20} fontWeight="700" color="$accent7">
                            {t('subscription.resumeDialogTitle')}
                        </Dialog.Title>
                        <Dialog.Description color="$color">
                            {t('subscription.resumeDialogMessage')}
                        </Dialog.Description>

                        <XStack gap="$3" justifyContent="flex-end">
                            <Dialog.Close asChild>
                                <SecondaryButton size="$4">
                                    <SecondaryButtonText>
                                        {t('common.cancel')}
                                    </SecondaryButtonText>
                                </SecondaryButton>
                            </Dialog.Close>
                            <PrimaryButton
                                size="$4"
                                onPress={handleResume}
                                disabled={isResuming}
                            >
                                <XStack alignItems="center" gap="$2">
                                    {isResuming && <Spinner color="white"/>}
                                    <PrimaryButtonText fontWeight="600">
                                        {isResuming ? t('subscription.resuming') : t('subscription.confirmResume')}
                                    </PrimaryButtonText>
                                </XStack>
                            </PrimaryButton>
                        </XStack>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>

            {/* Web Payment Dialog */}
            <WebPaymentDialog
                params={paymentDialogParams}
                onClose={closePaymentDialog}
                onSuccess={handlePaymentSuccess}
            />
        </YStack>
    );
};

interface PlanCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    price: string;
    features: string[];
    subscription: SubscriptionInfo | null;
    subscriptionType: SubscriptionType;
    onSubscribe: (type: SubscriptionType) => void;
    onCancel: (type: SubscriptionType) => void;
    onReactivate: (type: SubscriptionType) => void;
    onPause: (type: SubscriptionType) => void;
    onResume: (type: SubscriptionType) => void;
    isLoading: boolean;
    t: (key: string, options?: Record<string, string>) => string;
}

const PlanCard: React.FC<PlanCardProps> = ({
                                               icon,
                                               title,
                                               description,
                                               price,
                                               features,
                                               subscription,
                                               subscriptionType,
                                               onSubscribe,
                                               onCancel,
                                               onReactivate,
                                               onPause,
                                               onResume,
                                               isLoading,
                                           t,
                                       }) => {
    // Backend returns subscription objects with nullable status. Treat null as "not subscribed yet".
    const status = subscription?.status ?? null;
    const active = status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.TRIALING;
    const paused = status === SubscriptionStatus.PAUSED;
    const trialing = status === SubscriptionStatus.TRIALING;
    const canStartTrial = status === null;
    const pendingCancel = active && (subscription?.cancelAtPeriodEnd ?? false);
    const showCancelButton = active && !pendingCancel;
    const showPauseButton = active && !pendingCancel && status !== SubscriptionStatus.TRIALING;

    const effectiveStatus = pendingCancel ? SubscriptionStatus.CANCELED : status;
    const statusColor = getStatusColor(effectiveStatus);
    const statusLabel = getStatusLabel(effectiveStatus, t);
    const cardBorderColor = active ? '$accent7' : paused ? '$purple7' : pendingCancel ? '$orange7' : '$borderColor';
    const cardBackground = active ? '$content2' : '$content1';

    return (
        <Card
            backgroundColor={cardBackground}
            borderRadius="$7"
            padding="$5"
            borderWidth={active ? 2 : 1}
            borderColor={cardBorderColor}
        >
            <YStack gap="$4">
                {/* Header */}
                <XStack alignItems="center" gap="$3">
                    <View
                        width={40}
                        height={40}
                        backgroundColor={active ? '$accent2' : '$content3'}
                        borderRadius="$8"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {icon}
                    </View>
                    <YStack flex={1}>
                        <H5 color="$accent7" fontFamily="$oswald">{title}</H5>
                    </YStack>
                    {/* Status Badge */}
                    <XStack alignItems="center" gap="$1.5" backgroundColor="$content2" paddingHorizontal="$2.5"
                            paddingVertical="$1.5" borderRadius="$10">
                        <View width={8} height={8} borderRadius={4} backgroundColor={statusColor}/>
                        <Text fontSize={12} fontWeight="600" color="$color">
                            {statusLabel}
                        </Text>
                    </XStack>
                </XStack>

                <Separator/>

                {/* Description */}
                <Text fontSize={14} color="$color" opacity={0.8}>
                    {description}
                </Text>

                {/* Price / Trial */}
                {canStartTrial ? (
                    <YStack gap="$1">
                        <Text fontSize={22} fontWeight="700" color="$blue10" fontFamily="$oswald">
                            {t('subscription.freeTrial')}
                        </Text>
                        <Text fontSize={13} color="$color" opacity={0.75}>
                            {t('subscription.priceMonth', {price})}
                        </Text>
                    </YStack>
                ) : trialing ? (
                    <YStack gap="$1">
                        <Text fontSize={22} fontWeight="700" color="$blue10" fontFamily="$oswald">
                            {t('subscription.freeTrial')}
                        </Text>
                        {subscription?.trialEnd && (
                            <Text fontSize={13} color="$blue10" opacity={0.85}>
                                {t('subscription.trialEnds', {date: formatDate(subscription.trialEnd)})}
                            </Text>
                        )}
                    </YStack>
                ) : (
                    <Text fontSize={22} fontWeight="700" color="$accent7" fontFamily="$oswald">
                        {t('subscription.priceMonth', {price})}
                    </Text>
                )}

                {/* Features */}
                <YStack gap="$2">
                    {features.map((feature, index) => (
                        <XStack key={index} gap="$2" alignItems="flex-start">
                            <Check size={16} color="$accent7" marginTop={2}/>
                            <Text flex={1} fontSize={14} color="$color" opacity={0.9}>
                                {feature}
                            </Text>
                        </XStack>
                    ))}
                </YStack>

                {/* Period / Trial Info */}
                {subscription && (
                    <YStack gap="$1">
                        {status === SubscriptionStatus.ACTIVE && subscription.currentPeriodEnd && (
                            <Text fontSize={13} color={pendingCancel ? "$red10" : "$color"}
                                  opacity={pendingCancel ? 1 : 0.7}>
                                {pendingCancel
                                    ? t('subscription.canceledInfo', {date: formatDate(subscription.currentPeriodEnd)})
                                    : t('subscription.currentPeriodEnd', {date: formatDate(subscription.currentPeriodEnd)})}
                            </Text>
                        )}
                        {status === SubscriptionStatus.CANCELED && subscription.currentPeriodEnd && (
                            <Text fontSize={13} color="$red10">
                                {t('subscription.canceledInfo', {date: formatDate(subscription.currentPeriodEnd)})}
                            </Text>
                        )}
                        {status === SubscriptionStatus.PAUSED && (
                            <Text fontSize={13} color="#a855f7">
                                {t('subscription.pausedInfo')}
                            </Text>
                        )}
                    </YStack>
                )}

                {/* Pause/Resume Buttons */}
                {showPauseButton && (
                    <SecondaryButton
                        size="$4"
                        onPress={() => onPause(subscriptionType)}
                        disabled={isLoading}
                        icon={<Pause size={16} color="$color"/>}
                    >
                        <SecondaryButtonText>
                            {t('subscription.pauseSubscription')}
                        </SecondaryButtonText>
                    </SecondaryButton>
                )}

                {paused && (
                    <PrimaryButton
                        size="$4"
                        onPress={() => onResume(subscriptionType)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <XStack alignItems="center" gap="$2" justifyContent="center">
                                <Spinner size="small" color="white"/>
                                <PrimaryButtonText>{t('common.loading')}</PrimaryButtonText>
                            </XStack>
                        ) : (
                            <XStack alignItems="center" gap="$2">
                                <Play size={16} color="white"/>
                                <PrimaryButtonText>{t('subscription.resumeSubscription')}</PrimaryButtonText>
                            </XStack>
                        )}
                    </PrimaryButton>
                )}

                {/* Action Button */}
                {showCancelButton ? (
                    <SecondaryButton
                        size="$4"
                        borderColor="$red10"
                        hoverStyle={{borderColor: "$red11"}}
                        pressStyle={{scale: 0.98, borderColor: "$red11"}}
                        onPress={() => onCancel(subscriptionType)}
                        disabled={isLoading}
                    >
                        <SecondaryButtonText color="$red10" fontWeight="600">
                            {t('subscription.cancelSubscription')}
                        </SecondaryButtonText>
                    </SecondaryButton>
                ) : pendingCancel ? (
                    <PrimaryButton
                        size="$4"
                        onPress={() => onReactivate(subscriptionType)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <XStack alignItems="center" gap="$2" justifyContent="center">
                                <Spinner size="small" color="white"/>
                                <PrimaryButtonText>{t('common.loading')}</PrimaryButtonText>
                            </XStack>
                        ) : (
                            <PrimaryButtonText>{t('subscription.resubscribe')}</PrimaryButtonText>
                        )}
                    </PrimaryButton>
                ) : (
                    <PrimaryButton
                        size="$4"
                        onPress={() => onSubscribe(subscriptionType)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <XStack alignItems="center" gap="$2" justifyContent="center">
                                <Spinner size="small" color="white"/>
                                <PrimaryButtonText>{t('common.loading')}</PrimaryButtonText>
                            </XStack>
                        ) : (
                            <PrimaryButtonText>
                                {canStartTrial ? t('subscription.startFreeTrial') : t('subscription.subscribe')}
                            </PrimaryButtonText>
                        )}
                    </PrimaryButton>
                )}
            </YStack>
        </Card>
    );
};
