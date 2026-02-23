import React, {useCallback, useState} from 'react';
import {Platform, ScrollView} from 'react-native';
import {
    Card,
    Dialog,
    Separator,
    Spinner,
    Text,
    XStack,
    YStack,
} from 'tamagui';
import {CreditCard, FileText} from '@tamagui/lucide-icons';
import * as WebBrowser from 'expo-web-browser';

import {Invoice, PortalRequest, PortalResponse, SetupIntentResponse} from '@/api/models/subscription';
import {UI_CONSTANTS} from '@/config/constants';
import {useToast, useTranslation} from '@/hooks/ui';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';
import {AppError} from '@/utils/errors';
import {UpdatePaymentDialog} from '@/components/profile/UpdatePaymentDialog';

interface SubscriptionBillingSectionProps {
    loading: boolean;
    createPortalSession: (
        body: PortalRequest,
        onSuccess: (data: PortalResponse) => void,
        onError: (error: AppError) => void
    ) => Promise<void>;
    createSetupIntent: (
        onSuccess: (data: SetupIntentResponse) => void,
        onError: (error: AppError) => void
    ) => Promise<void>;
    getInvoices: (
        onSuccess: (data: Invoice[]) => void,
        onError: (error: AppError) => void
    ) => Promise<void>;
    onTriggerRefresh: () => void;
}

function getBaseUrl(): string {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.location.origin;
    }
    return 'marlin://';
}

function formatUnixDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'});
}

function formatInvoiceAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: (currency || 'EUR').toUpperCase(),
    }).format(amount / 100);
}

