import React from 'react';
import {StripeProvider} from '@stripe/stripe-react-native';
import {ENV} from '@/config/environment';

export function StripeProviderWrapper({children}: {children: React.ReactElement | React.ReactElement[]}) {
    return (
        <StripeProvider
            publishableKey={ENV.stripePublishableKey}
            merchantIdentifier="merchant.com.marlin.live"
        >
            {children}
        </StripeProvider>
    );
}
