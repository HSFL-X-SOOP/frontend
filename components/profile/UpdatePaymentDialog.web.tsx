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
import {useTranslation} from '@/hooks/ui';
import {useThemeContext} from '@/context/ThemeSwitch';
import {useSubscription} from '@/hooks/data';
import {ENV} from '@/config/environment';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe() {
    if (!stripePromise) {
        stripePromise = loadStripe(ENV.stripePublishableKey);
    }
    return stripePromise;
}

interface UpdatePaymentFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

function UpdatePaymentForm({onClose, onSuccess}: UpdatePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const {t} = useTranslation();
    const {updatePaymentMethod} = useSubscription();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        const result = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: 'if_required',
        });

        if (result.error) {
            setError(result.error.message ?? t('subscription.updatePaymentError'));
            setProcessing(false);
            return;
        }

        const paymentMethodId = result.setupIntent?.payment_method as string | undefined;
        if (!paymentMethodId) {
            setError(t('subscription.updatePaymentError'));
            setProcessing(false);
            return;
        }

        await updatePaymentMethod(
            {paymentMethodId},
            () => {
                setProcessing(false);
                onSuccess();
            },
            (appError) => {
                setError(t(appError.onGetMessage()));
                setProcessing(false);
            }
        );
    }, [stripe, elements, updatePaymentMethod, onSuccess, t]);

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
                            <Spinner size="small" color="white"/>
                            <PrimaryButtonText>{t('common.loading')}</PrimaryButtonText>
                        </XStack>
                    ) : (
                        <PrimaryButtonText>{t('subscription.updatePaymentConfirm')}</PrimaryButtonText>
                    )}
                </PrimaryButton>
            </XStack>
        </YStack>
    );
}

interface UpdatePaymentDialogProps {
    clientSecret: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function UpdatePaymentDialog({clientSecret, onClose, onSuccess}: UpdatePaymentDialogProps) {
    const {t} = useTranslation();
    const {isDark} = useThemeContext();

    if (!clientSecret) return null;

    const stripe = getStripe();

    return (
        <Dialog modal open={clientSecret !== null} onOpenChange={(open) => {
            if (!open) onClose();
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
                    maxWidth={500}
                    width="90%"
                    padding="$5"
                >
                    <Dialog.Title fontSize={20} fontWeight="700" color="$accent7">
                        {t('subscription.updatePaymentTitle')}
                    </Dialog.Title>
                    <Dialog.Description color="$color" opacity={0.8}>
                        {t('subscription.updatePaymentDescription')}
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
                        <UpdatePaymentForm
                            onClose={onClose}
                            onSuccess={onSuccess}
                        />
                    </Elements>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
}
