export enum SubscriptionType {
    APP_NOTIFICATION = 'APP_NOTIFICATION',
    API_ACCESS = 'API_ACCESS',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    TRIALING = 'TRIALING',
    PAST_DUE = 'PAST_DUE',
    CANCELED = 'CANCELED',
    PAUSED = 'PAUSED',
}

export interface SubscriptionInfo {
    type: SubscriptionType;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    trialEnd: string | null;
    cancelAtPeriodEnd: boolean;
}

export interface SubscriptionStatusResponse {
    notifications: SubscriptionInfo | null;
    apiAccess: SubscriptionInfo | null;
}

export interface CreateSubscriptionRequest {
    subscriptionType: SubscriptionType;
}

export interface PaymentSheetResponse {
    paymentIntent: string | null;
    setupIntent: string | null;
    ephemeralKey: string;
    customerId: string;
    publishableKey: string;
}

export interface PortalRequest {
    returnUrl: string;
}

export interface PortalResponse {
    portalUrl: string;
}

export interface CancelSubscriptionRequest {
    subscriptionType: SubscriptionType;
}

export interface ReactivateSubscriptionRequest {
    subscriptionType: SubscriptionType;
}

export interface Invoice {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
    pdfUrl: string | null;
}

export interface SetupIntentResponse {
    clientSecret: string;
}

export interface UpdatePaymentMethodRequest {
    paymentMethodId: string;
}

export interface UpdatePaymentMethodResponse {
    success: boolean;
}

export interface PauseResumeRequest {
    subscriptionType: SubscriptionType;
}
