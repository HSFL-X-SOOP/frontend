import { useTranslation } from '@/hooks/ui';
import { ScrollView } from 'react-native';
import { H1, H2, Text, YStack, View } from 'tamagui';

export default function DisclaimerScreen() {
  const { t } = useTranslation();

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
              </YStack>

              <YStack gap="$2">
                <H2 fontSize={20} fontWeight="600" color="$accent7" fontFamily="$oswald">{t('disclaimer.liability')}</H2>
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
      </YStack>
    </View>
  );
}
