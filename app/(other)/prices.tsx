import {Href, useRouter} from 'expo-router';
import {Linking, ScrollView} from 'react-native';
import {ComponentType} from 'react';
import {Bell, Check, Code, CreditCard} from '@tamagui/lucide-icons';
import {Card, H1, H2, Text, View, XStack, YStack} from 'tamagui';
import {LinearGradient} from 'tamagui/linear-gradient';

import {APP_METADATA} from '@/config/constants';
import {useSession} from '@/context/SessionContext';
import {useTranslation} from '@/hooks/ui';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

const SUBSCRIPTION_HREF = '/(profile)/profile?tab=subscription' as Href;
const LOGIN_HREF = '/login' as Href;

interface OfferCardProps {
    icon: ComponentType<{size?: number; color?: string}>;
    title: string;
    description: string;
    price: string;
    features: string[];
    ctaHref: Href;
    ctaLabel: string;
    gradientColors: [string, string];
}

function OfferCard({
    icon: Icon,
    title,
    description,
    price,
    features,
    ctaHref,
    ctaLabel,
    gradientColors,
}: OfferCardProps) {
    const router = useRouter();

    return (
        <Card
            flex={1}
            minWidth={300}
            backgroundColor="$content1"
            borderRadius="$8"
            borderWidth={1}
            borderColor="$borderColor"
            overflow="hidden"
        >
            <LinearGradient colors={gradientColors} start={[0, 0]} end={[1, 1]} padding="$4">
                <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center" gap="$2.5">
                        <View
                            width={42}
                            height={42}
                            borderRadius="$10"
                            backgroundColor="rgba(255,255,255,0.18)"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon size={20} color="white" />
                        </View>
                        <Text color="white" fontSize={18} fontFamily="$oswald" fontWeight="700">
                            {title}
                        </Text>
                    </XStack>
                    <Text color="white" fontSize={14} fontWeight="700" opacity={0.95}>
                        {price}
                    </Text>
                </XStack>
            </LinearGradient>

            <YStack padding="$4" gap="$3.5">
                <Text color="$color" opacity={0.85} lineHeight={22}>
                    {description}
                </Text>

                <YStack gap="$2">
                    {features.map((feature, index) => (
                        <XStack key={`${title}-${index}`} gap="$2" alignItems="flex-start">
                            <Check size={16} color="$accent7" marginTop={2} />
                            <Text flex={1} color="$color" opacity={0.9}>
                                {feature}
                            </Text>
                        </XStack>
                    ))}
                </YStack>

                <PrimaryButton marginTop="$2" onPress={() => router.push(ctaHref)}>
                    <PrimaryButtonText>{ctaLabel}</PrimaryButtonText>
                </PrimaryButton>
            </YStack>
        </Card>
    );
}

export default function PricesScreen() {
    const router = useRouter();
    const {t} = useTranslation();
    const {session} = useSession();
    const isLoggedIn = Boolean(session?.accessToken);

    const ctaHref = isLoggedIn ? SUBSCRIPTION_HREF : LOGIN_HREF;
    const ctaLabel = isLoggedIn
        ? t('subscription.landingCtaLoggedIn')
        : t('subscription.landingCtaLoggedOut');

    return (
        <View style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content1">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <YStack gap="$5" padding="$4" maxWidth={1020} width="100%" alignSelf="center" paddingBottom="$8">
                        <Card borderRadius="$8" overflow="hidden" borderWidth={1} borderColor="$borderColor">
                            <LinearGradient colors={['$accent8', '$accent6']} start={[0, 0]} end={[1, 1]} padding="$6">
                                <YStack gap="$3">
                                    <H1 color="white" fontFamily="$oswald" fontSize={36} lineHeight={40}>
                                        {t('subscription.landingTitle')}
                                    </H1>
                                    <Text color="white" opacity={0.92} lineHeight={24} maxWidth={760}>
                                        {t('subscription.landingSubtitle')}
                                    </Text>
                                    <XStack gap="$3" flexWrap="wrap" marginTop="$2">
                                        <PrimaryButton onPress={() => router.push(ctaHref)}>
                                            <XStack alignItems="center" gap="$2">
                                                <CreditCard size={16} color="white" />
                                                <PrimaryButtonText>{ctaLabel}</PrimaryButtonText>
                                            </XStack>
                                        </PrimaryButton>
                                        <SecondaryButton
                                            onPress={() => Linking.openURL(APP_METADATA.API_DOCS)}
                                            backgroundColor="$content1"
                                            borderColor="$accent7"
                                            hoverStyle={{backgroundColor: '$content2', borderColor: '$accent8'}}
                                            pressStyle={{backgroundColor: '$content2', borderColor: '$accent6', scale: 0.98}}
                                        >
                                            <SecondaryButtonText>
                                                {t('api:viewDocs')}
                                            </SecondaryButtonText>
                                        </SecondaryButton>
                                    </XStack>
                                    <Text color="white" opacity={0.85} fontSize={13}>
                                        {t('subscription.manageHint')}
                                    </Text>
                                </YStack>
                            </LinearGradient>
                        </Card>

                        <YStack gap="$3">
                            <H2 fontFamily="$oswald" fontSize={28} color="$accent8">
                                {t('subscription.title')}
                            </H2>
                            <XStack gap="$4" flexWrap="wrap">
                                <OfferCard
                                    icon={Bell}
                                    title={t('subscription.appNotifications')}
                                    description={t('subscription.appNotificationsDesc')}
                                    price={t('subscription.priceMonth', {price: '4.99€'})}
                                    features={[
                                        t('subscription.features.notifications.1'),
                                        t('subscription.features.notifications.2'),
                                        t('subscription.features.notifications.3'),
                                    ]}
                                    ctaHref={ctaHref}
                                    ctaLabel={t('subscription.subscribe')}
                                    gradientColors={['#245e8d', '#1f7aac']}
                                />
                                <OfferCard
                                    icon={Code}
                                    title={t('subscription.apiAccess')}
                                    description={t('subscription.apiAccessDesc')}
                                    price={t('subscription.priceMonth', {price: '9.99€'})}
                                    features={[
                                        t('subscription.features.api.1'),
                                        t('subscription.features.api.2'),
                                        t('subscription.features.api.3'),
                                    ]}
                                    ctaHref={ctaHref}
                                    ctaLabel={t('subscription.subscribe')}
                                    gradientColors={['#256770', '#0f8c9d']}
                                />
                            </XStack>
                        </YStack>

                        <Card padding="$5" borderRadius="$7" backgroundColor="$content2" borderWidth={1} borderColor="$borderColor">
                            <YStack gap="$3">
                                <Text color="$accent8" fontSize={20} fontFamily="$oswald">
                                    {t('subscription.journeyTitle')}
                                </Text>
                                <YStack gap="$2">
                                    <Text color="$color" opacity={0.9}>1. {t('subscription.journeyStep1')}</Text>
                                    <Text color="$color" opacity={0.9}>2. {t('subscription.journeyStep2')}</Text>
                                    <Text color="$color" opacity={0.9}>3. {t('subscription.journeyStep3')}</Text>
                                </YStack>
                            </YStack>
                        </Card>
                    </YStack>
                </ScrollView>
            </YStack>
        </View>
    );
}
