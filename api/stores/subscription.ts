import {
    SubscriptionStatusResponse,
    CreateSubscriptionRequest,
    PaymentSheetResponse,
    PortalRequest,
    PortalResponse,
    CancelSubscriptionRequest,
    ReactivateSubscriptionRequest,
    Invoice,
    InvoiceApiResponse,
    SetupIntentResponse,
    UpdatePaymentMethodRequest,
    UpdatePaymentMethodResponse,
    PauseResumeRequest,
    SubscriptionInfo,
} from '@/api/models/subscription';
import {useHttpClient} from '@/api/client';
import {Result} from '@/utils/errors';
import {api} from '@/utils/api';

export function useSubscriptionStore() {
    const httpClient = useHttpClient();

    return {
        getStatus: (): Promise<Result<SubscriptionStatusResponse>> => {
            return api.requestSafe(
                httpClient.get<SubscriptionStatusResponse>('/subscriptions/status'),
                'SubscriptionStore:getStatus'
            );
        },

        createSubscription: (body: CreateSubscriptionRequest): Promise<Result<PaymentSheetResponse>> => {
            return api.requestSafe(
                httpClient.post<PaymentSheetResponse>('/subscriptions/create', body),
                'SubscriptionStore:createSubscription'
            );
        },

        createPortalSession: (body: PortalRequest): Promise<Result<PortalResponse>> => {
            return api.requestSafe(
                httpClient.post<PortalResponse>('/subscriptions/portal', body),
                'SubscriptionStore:createPortalSession'
            );
        },

        cancelSubscription: (body: CancelSubscriptionRequest): Promise<Result<void>> => {
            return api.requestVoidSafe(
                httpClient.post('/subscriptions/cancel', body),
                'SubscriptionStore:cancelSubscription'
            );
        },

        reactivateSubscription: (body: ReactivateSubscriptionRequest): Promise<Result<void>> => {
            return api.requestVoidSafe(
                httpClient.post('/subscriptions/reactivate', body),
                'SubscriptionStore:reactivateSubscription'
            );
        },

        getInvoices: async (): Promise<Result<Invoice[]>> => {
            const result = await api.requestSafe(
                httpClient.get<InvoiceApiResponse[]>('/subscriptions/invoices'),
                'SubscriptionStore:getInvoices'
            );

            if (!result.ok) {
                return result;
            }

            return {
                ok: true,
                value: result.value.map((invoice) => ({
                    id: invoice.id,
                    amount: invoice.amountPaid || invoice.amountDue || 0,
                    currency: invoice.currency,
                    status: invoice.status ?? 'open',
                    created: invoice.created,
                    pdfUrl: invoice.invoicePdf,
                }))
            };
        },

        createSetupIntent: (): Promise<Result<SetupIntentResponse>> => {
            return api.requestSafe(
                httpClient.post<SetupIntentResponse>('/subscriptions/setup-intent'),
                'SubscriptionStore:createSetupIntent'
            );
        },

        updatePaymentMethod: (body: UpdatePaymentMethodRequest): Promise<Result<UpdatePaymentMethodResponse>> => {
            return api.requestSafe(
                httpClient.put<UpdatePaymentMethodResponse>('/subscriptions/payment-method', body),
                'SubscriptionStore:updatePaymentMethod'
            );
        },

        pauseSubscription: (body: PauseResumeRequest): Promise<Result<SubscriptionInfo>> => {
            return api.requestSafe(
                httpClient.post<SubscriptionInfo>('/subscriptions/pause', body),
                'SubscriptionStore:pauseSubscription'
            );
        },

        resumeSubscription: (body: PauseResumeRequest): Promise<Result<SubscriptionInfo>> => {
            return api.requestSafe(
                httpClient.post<SubscriptionInfo>('/subscriptions/resume', body),
                'SubscriptionStore:resumeSubscription'
            );
        },
    };
}
