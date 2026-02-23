import {useRouter} from 'expo-router';
import {Linking} from 'react-native';
import {Code, CreditCard, ExternalLink} from '@tamagui/lucide-icons';
import {Card, H5, Text, View, XStack, YStack} from 'tamagui';

import {APP_METADATA} from '@/config/constants';
import {useTranslation} from '@/hooks/ui';
import {PrimaryButton, PrimaryButtonText, SecondaryButton, SecondaryButtonText} from '@/types/button';

export default function ProfileSettingsApiScreen() {
    const router = useRouter();
    const {t} = useTranslation();

    return (
        <View style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content1" padding="$4">
                <Card padding="$5" borderRadius="$7" borderWidth={1} borderColor="$borderColor" backgroundColor="$content2">
                    <YStack gap="$3">
                        <XStack alignItems="center" gap="$2">
                            <Code size={18} color="$accent7" />
                            <H5 color="$accent7" fontFamily="$oswald">
                                {t('subscription.apiAccess')}
                            </H5>
                        </XStack>
                        <Text color="$color" opacity={0.88} lineHeight={22}>
                            {t('subscription.workspaceSubtitle')}
                        </Text>
                        <Text color="$color" opacity={0.75}>
                            {t('subscription.manageHint')}
                        </Text>
                        <XStack gap="$3" flexWrap="wrap" marginTop="$2">
                            <PrimaryButton onPress={() => router.push('/(profile)/profile?tab=subscription')}>
                                <XStack alignItems="center" gap="$2">
                                    <CreditCard size={16} color="white" />
                                    <PrimaryButtonText>{t('subscription.manageBilling')}</PrimaryButtonText>
                                </XStack>
                            </PrimaryButton>
                            <SecondaryButton onPress={() => Linking.openURL(APP_METADATA.API_DOCS)}>
                                <XStack alignItems="center" gap="$2">
                                    <ExternalLink size={16} color="$accent7" />
                                    <SecondaryButtonText>{t('subscription.viewDocs')}</SecondaryButtonText>
                                </XStack>
                            </SecondaryButton>
                        </XStack>
                    </YStack>
                </Card>
            </YStack>
        </View>
    );
}
