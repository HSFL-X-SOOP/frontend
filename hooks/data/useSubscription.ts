import {useCallback, useState} from 'react';
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
import {useSubscriptionStore} from '@/api/stores/subscription';
import {AppError} from '@/utils/errors';

export const useSubscription = () => {
    const subscriptionStore = useSubscriptionStore();
    const [loading, setLoading] = useState(false);

    const getStatus = useCallback(async (
        onSuccess: (data: SubscriptionStatusResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.getStatus();

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    const createSubscription = useCallback(async (
        body: CreateSubscriptionRequest,
        onSuccess: (data: PaymentSheetResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.createSubscription(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    const createPortalSession = useCallback(async (
        body: PortalRequest,
        onSuccess: (data: PortalResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.createPortalSession(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    const cancelSubscription = useCallback(async (
        body: CancelSubscriptionRequest,
        onSuccess: () => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.cancelSubscription(body);

        if (result.ok) {
            onSuccess();
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    const reactivateSubscription = useCallback(async (
        body: ReactivateSubscriptionRequest,
        onSuccess: () => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.reactivateSubscription(body);

        if (result.ok) {
            onSuccess();
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    const getInvoices = useCallback(async (
        onSuccess: (data: Invoice[]) => void,
        onError: (error: AppError) => void
    ) => {
        const result = await subscriptionStore.getInvoices();

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
    }, [subscriptionStore]);

    const createSetupIntent = useCallback(async (
        onSuccess: (data: SetupIntentResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.createSetupIntent();

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    const updatePaymentMethod = useCallback(async (
        body: UpdatePaymentMethodRequest,
        onSuccess: (data: UpdatePaymentMethodResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.updatePaymentMethod(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    const pauseSubscription = useCallback(async (
        body: PauseResumeRequest,
        onSuccess: (data: SubscriptionInfo) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.pauseSubscription(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    const resumeSubscription = useCallback(async (
        body: PauseResumeRequest,
        onSuccess: (data: SubscriptionInfo) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await subscriptionStore.resumeSubscription(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [subscriptionStore]);

    return {
        loading,
        getStatus,
        createSubscription,
        createPortalSession,
        cancelSubscription,
        reactivateSubscription,
        getInvoices,
        createSetupIntent,
        updatePaymentMethod,
        pauseSubscription,
        resumeSubscription,
    };
};
