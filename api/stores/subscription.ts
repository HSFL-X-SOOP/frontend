import {
    SubscriptionStatusResponse,
    CreateSubscriptionRequest,
    PaymentSheetResponse,
    PortalRequest,
    PortalResponse,
    CancelSubscriptionRequest,
    ReactivateSubscriptionRequest,
    Invoice,
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

        getInvoices: (): Promise<Result<Invoice[]>> => {
            return api.requestSafe(
                httpClient.get<Invoice[]>('/subscriptions/invoices'),
                'SubscriptionStore:getInvoices'
            );
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
