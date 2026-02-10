import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Platform} from 'react-native';
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
} from 'tamagui';
import {Bell, Code, CreditCard, Check, FileText, Download, Pause, Play} from '@tamagui/lucide-icons';
import {useTranslation, useToast} from '@/hooks/ui';
import {useFocusEffect} from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import {useSubscription} from '@/hooks/data';
import {
    SubscriptionType,
    SubscriptionStatus,
    SubscriptionInfo,
    SubscriptionStatusResponse,
    PaymentSheetResponse,
    Invoice,
} from '@/api/models/subscription';
import {useStripePayment} from '@/hooks/useStripePayment';
import {WebPaymentDialog} from '@/components/profile/WebPaymentDialog';
import {UpdatePaymentDialog} from '@/components/profile/UpdatePaymentDialog';
import {StripeProviderWrapper} from '@/components/providers/StripeProviderWrapper';
import {UI_CONSTANTS} from '@/config/constants';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

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

function isSubscriptionPaused(sub: SubscriptionInfo | null): boolean {
    if (!sub) return false;
    return sub.status === SubscriptionStatus.PAUSED;
}

function formatCurrency(amount: number | null | undefined, currency: string): string {
    const value = amount ? amount / 100 : 0;
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: (currency || 'EUR').toUpperCase(),
    }).format(value);
}

function formatUnixDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'});
}

