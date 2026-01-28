
import { useTranslation } from '@/hooks/ui';
import { Link } from 'expo-router';
import { Text, XStack, YStack } from 'tamagui';
import { Github } from '@tamagui/lucide-icons';

export function Footer() {
    const { t } = useTranslation();
    return (
        <YStack
            backgroundColor="$content1"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            paddingVertical="$3"
            paddingHorizontal="$4"
            marginTop="auto"
        >
            <XStack maxWidth={1400} width="100%" alignSelf="center" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="$4">
                <Text fontSize="$2" color="$gray11">
                    {t('footer.copyright')}
                </Text>
                <XStack gap="$3" alignItems="center">
                    <Link href="mailto:info@marlin-live.com">
                        <Text fontSize="$2" color="$gray11" hoverStyle={{ color: '$accent8' }}>
                            {t('footer.contact')}
                        </Text>
                    </Link>
                    <Text fontSize="$2" color="$gray9">•</Text>
                    <Link href="https://hs-flensburg.de/impressum" target="_blank">
                        <Text fontSize="$2" color="$gray11" hoverStyle={{ color: '$accent8' }}>
                            {t('footer.imprint')}
                        </Text>
                    </Link>
                    <Text fontSize="$2" color="$gray9">•</Text>
                    <Link href="https://hs-flensburg.de/datenschutzerklaerung" target="_blank">
                        <Text fontSize="$2" color="$gray11" hoverStyle={{ color: '$accent8' }}>
                            {t('footer.privacyPolicy')}
                        </Text>
                    </Link>
                    <Text fontSize="$2" color="$gray9">•</Text>
                    <Link href="/(about)/disclaimer">
                        <Text fontSize="$2" color="$gray11" hoverStyle={{ color: '$accent8' }}>
                            {t('footer.disclaimer')}
                        </Text>
                    </Link>
                    <Text fontSize="$2" color="$gray9">•</Text>
                    <Link href="https://github.com/HSFL-X-SOOP" target="_blank">
                        <XStack hoverStyle={{ opacity: 1 }}>
                            <Github size={14} color="$gray11" />
                        </XStack>
                    </Link>
                </XStack>
            </XStack>
        </YStack>
    );
}
