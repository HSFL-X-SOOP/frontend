import React, {useState, useCallback} from 'react';
import {
    Dialog,
    YStack,
    XStack,
    Text,
    Spinner,
} from 'tamagui';
import {Elements, PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {PaymentSheetResponse} from '@/api/models/subscription';
import {useTranslation} from '@/hooks/ui';
import {useThemeContext} from '@/context/ThemeSwitch';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(publishableKey: string) {
    if (!stripePromise) {
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
}

interface PaymentFormProps {
    params: PaymentSheetResponse;
    onClose: () => void;
    onSuccess: () => void;
}

function PaymentForm({params, onClose, onSuccess}: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const {t} = useTranslation();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        let result;

        if (params.paymentIntent) {
            result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: 'if_required',
            });
        } else if (params.setupIntent) {
            result = await stripe.confirmSetup({
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: 'if_required',
            });
        } else {
            setError('No payment or setup intent provided');
            setProcessing(false);
            return;
        }

        if (result.error) {
            setError(result.error.message ?? t('subscription.paymentError'));
            setProcessing(false);
        } else {
            onSuccess();
        }
    }, [stripe, elements, params, onSuccess, t]);

    return (
        <YStack gap="$4">
            <PaymentElement />

            {error && (
                <Text color="$red10" fontSize={13}>
                    {error}
                </Text>
            )}

            <XStack gap="$3" justifyContent="flex-end">
                <SecondaryButton size="$4" onPress={onClose} disabled={processing}>
                    <SecondaryButtonText>
                        {t('common.cancel')}
                    </SecondaryButtonText>
                </SecondaryButton>
                <PrimaryButton
                    size="$4"
                    onPress={handleSubmit}
                    disabled={processing || !stripe || !elements}
                >
                    {processing ? (
                        <XStack alignItems="center" gap="$2">
                            <Spinner size="small" color="white" />
                            <PrimaryButtonText>{t('common.loading')}</PrimaryButtonText>
                        </XStack>
                    ) : (
                        <PrimaryButtonText>{t('subscription.subscribe')}</PrimaryButtonText>
                    )}
                </PrimaryButton>
            </XStack>
        </YStack>
    );
}

interface WebPaymentDialogProps {
    params: PaymentSheetResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function WebPaymentDialog({params, onClose, onSuccess}: WebPaymentDialogProps) {
    const {t} = useTranslation();
    const {isDark} = useThemeContext();

    if (!params) return null;

    const clientSecret = params.paymentIntent ?? params.setupIntent;
    if (!clientSecret) return null;

    const stripe = getStripe(params.publishableKey);

    return (
        <Dialog modal open={params !== null} onOpenChange={(open) => {
            if (!open) onClose();
        }}>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="payment-overlay"
                    animation="quick"
                    opacity={0.5}
                    enterStyle={{opacity: 0}}
                    exitStyle={{opacity: 0}}
                />
                <Dialog.Content
                    bordered
                    elevate
                    key="payment-content"
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
                    maxWidth={500}
                    width="90%"
                    padding="$5"
                >
                    <Dialog.Title fontSize={20} fontWeight="700" color="$accent7">
                        {t('subscription.paymentTitle')}
                    </Dialog.Title>
                    <Dialog.Description color="$color" opacity={0.8}>
                        {t('subscription.paymentDescription')}
                    </Dialog.Description>

                    <Elements
                        stripe={stripe}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: isDark ? 'night' : 'stripe',
                            },
                        }}
                    >
                        <PaymentForm
                            params={params}
                            onClose={onClose}
                            onSuccess={onSuccess}
                        />
                    </Elements>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
