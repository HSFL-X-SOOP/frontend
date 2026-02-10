import {PaymentSheetResponse} from '@/api/models/subscription';

export interface PaymentResult {
    success: boolean;
    error?: string;
    canceled?: boolean;
}

export function useStripePayment() {
    const presentPayment = async (_params: PaymentSheetResponse): Promise<PaymentResult> => {
        return {success: false, error: 'Use WebPaymentDialog on web'};
    };

    return {presentPayment};
}
