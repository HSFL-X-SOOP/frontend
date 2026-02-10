import {useEffect, useRef} from 'react';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {YStack, Text, Spinner, View} from 'tamagui';

export default function SubscriptionCallbackHandler() {
    const router = useRouter();
    const params = useLocalSearchParams<{ subscription_status?: string; subscription_type?: string }>();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (hasRedirected.current) return;
        hasRedirected.current = true;

        const timer = setTimeout(() => {
            router.replace({
                pathname: '/(profile)/profile',
                params: {
                    subscription_status: params.subscription_status ?? '',
                    subscription_type: params.subscription_type ?? '',
                },
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [router, params]);

    return (
        <View style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content3" alignItems="center" justifyContent="center" gap="$4">
                <Spinner size="large" color="$accent7"/>
                <Text fontSize={18} color="$color" opacity={0.8}>
                    Redirecting...
                </Text>
            </YStack>
        </View>
    );
}
