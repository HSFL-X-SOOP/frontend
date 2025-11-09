import {Link, Href} from 'expo-router';
import {SafeAreaView, ScrollView, Linking} from 'react-native';
import {Text, YStack, Card, H1, H2, XStack, View, Button} from 'tamagui';
import {Code, Database, Key, ExternalLink} from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/useTranslation';

export default function APIScreen() {
    const {t} = useTranslation('api');

    return (
        <SafeAreaView style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic"
                >
                    <YStack gap="$6" padding="$4" maxWidth={900} alignSelf="center" paddingTop="$4">

                        <YStack gap="$3" alignItems="center" marginBottom="$4">
                            <H1 fontSize={36} fontFamily="$oswald" fontWeight="bold" textAlign="center"
                                color="$accent7">
                                {t('api.title')}
                            </H1>
                            <Text fontSize={18} textAlign="center" color="$color" opacity={0.85} maxWidth={600}
                                  lineHeight={24}>
                                {t('api.subtitle')}
                            </Text>
                        </YStack>

                        <Card padding="$6" backgroundColor="$accent1" borderRadius="$6" borderWidth={1}
                              borderColor="$accent6">
                            <XStack alignItems="center" gap="$4">
                                <View
                                    width={60}
                                    height={60}
                                    backgroundColor="$accent7"
                                    borderRadius="$10"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Key size={32} color="white"/>
                                </View>
                                <YStack flex={1} gap="$2">
                                    <Text fontSize={18} fontWeight="600" color="$accent8">
                                        {t('api.accessRequired')}
                                    </Text>
                                    <Text fontSize={15} color="$color" opacity={0.9}>
                                        {t('api.accessDescription')}
                                    </Text>
                                    <Link href={"/(other)/prices" as Href}>
                                        <Text color="$accent8" textDecorationLine="underline" fontWeight="600">
                                            {t('api.pricingLink')}
                                        </Text>
                                    </Link>
                                </YStack>
                            </XStack>
                        </Card>

                        <YStack gap="$5">
                            <H2 fontSize={28} fontFamily="$oswald" fontWeight="600" textAlign="center" color="$accent7">
                                {t('api.features')}
                            </H2>

                            <YStack gap="$4">
                                <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1}
                                      borderColor="$borderColor">
                                    <XStack alignItems="flex-start" gap="$4">
                                        <View
                                            width={56}
                                            height={56}
                                            backgroundColor="$accent2"
                                            borderRadius="$10"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Database size={28} color="$accent7"/>
                                        </View>
                                        <YStack flex={1} gap="$3">
                                            <H2 fontSize={20} fontWeight="600"
                                                color="$accent7">{t('features.flexibleQuery')}</H2>
                                            <YStack gap="$2">
                                                <Text fontSize={15} color="$color">• <Text fontWeight="600"
                                                                                           color="$accent8">{t('features.location')}:</Text> {t('features.locationDesc')}
                                                </Text>
                                                <Text fontSize={15} color="$color">• <Text fontWeight="600"
                                                                                           color="$accent8">{t('features.timeRange')}:</Text> {t('features.timeRangeDesc')}
                                                </Text>
                                                <Text fontSize={15} color="$color">• <Text fontWeight="600"
                                                                                           color="$accent8">{t('features.measurements')}:</Text> {t('features.measurementsDesc')}
                                                </Text>
                                                <Text fontSize={15} color="$color">• <Text fontWeight="600"
                                                                                           color="$accent8">{t('features.events')}:</Text> {t('features.eventsDesc')}
                                                </Text>
                                            </YStack>
                                        </YStack>
                                    </XStack>
                                </Card>

                                <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1}
                                      borderColor="$borderColor">
                                    <XStack alignItems="flex-start" gap="$4">
                                        <View
                                            width={56}
                                            height={56}
                                            backgroundColor="$accent2"
                                            borderRadius="$10"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Code size={28} color="$accent7"/>
                                        </View>
                                        <YStack flex={1} gap="$3">
                                            <H2 fontSize={20} fontWeight="600"
                                                color="$accent7">{t('features.restfulInterface')}</H2>
                                            <Text fontSize={16} color="$color" opacity={0.9} lineHeight={22}>
                                                {t('features.restfulDesc')}
                                            </Text>
                                        </YStack>
                                    </XStack>
                                </Card>

                                <Card padding="$5" backgroundColor="$content2" borderRadius="$6" borderWidth={1}
                                      borderColor="$borderColor">
                                    <XStack alignItems="flex-start" gap="$4">
                                        <View
                                            width={56}
                                            height={56}
                                            backgroundColor="$accent2"
                                            borderRadius="$10"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Database size={28} color="$accent7"/>
                                        </View>
                                        <YStack flex={1} gap="$3">
                                            <H2 fontSize={20} fontWeight="600"
                                                color="$accent7">{t('api.documentation')}</H2>
                                            <Text fontSize={16} color="$color" opacity={0.9} lineHeight={22}>
                                                {t('api.documentationDesc')}
                                            </Text>
                                            <Button
                                                backgroundColor="$accent7"
                                                color="white"
                                                borderRadius="$6"
                                                paddingHorizontal="$4"
                                                paddingVertical="$3"
                                                marginTop="$2"
                                                alignSelf="flex-start"
                                                hoverStyle={{backgroundColor: "$accent4"}}
                                                onPress={() => Linking.openURL('https://www.marlin-live.com/api/')}
                                            >
                                                <XStack alignItems="center" gap="$2">
                                                    <ExternalLink size={16} color="white"/>
                                                    <Text color="white" fontWeight="600"
                                                          fontSize={14}>{t('api.viewDocs')}</Text>
                                                </XStack>
                                            </Button>
                                        </YStack>
                                    </XStack>
                                </Card>
                            </YStack>
                        </YStack>

                        <Card
                            padding="$6"
                            backgroundColor="$content2"
                            borderRadius="$6"
                            borderWidth={1}
                            borderColor="$borderColor"
                            marginTop="$4"
                            alignItems="center"
                        >
                            <YStack gap="$4" alignItems="center">
                                <H2 fontSize={24} fontWeight="600" color="$accent7" textAlign="center">
                                    {t('api.readyTitle')}
                                </H2>
                                <Text fontSize={16} textAlign="center" color="$color" opacity={0.9} maxWidth={500}>
                                    {t('api.readyDescription')}
                                </Text>
                                <Link href={"/(other)/prices" as Href}>
                                    <Button backgroundColor="$accent7" color="white" borderRadius="$6"
                                            paddingHorizontal="$6" paddingVertical="$4"
                                            hoverStyle={{backgroundColor: "$accent4"}}>
                                        <Text color="white" fontWeight="600" fontSize={16}>{t('api.viewPricing')}</Text>
                                    </Button>
                                </Link>
                            </YStack>
                        </Card>
                    </YStack>
                </ScrollView>
            </YStack>
        </SafeAreaView>
    );
}