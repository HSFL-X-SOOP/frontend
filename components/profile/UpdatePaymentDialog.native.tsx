import React, {useState, useCallback} from 'react';
import {
    Dialog,
    YStack,
    XStack,
    Text,
    Spinner,
} from 'tamagui';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import {useTranslation} from '@/hooks/ui';
import {useSubscription} from '@/hooks/data';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

interface UpdatePaymentDialogProps {
    clientSecret: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function UpdatePaymentDialog({clientSecret, onClose, onSuccess}: UpdatePaymentDialogProps) {
    const {t} = useTranslation();
    const {confirmSetupIntent} = useStripe();
    const {updatePaymentMethod} = useSubscription();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cardComplete, setCardComplete] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (!clientSecret) return;

        setProcessing(true);
        setError(null);

        const {setupIntent, error: confirmError} = await confirmSetupIntent(clientSecret, {
            paymentMethodType: 'Card',
        });

        if (confirmError) {
            setError(confirmError.message ?? t('subscription.updatePaymentError'));
            setProcessing(false);
            return;
        }

        if (!setupIntent?.paymentMethodId) {
            setError(t('subscription.updatePaymentError'));
            setProcessing(false);
            return;
        }

        await updatePaymentMethod(
            {paymentMethodId: setupIntent.paymentMethodId},
            () => {
                setProcessing(false);
                onSuccess();
            },
            (appError) => {
                setError(t(appError.onGetMessage()));
                setProcessing(false);
            }
        );
    }, [clientSecret, confirmSetupIntent, updatePaymentMethod, onSuccess, t]);

    if (!clientSecret) return null;

    return (
        <Dialog modal open={clientSecret !== null} onOpenChange={(open) => {
            if (!open) {
                setError(null);
                setCardComplete(false);
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

                    <CardField
                        postalCodeEnabled={false}
                        style={{height: 50, marginVertical: 8}}
                        onCardChange={(details) => {
                            setCardComplete(details.complete);
                        }}
                    />

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
                            disabled={processing || !cardComplete}
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
