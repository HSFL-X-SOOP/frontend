import { useTranslation } from '@/hooks/ui';
import { SafeAreaView, ScrollView } from 'react-native';
import { Card, H1, H2, Text, YStack } from 'tamagui';

export default function SensorsScreen() {
  const { t } = useTranslation('sensors');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$content1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <YStack gap="$6" padding="$4" maxWidth={800} alignSelf="center" paddingTop="$4">

            <YStack gap="$3" alignItems="center" marginBottom="$4">
              <H1 fontSize={36} fontFamily="$oswald" fontWeight="bold" textAlign="center" color="$accent7">
                {t('sensors.title')}
              </H1>
              <Text fontSize={18} textAlign="center" color="$color" opacity={0.85} maxWidth={600} lineHeight={24}>
                {t('sensors.subtitle')}
              </Text>
            </YStack>

            <YStack gap="$5">

              <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
                <YStack gap="$3">
                  <H2 fontSize={24} fontWeight="600" color="$accent7">{t('sensors.waterTemperature')}</H2>
                  <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                    {t('sensors.waterTempDesc')}
                  </Text>
                  <YStack gap="$2" paddingLeft="$4" marginTop="$2">
                    <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">-0.5~°C</Text> – {t('examples.freezing')}</Text>
                    <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">8°C</Text> – {t('examples.coldDrink')}</Text>
                    <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">10°C</Text> – {t('examples.wetsuit')}</Text>
                    <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">20°C</Text> – {t('examples.swimming')}</Text>
                    <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">38°C</Text> – {t('examples.hotShower')}</Text>
                  </YStack>
                </YStack>
              </Card>

              <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
                <YStack gap="$3">
                  <H2 fontSize={24} fontWeight="600" color="$accent7">{t('sensors.waveHeight')}</H2>
                  <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                    {t('sensors.waveHeightDesc')}
                  </Text>
                  <YStack gap="$2" paddingLeft="$4" marginTop="$2">
                    <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">{t('examples.shortPaper')}</Text> – {t('examples.canKnockChild')}</Text>
                    <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">{t('examples.longPaper')}</Text> – {t('examples.canKnockAdult')}</Text>
                    <Text fontSize={15} color="$color">• <Text fontWeight="600" color="$accent8">{t('examples.tsunami')}</Text> – {t('examples.wouldKnockTower')}</Text>
                  </YStack>
                </YStack>
              </Card>

              <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
                <YStack gap="$3">
                  <H2 fontSize={24} fontWeight="600" color="$accent7">{t('sensors.waterLevel')}</H2>
                  <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                    {t('sensors.waterLevelDesc')}
                  </Text>
                </YStack>
              </Card>

              <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
                <YStack gap="$3">
                  <H2 fontSize={24} fontWeight="600" color="$accent7">{t('sensors.standardDeviation')}</H2>
                  <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                    {t('sensors.standardDeviationDesc')}
                  </Text>
                </YStack>
              </Card>

              <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
                <YStack gap="$3">
                  <H2 fontSize={24} fontWeight="600" color="$accent7">{t('sensors.windSpeed')}</H2>
                  <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                    {t('sensors.windSpeedDesc')}
                  </Text>
                </YStack>
              </Card>

              <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
                <YStack gap="$3">
                  <H2 fontSize={24} fontWeight="600" color="$accent7">{t('sensors.windDirection')}</H2>
                  <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                    {t('sensors.windDirectionDesc')}
                  </Text>
                </YStack>
              </Card>

              <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1} borderColor="$borderColor">
                <YStack gap="$3">
                  <H2 fontSize={24} fontWeight="600" color="$accent7">{t('sensors.airPressure')}</H2>
                  <Text fontSize={16} lineHeight={22} color="$color" opacity={0.9}>
                    {t('sensors.airPressureDesc')}
                  </Text>
                </YStack>
              </Card>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}