function getBaseUrl(): string {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.location.origin;
    }
    return 'marlin://';
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
    const {presentPayment} = useStripePayment();

    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatusResponse | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [cancelTarget, setCancelTarget] = useState<SubscriptionType | null>(null);
    const [isCanceling, setIsCanceling] = useState(false);
    const [reactivateTarget, setReactivateTarget] = useState<SubscriptionType | null>(null);
    const [isReactivating, setIsReactivating] = useState(false);
    const [paymentDialogParams, setPaymentDialogParams] = useState<PaymentSheetResponse | null>(null);
    const [updatePaymentSecret, setUpdatePaymentSecret] = useState<string | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoicesLoading, setInvoicesLoading] = useState(false);
    const [pauseTarget, setPauseTarget] = useState<SubscriptionType | null>(null);
    const [isPausing, setIsPausing] = useState(false);
    const [resumeTarget, setResumeTarget] = useState<SubscriptionType | null>(null);
    const [isResuming, setIsResuming] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const prevRefreshingRef = useRef(refreshing);

    const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

    useEffect(() => {
        void getStatus(
            (data) => {
                setSubscriptionStatus(data);
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

        setInvoicesLoading(true);
        void getInvoices(
            (data) => {
                setInvoices(data);
                setInvoicesLoading(false);
            },
            () => {
                setInvoicesLoading(false);
            }
        );
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

    const updateLocalSubscription = useCallback((type: SubscriptionType, updater: (sub: SubscriptionInfo) => SubscriptionInfo) => {
        setSubscriptionStatus(prev => {
            if (!prev) return prev;
            const key = type === SubscriptionType.APP_NOTIFICATION ? 'notifications' : 'apiAccess';
            const current = prev[key];
            if (!current) return prev;
            return {...prev, [key]: updater(current)};
        });
    }, []);

    const handleSubscribe = async (type: SubscriptionType) => {
        const isWeb = Platform.OS === 'web';

        await createSubscription(
            {subscriptionType: type},
            async (data) => {
                if (isWeb) {
                    setPaymentDialogParams(data);
                } else {
                    const result = await presentPayment(data);
                    if (result.success) {
                        toast.success(t('subscription.successTitle'), {
                            message: t('subscription.successGenericMessage'),
                            duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                        });
                        setTimeout(() => triggerRefresh(), 1000);
                    } else if (result.error) {
                        toast.error(t('subscription.paymentError'), {
                            message: result.error,
                            duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                        });
                    }
                }
            },
            (error) => {
                toast.error(t('subscription.checkoutError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
    };

    const handlePaymentSuccess = useCallback(() => {
        setPaymentDialogParams(null);
        toast.success(t('subscription.successTitle'), {
            message: t('subscription.successGenericMessage'),
            duration: UI_CONSTANTS.TOAST_DURATION.LONG,
        });
        setTimeout(() => triggerRefresh(), 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggerRefresh]);

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

    const handleManageBilling = async () => {
        const baseUrl = getBaseUrl();
        const isWeb = Platform.OS === 'web';
        const returnUrl = isWeb
            ? `${baseUrl}/(profile)/profile`
            : `${baseUrl}subscription-callback`;

        await createPortalSession(
            {returnUrl},
            async (data) => {
                console.log('Portal response:', JSON.stringify(data));
                const url = data.portalUrl ?? (data as any).url;
                if (!url) {
                    toast.error(t('subscription.portalError'), {
                        message: 'No portal URL returned from server',
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                    });
                    return;
                }
                if (isWeb) {
                    window.location.href = url;
                } else {
                    await WebBrowser.openBrowserAsync(url);
                    triggerRefresh();
                }
            },
            (error) => {
                toast.error(t('subscription.portalError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
    };

    const handleUpdatePaymentMethod = async () => {
        await createSetupIntent(
            (data) => {
                setUpdatePaymentSecret(data.clientSecret);
            },
            (error) => {
                toast.error(t('subscription.updatePaymentError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
    };

    const handleUpdatePaymentSuccess = useCallback(() => {
        setUpdatePaymentSecret(null);
        toast.success(t('subscription.updatePaymentSuccess'), {
            message: t('subscription.updatePaymentSuccessMessage'),
            duration: UI_CONSTANTS.TOAST_DURATION.LONG,
        });
    }, []);

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

    const handleOpenInvoice = (pdfUrl: string) => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.open(pdfUrl, '_blank');
        } else {
            void WebBrowser.openBrowserAsync(pdfUrl);
        }
    };

    if (isInitialLoading) {
        return (
            <YStack alignItems="center" justifyContent="center" padding="$8" gap="$4">
                <Spinner size="large" color="$accent7"/>
                <Text color="$color" opacity={0.7}>{t('common.loading')}</Text>
            </YStack>
        );
    }

    const notificationsSub = subscriptionStatus?.notifications ?? null;
    const apiAccessSub = subscriptionStatus?.apiAccess ?? null;

    return (
        <YStack gap="$4">
            {/* APP_NOTIFICATION Plan Card */}
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

            {/* API_ACCESS Plan Card */}
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

            {/* Billing History */}
            <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
                  borderWidth={1} borderColor="$borderColor">
                <YStack gap="$3">
                    <XStack alignItems="center" gap="$2">
                        <FileText size={18} color="$accent7"/>
                        <H5 color="$accent7" fontFamily="$oswald">{t('subscription.billingHistory')}</H5>
                    </XStack>
                    <Separator/>
                    {invoicesLoading ? (
                        <XStack justifyContent="center" padding="$3">
                            <Spinner size="small" color="$accent7"/>
                        </XStack>
                    ) : invoices.length === 0 ? (
                        <Text fontSize={14} color="$color" opacity={0.6}>
                            {t('subscription.noInvoices')}
                        </Text>
                    ) : (
                        <YStack gap="$2">
                            {invoices.map((invoice) => (
                                <XStack key={invoice.id} alignItems="center" justifyContent="space-between"
                                        paddingVertical="$2" borderBottomWidth={1} borderBottomColor="$borderColor">
                                    <YStack flex={1} gap="$1">
                                        <Text fontSize={14} fontWeight="600" color="$color">
                                            {formatCurrency(invoice.amount, invoice.currency)}
                                        </Text>
                                        <Text fontSize={12} color="$color" opacity={0.6}>
                                            {formatUnixDate(invoice.created)}
                                        </Text>
                                    </YStack>
                                    <XStack alignItems="center" gap="$2">
                                        <XStack
                                            backgroundColor={invoice.status === 'paid' ? '$green2' : '$yellow2'}
                                            paddingHorizontal="$2"
                                            paddingVertical="$1"
                                            borderRadius="$3"
                                        >
                                            <Text fontSize={11} fontWeight="600"
                                                  color={invoice.status === 'paid' ? '$green10' : '$yellow10'}>
                                                {t(`subscription.invoiceStatus.${invoice.status}` as any) || invoice.status}
                                            </Text>
                                        </XStack>
                                        {invoice.pdfUrl && (
                                            <SecondaryButton
                                                size="$2"
                                                circular
                                                onPress={() => handleOpenInvoice(invoice.pdfUrl!)}
                                            >
                                                <Download size={14} color="$accent7"/>
                                            </SecondaryButton>
                                        )}
                                    </XStack>
                                </XStack>
                            ))}
                        </YStack>
                    )}
                </YStack>
            </Card>

            {/* Update Payment Method Button */}
            <SecondaryButton
                size="$4"
                onPress={handleUpdatePaymentMethod}
                disabled={loading}
                icon={<CreditCard size={18} color="$accent7"/>}
            >
                <SecondaryButtonText>
                    {t('subscription.updatePaymentMethod')}
                </SecondaryButtonText>
            </SecondaryButton>

            {/* Manage Billing Button */}
            <SecondaryButton
                size="$4"
                onPress={handleManageBilling}
                disabled={loading}
                icon={<CreditCard size={18} color="$accent7"/>}
            >
                <SecondaryButtonText>
                    {t('subscription.manageBilling')}
                </SecondaryButtonText>
            </SecondaryButton>

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
                onClose={() => setPaymentDialogParams(null)}
                onSuccess={handlePaymentSuccess}
            />

            {/* Update Payment Method Dialog */}
            <UpdatePaymentDialog
                clientSecret={updatePaymentSecret}
                onClose={() => setUpdatePaymentSecret(null)}
                onSuccess={handleUpdatePaymentSuccess}
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
    const active = isSubscriptionActive(subscription);
    const paused = isSubscriptionPaused(subscription);
    const pendingCancel = active && (subscription?.cancelAtPeriodEnd ?? false);
    const showCancelButton = active && !pendingCancel;
    const showPauseButton = active && !pendingCancel && subscription?.status !== SubscriptionStatus.TRIALING;

    const effectiveStatus = pendingCancel ? SubscriptionStatus.CANCELED : (subscription?.status ?? null);
    const statusColor = getStatusColor(effectiveStatus);
    const statusLabel = getStatusLabel(effectiveStatus, t);

    return (
        <Card backgroundColor="$content1" borderRadius="$6" padding="$5"
              borderWidth={1} borderColor="$borderColor">
            <YStack gap="$4">
                {/* Header */}
                <XStack alignItems="center" gap="$3">
                    <View
                        width={40}
                        height={40}
                        backgroundColor="$content2"
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

                {/* Price */}
                <Text fontSize={22} fontWeight="700" color="$accent7" fontFamily="$oswald">
                    {t('subscription.priceMonth', {price})}
                </Text>

                {/* Free Trial Badge */}
                {!subscription && (
                    <XStack alignItems="center" gap="$2" backgroundColor="$blue2" paddingHorizontal="$3"
                            paddingVertical="$2" borderRadius="$4">
                        <Text fontSize={13} fontWeight="600" color="$blue10">
                            {t('subscription.freeTrial')}
                        </Text>
                    </XStack>
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
                        {subscription.status === SubscriptionStatus.TRIALING && subscription.trialEnd && (
                            <Text fontSize={13} color="$blue10">
                                {t('subscription.trialEnds', {date: formatDate(subscription.trialEnd)})}
                            </Text>
                        )}
                        {subscription.status === SubscriptionStatus.ACTIVE && (
                            <Text fontSize={13} color={pendingCancel ? "$red10" : "$color"}
                                  opacity={pendingCancel ? 1 : 0.7}>
                                {pendingCancel
                                    ? t('subscription.canceledInfo', {date: formatDate(subscription.currentPeriodEnd)})
                                    : t('subscription.currentPeriodEnd', {date: formatDate(subscription.currentPeriodEnd)})}
                            </Text>
                        )}
                        {subscription.status === SubscriptionStatus.CANCELED && (
                            <Text fontSize={13} color="$red10">
                                {t('subscription.canceledInfo', {date: formatDate(subscription.currentPeriodEnd)})}
                            </Text>
                        )}
                        {subscription.status === SubscriptionStatus.PAUSED && (
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
                            <PrimaryButtonText>{t('subscription.subscribe')}</PrimaryButtonText>
                        )}
                    </PrimaryButton>
                )}
            </YStack>
        </Card>
    );
};
