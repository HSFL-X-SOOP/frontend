import {useStripe} from '@stripe/stripe-react-native';
import {useCallback} from 'react';
import {useColorScheme} from 'react-native';
import {PaymentSheetResponse} from '@/api/models/subscription';

export interface PaymentResult {
    success: boolean;
    error?: string;
    canceled?: boolean;
}

export function useStripePayment() {
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const colorScheme = useColorScheme();

    const presentPayment = useCallback(async (params: PaymentSheetResponse): Promise<PaymentResult> => {
        const commonParams = {
            merchantDisplayName: 'MARLIN',
            customerId: params.customerId,
            customerEphemeralKeySecret: params.ephemeralKey,
            allowsDelayedPaymentMethods: false,
            style: colorScheme === 'dark' ? 'alwaysDark' as const : 'alwaysLight' as const,
        };

        let initResult;

        if (params.paymentIntent) {
            initResult = await initPaymentSheet({
                ...commonParams,
                paymentIntentClientSecret: params.paymentIntent,
            });
        } else if (params.setupIntent) {
            initResult = await initPaymentSheet({
                ...commonParams,
                setupIntentClientSecret: params.setupIntent,
            });
        } else {
            return {success: false, error: 'No payment or setup intent provided'};
        }

        if (initResult.error) {
            return {success: false, error: initResult.error.message};
        }

        const {error: presentError} = await presentPaymentSheet();

        if (presentError) {
            if (presentError.code === 'Canceled') {
                return {success: false, canceled: true};
            }
            return {success: false, error: presentError.message};
        }

        return {success: true};
    }, [initPaymentSheet, presentPaymentSheet, colorScheme]);

    return {presentPayment};
}
