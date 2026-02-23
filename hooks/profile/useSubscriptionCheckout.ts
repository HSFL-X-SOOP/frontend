import {useCallback, useState} from 'react';
import {Platform} from 'react-native';

import {CreateSubscriptionRequest, PaymentSheetResponse, SubscriptionType} from '@/api/models/subscription';
import {UI_CONSTANTS} from '@/config/constants';
import {useToast, useTranslation} from '@/hooks/ui';
import {PaymentResult} from '@/hooks/useStripePayment';
import {AppError} from '@/utils/errors';

interface UseSubscriptionCheckoutProps {
    createSubscription: (
        body: CreateSubscriptionRequest,
        onSuccess: (data: PaymentSheetResponse) => void,
        onError: (error: AppError) => void
    ) => Promise<void>;
    presentPayment: (params: PaymentSheetResponse) => Promise<PaymentResult>;
    onTriggerRefresh: () => void;
}

export function useSubscriptionCheckout({
    createSubscription,
    presentPayment,
    onTriggerRefresh,
}: UseSubscriptionCheckoutProps) {
    const {t} = useTranslation();
    const toast = useToast();
    const isWeb = Platform.OS === 'web';

    const [paymentDialogParams, setPaymentDialogParams] = useState<PaymentSheetResponse | null>(null);

    const handleSubscribe = useCallback(async (type: SubscriptionType) => {
        await createSubscription(
            {subscriptionType: type},
            async (data) => {
                if (isWeb) {
                    setPaymentDialogParams(data);
                    return;
                }

                const result = await presentPayment(data);
                if (result.success) {
                    toast.success(t('subscription.successTitle'), {
                        message: t('subscription.successGenericMessage'),
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                    });
                    setTimeout(() => onTriggerRefresh(), 1000);
                    return;
                }

                if (result.error) {
                    toast.error(t('subscription.paymentError'), {
                        message: result.error,
                        duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                    });
                }
            },
            (error) => {
                toast.error(t('subscription.checkoutError'), {
                    message: t(error.onGetMessage()),
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG,
                });
            }
        );
    }, [createSubscription, isWeb, onTriggerRefresh, presentPayment, t, toast]);

    const handlePaymentSuccess = useCallback(() => {
        setPaymentDialogParams(null);
        toast.success(t('subscription.successTitle'), {
            message: t('subscription.successGenericMessage'),
            duration: UI_CONSTANTS.TOAST_DURATION.LONG,
        });
        setTimeout(() => onTriggerRefresh(), 1000);
    }, [onTriggerRefresh, t, toast]);

    return {
        paymentDialogParams,
        handleSubscribe,
        handlePaymentSuccess,
        closePaymentDialog: () => setPaymentDialogParams(null),
    };
}
