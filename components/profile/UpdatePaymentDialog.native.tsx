import React, {useState, useCallback} from 'react';
import {
    Dialog,
    XStack,
    Text,
    Spinner,
} from 'tamagui';
import {useColorScheme} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {useTranslation} from '@/hooks/ui';
import {useSubscription} from '@/hooks/data';
import {SetupIntentResponse} from '@/api/models/subscription';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

interface UpdatePaymentDialogProps {
    clientSecret: SetupIntentResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function UpdatePaymentDialog({clientSecret, onClose, onSuccess}: UpdatePaymentDialogProps) {
    const {t} = useTranslation();
    const colorScheme = useColorScheme();
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const {updatePaymentMethod} = useSubscription();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const extractSetupIntentId = useCallback((secret: string) => {
        const separator = '_secret_';
        const index = secret.indexOf(separator);

        if (index <= 0) return null;
        return secret.slice(0, index);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!clientSecret) return;

        setProcessing(true);
        setError(null);

        const initResult = await initPaymentSheet({
            merchantDisplayName: 'MARLIN',
            customerId: clientSecret.customerId,
            customerEphemeralKeySecret: clientSecret.ephemeralKey,
            setupIntentClientSecret: clientSecret.clientSecret,
            returnURL: 'marlin://',
            allowsDelayedPaymentMethods: true,
            style: colorScheme === 'dark' ? 'alwaysDark' : 'alwaysLight',
        });

        if (initResult.error) {
            setError(initResult.error.message ?? t('subscription.updatePaymentError'));
            setProcessing(false);
            return;
        }

        const {error: presentError} = await presentPaymentSheet();

        if (presentError) {
            if (presentError.code !== 'Canceled') {
                setError(presentError.message ?? t('subscription.updatePaymentError'));
            }
            setProcessing(false);
            return;
        }

        const setupIntentId = extractSetupIntentId(clientSecret.clientSecret);
        if (!setupIntentId) {
            setError(t('subscription.updatePaymentError'));
            setProcessing(false);
            return;
        }

        await updatePaymentMethod(
            {setupIntentId},
            () => {
                setProcessing(false);
                onSuccess();
            },
            (appError) => {
                setError(t(appError.onGetMessage()));
                setProcessing(false);
            }
        );
    }, [
        clientSecret,
        colorScheme,
        extractSetupIntentId,
        initPaymentSheet,
        onSuccess,
        presentPaymentSheet,
        t,
        updatePaymentMethod
    ]);

    if (!clientSecret) return null;

    return (
        <Dialog modal open={clientSecret !== null} onOpenChange={(open) => {
            if (!open) {
                setError(null);
                onClose();
            }
        }}>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="update-payment-overlay"
                    animation="quick"
                    opacity={0.5}
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                />
                <Dialog.Content
                    bordered
                    elevate
                    key="update-payment-content"
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
                    padding="$5"
                >
                    <Dialog.Title fontSize={20} fontWeight="700" color="$accent7">
                        {t('subscription.updatePaymentTitle')}
                    </Dialog.Title>
                    <Dialog.Description color="$color" opacity={0.8}>
                        {t('subscription.updatePaymentDescription')}
                    </Dialog.Description>

                    {error && (
                        <Text color="$red10" fontSize={13}>
                            {error}
                        </Text>
                    )}

                    <XStack gap="$3" justifyContent="flex-end">
                        <Dialog.Close asChild>
                            <SecondaryButton size="$4" disabled={processing}>
                                <SecondaryButtonText>
                                    {t('common.cancel')}
                                </SecondaryButtonText>
                            </SecondaryButton>
                        </Dialog.Close>
                        <PrimaryButton
                            size="$4"
                            onPress={handleSubmit}
                            disabled={processing}
                        >
                            {processing ? (
                                <XStack alignItems="center" gap="$2">
                                    <Spinner size="small" color="white"/>
                                    <PrimaryButtonText>{t('common.loading')}</PrimaryButtonText>
                                </XStack>
                            ) : (
                                <PrimaryButtonText>{t('subscription.updatePaymentConfirm')}</PrimaryButtonText>
                            )}
                        </PrimaryButton>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
