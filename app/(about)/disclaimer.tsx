import { useTranslation } from '@/hooks/ui';
import { getMapRoute } from '@/utils/navigation';
import { useRouter } from 'expo-router';
import { Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { H1, H2, Text, YStack, View } from 'tamagui';
import { PrimaryButton, PrimaryButtonText } from '@/types/button';

export default function DisclaimerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBackToApp = () => {
    router.replace(getMapRoute());
  };

  return (
    <View style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$content1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <YStack gap="$6" padding="$4" maxWidth={800} alignSelf="center" paddingTop="$4">
            <YStack gap="$3" alignItems="center" marginBottom="$4">
              <H1 fontSize={36} fontFamily="$oswald" fontWeight="bold" textAlign="center" color="$accent7">
                {t('disclaimer.title')}
              </H1>
              <Text fontSize={18} textAlign="center" color="$color" opacity={0.85} maxWidth={600} lineHeight={24}>
                {t('disclaimer.subtitle')}
              </Text>
              <Text fontSize={16} textAlign="center" color="$color" opacity={0.9} maxWidth={760} lineHeight={24}>
                {t('disclaimer.intro')}
              </Text>
            </YStack>

            <YStack gap="$4">

              <YStack gap="$2">
                <H2 fontSize={20} fontWeight="600" color="$accent7" fontFamily="$oswald">{t('disclaimer.noWarranty')}</H2>
                <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                  {t('disclaimer.noWarrantyDesc')}
                </Text>
              </YStack>

              <YStack gap="$2">
                <H2 fontSize={20} fontWeight="600" color="$accent7" fontFamily="$oswald">{t('disclaimer.notNavInstrument')}</H2>
                <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                  {t('disclaimer.notNavInstrumentDesc')}
                </Text>
              </YStack>

              <YStack gap="$2">
                <H2 fontSize={20} fontWeight="600" color="$accent7" fontFamily="$oswald">{t('disclaimer.dueDiligence')}</H2>
                <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                  {t('disclaimer.dueDiligenceDesc')}
                </Text>
                <YStack gap="$2" paddingLeft="$4" marginTop="$2">
                  <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">{t('disclaimer.elwis')}</Text> – {t('disclaimer.elwisDesc')}</Text>
                  <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">{t('disclaimer.pegelonline')}</Text> – {t('disclaimer.pegelonlineDesc')}</Text>
                  <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">{t('disclaimer.warnings')}</Text> – {t('disclaimer.warningsDesc')}</Text>
                </YStack>
                <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9} marginTop="$3">
                  {t('disclaimer.localConditions')}
                </Text>
                <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                  {t('disclaimer.technicalIssues')}
                </Text>
              </YStack>

              <YStack gap="$2">
                <H2 fontSize={20} fontWeight="600" color="$accent7" fontFamily="$oswald">{t('disclaimer.liability')}</H2>
                <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                  {t('disclaimer.liabilityScope')}
                </Text>
                <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                  {t('disclaimer.liabilityDesc')}
                </Text>
                <YStack gap="$2" paddingLeft="$4" marginTop="$2">
                  <Text fontSize={15} color="$color">• {t('disclaimer.groundingDamage')}</Text>
                  <Text fontSize={15} color="$color">• {t('disclaimer.collisionDamage')}</Text>
                  <Text fontSize={15} color="$color">• {t('disclaimer.propertyDamage')}</Text>
                </YStack>
                <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9} marginTop="$3">
                  {t('disclaimer.liabilityLimitation')}
                </Text>
              </YStack>

            </YStack>
          </YStack>
        </ScrollView>

        {Platform.OS !== 'web' && (
          <YStack
            padding="$4"
            paddingTop="$2"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            backgroundColor="$content1"
            style={{ paddingBottom: Math.max(insets.bottom, 12) }}
          >
            <PrimaryButton size="$4" width="100%" onPress={handleBackToApp}>
              <PrimaryButtonText>{t('legalConsent.backToApp')}</PrimaryButtonText>
            </PrimaryButton>
          </YStack>
        )}
      </YStack>
    </View>
  );
}