export const SubscriptionBillingSection: React.FC<SubscriptionBillingSectionProps> = ({
    loading,
    createPortalSession,
    createSetupIntent,
    getInvoices,
    onTriggerRefresh,
}) => {
    const {t} = useTranslation();
    const toast = useToast();
    const isWeb = Platform.OS === 'web';

    const [updatePaymentSecret, setUpdatePaymentSecret] = useState<SetupIntentResponse | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoicesLoading, setInvoicesLoading] = useState(false);
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [openingInvoiceId, setOpeningInvoiceId] = useState<string | null>(null);

    const handleManageBilling = useCallback(async () => {
        const baseUrl = getBaseUrl();
        const returnUrl = isWeb
            ? `${baseUrl}/(profile)/profile`
            : `${baseUrl}subscription-callback`;

        await createPortalSession(
            {returnUrl},
            async (data) => {
                const url = data.portalUrl ?? (data as {url?: string}).url;
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
                    onTriggerRefresh();
                }
            },
            (error) => {
                toast.error(t('subscription.portalError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
    }, [createPortalSession, isWeb, onTriggerRefresh, t, toast]);

    const handleUpdatePaymentMethod = useCallback(async () => {
        await createSetupIntent(
            (data) => {
                setUpdatePaymentSecret(data);
            },
            (error) => {
                toast.error(t('subscription.updatePaymentError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
    }, [createSetupIntent, t, toast]);

    const handleUpdatePaymentSuccess = useCallback(() => {
        setUpdatePaymentSecret(null);
        toast.success(t('subscription.updatePaymentSuccess'), {
            message: t('subscription.updatePaymentSuccessMessage'),
            duration: UI_CONSTANTS.TOAST_DURATION.LONG,
        });
    }, [t, toast]);

    const handleOpenInvoice = useCallback(async (pdfUrl: string) => {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.open(pdfUrl, '_blank');
            return;
        }
        await WebBrowser.openBrowserAsync(pdfUrl);
    }, []);

    const handleOpenInvoices = useCallback(async () => {
        setInvoicesLoading(true);
        await getInvoices(
            (data) => {
                setInvoicesLoading(false);
                const sortedInvoices = [...data].sort((a, b) => b.created - a.created);
                setInvoices(sortedInvoices);

                if (sortedInvoices.length === 0) {
                    toast.info(t('subscription.invoicesButton'), {
                        message: t('subscription.noInvoices'),
                        duration: UI_CONSTANTS.TOAST_DURATION.MEDIUM,
                    });
                    setInvoiceDialogOpen(false);
                    return;
                }

                setInvoiceDialogOpen(true);
            },
            (error) => {
                setInvoicesLoading(false);
                toast.error(t('subscription.statusError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
    }, [getInvoices, t, toast]);

    const handleInvoiceDownload = useCallback(async (invoice: Invoice) => {
        if (!invoice.pdfUrl || openingInvoiceId) {
            return;
        }
        setOpeningInvoiceId(invoice.id);
        try {
            await handleOpenInvoice(invoice.pdfUrl);
        } finally {
            setOpeningInvoiceId(null);
        }
    }, [handleOpenInvoice, openingInvoiceId]);

    const webBillingActionButtons = (
        <>
            <PrimaryButton size="$3" onPress={handleManageBilling} disabled={loading} flexShrink={0}>
                <XStack alignItems="center" gap="$2">
                    <CreditCard size={14} color="white" />
                    <PrimaryButtonText>{t('subscription.manageBilling')}</PrimaryButtonText>
                </XStack>
            </PrimaryButton>
            <SecondaryButton size="$3" onPress={handleUpdatePaymentMethod} disabled={loading} flexShrink={0}>
                <XStack alignItems="center" gap="$2">
                    <CreditCard size={14} color="$accent7" />
                    <SecondaryButtonText>
                        {t('subscription.updatePaymentMethod')}
                    </SecondaryButtonText>
                </XStack>
            </SecondaryButton>
            <SecondaryButton size="$3" onPress={handleOpenInvoices} disabled={loading || invoicesLoading} flexShrink={0}>
                <XStack alignItems="center" gap="$2">
                    {invoicesLoading ? <Spinner size="small" color="$accent7" /> : <FileText size={14} color="$accent7" />}
                    <SecondaryButtonText>{t('subscription.invoicesButton')}</SecondaryButtonText>
                </XStack>
            </SecondaryButton>
        </>
    );

    const nativeBillingActionButtons = (
        <YStack width="100%" gap="$2">
            <PrimaryButton
                size="$2"
                onPress={handleManageBilling}
                disabled={loading}
                width="100%"
                borderRadius={999}
                minHeight={38}
                paddingHorizontal="$3"
                paddingVertical="$2"
                shadowOpacity={0}
                elevation={0}
            >
                <XStack alignItems="center" justifyContent="center" gap="$1.5" width="100%">
                    <CreditCard size={13} color="white" />
                    <PrimaryButtonText fontSize={12} numberOfLines={1}>
                        {t('subscription.manageBilling')}
                    </PrimaryButtonText>
                </XStack>
            </PrimaryButton>

            <XStack
                alignItems="center"
                gap="$1.5"
                padding="$1.5"
                width="100%"
                backgroundColor="$content2"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius={999}
            >
                <SecondaryButton
                    size="$2"
                    onPress={handleUpdatePaymentMethod}
                    disabled={loading}
                    flex={1}
                    minWidth={0}
                    borderRadius={999}
                    minHeight={36}
                    borderWidth={0}
                    backgroundColor="transparent"
                    shadowOpacity={0}
                    elevation={0}
                    pressStyle={{backgroundColor: '$accent2', borderColor: 'transparent', scale: 0.98}}
                >
                    <XStack alignItems="center" justifyContent="center" gap="$1.5" width="100%">
                        <CreditCard size={13} color="$accent7" />
                        <SecondaryButtonText fontSize={11} numberOfLines={1} flexShrink={1}>
                            {t('subscription.updatePaymentMethod')}
                        </SecondaryButtonText>
                    </XStack>
                </SecondaryButton>

                <Separator vertical height={22} borderColor="$borderColor" opacity={0.55} />

                <SecondaryButton
                    size="$2"
                    onPress={handleOpenInvoices}
                    disabled={loading || invoicesLoading}
                    flex={1}
                    minWidth={0}
                    borderRadius={999}
                    minHeight={36}
                    borderWidth={0}
                    backgroundColor="transparent"
                    shadowOpacity={0}
                    elevation={0}
                    pressStyle={{backgroundColor: '$accent2', borderColor: 'transparent', scale: 0.98}}
                >
                    <XStack alignItems="center" justifyContent="center" gap="$1.5" width="100%">
                        {invoicesLoading ? <Spinner size="small" color="$accent7" /> : <FileText size={13} color="$accent7" />}
                        <SecondaryButtonText fontSize={11} numberOfLines={1} flexShrink={1}>
                            {t('subscription.invoicesButton')}
                        </SecondaryButtonText>
                    </XStack>
                </SecondaryButton>
            </XStack>
        </YStack>
    );

    return (
        <>
            <YStack gap="$2" paddingHorizontal="$1">
                <XStack alignItems="center" gap="$2">
                    <CreditCard size={16} color="$accent7" />
                    <Text color="$accent7" fontSize={13} fontWeight="700">
                        {t('subscription.billingActionsTitle')}
                    </Text>
                </XStack>
                {isWeb ? (
                    <XStack alignItems="center" justifyContent="flex-start" gap="$2" flexWrap="wrap">
                        {webBillingActionButtons}
                    </XStack>
                ) : (
                    nativeBillingActionButtons
                )}
            </YStack>

            <Dialog modal open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay
                        key="invoice-overlay"
                        animation="quick"
                        opacity={0.5}
                        enterStyle={{opacity: 0}}
                        exitStyle={{opacity: 0}}
                    />
                    <Dialog.Content
                        bordered
                        elevate
                        key="invoice-content"
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
                        maxWidth={680}
                        width="92%"
                    >
                        <Dialog.Title fontSize={20} fontWeight="700" color="$accent7">
                            {t('subscription.invoicesButton')}
                        </Dialog.Title>
                        <Dialog.Description color="$color">
                            {t('subscription.invoicePickerDescription')}
                        </Dialog.Description>

                        {invoicesLoading ? (
                            <XStack alignItems="center" gap="$2">
                                <Spinner size="small" color="$accent7"/>
                                <Text color="$color" opacity={0.8}>
                                    {t('common.loading')}
                                </Text>
                            </XStack>
                        ) : (
                            <ScrollView style={{maxHeight: 420}} showsVerticalScrollIndicator={false}>
                                <YStack gap="$2.5">
                                    {invoices.map((invoice) => {
                                        const normalizedStatus = (invoice.status || 'open').toLowerCase();
                                        const statusKey = `subscription.invoiceStatus.${normalizedStatus}`;
                                        const translatedStatus = t(statusKey);
                                        const statusLabel = translatedStatus === statusKey ? normalizedStatus : translatedStatus;

                                        return (
                                            <Card
                                                key={invoice.id}
                                                backgroundColor="$content2"
                                                borderRadius="$5"
                                                padding="$3"
                                                borderWidth={1}
                                                borderColor="$borderColor"
                                            >
                                                <XStack alignItems="center" justifyContent="space-between" gap="$3" flexWrap="wrap">
                                                    <YStack gap="$1.5" flex={1} minWidth={220}>
                                                        <Text fontSize={15} fontWeight="700" color="$accent7">
                                                            {formatInvoiceAmount(invoice.amount, invoice.currency)}
                                                        </Text>
                                                        <Text fontSize={12} color="$color" opacity={0.75}>
                                                            {formatUnixDate(invoice.created)}
                                                        </Text>
                                                        <Text fontSize={12} color="$color" opacity={0.65}>
                                                            {statusLabel}
                                                        </Text>
                                                    </YStack>
                                                    <SecondaryButton
                                                        size="$3"
                                                        onPress={() => void handleInvoiceDownload(invoice)}
                                                        disabled={!invoice.pdfUrl || openingInvoiceId !== null}
                                                    >
                                                        <XStack alignItems="center" gap="$2">
                                                            {openingInvoiceId === invoice.id ? (
                                                                <Spinner size="small" color="$accent7"/>
                                                            ) : (
                                                                <FileText size={14} color="$accent7"/>
                                                            )}
                                                            <SecondaryButtonText>
                                                                {invoice.pdfUrl
                                                                    ? t('subscription.invoiceOpen')
                                                                    : t('subscription.invoiceUnavailable')}
                                                            </SecondaryButtonText>
                                                        </XStack>
                                                    </SecondaryButton>
                                                </XStack>
                                            </Card>
                                        );
                                    })}
                                </YStack>
                            </ScrollView>
                        )}

                        <XStack justifyContent="flex-end">
                            <Dialog.Close asChild>
                                <SecondaryButton size="$4">
                                    <SecondaryButtonText>{t('common.close')}</SecondaryButtonText>
                                </SecondaryButton>
                            </Dialog.Close>
                        </XStack>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog>

            <UpdatePaymentDialog
                clientSecret={updatePaymentSecret}
                onClose={() => setUpdatePaymentSecret(null)}
                onSuccess={handleUpdatePaymentSuccess}
            />
        </>
    );
};
