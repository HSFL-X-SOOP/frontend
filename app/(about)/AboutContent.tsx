import {Href, Link} from 'expo-router';
import {ScrollView, SafeAreaView} from 'react-native';
import {Card, Text, XStack, YStack, View, H1, H2, Separator} from 'tamagui';
import {ExternalLink, Globe, Database, MapPin, TrendingUp} from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/ui';
import {SecondaryButton, SecondaryButtonText} from '@/types/button';

type StudentCardProps = {
    id: string;
    letter: string;
    name: string;
    role: string;
    description: string;
    skills: string[];
};

type FeatureProps = {
    icon: React.ComponentType<{ size: number; color: string | undefined }>;
    title: string;
    description: string;
    link?: string;
};

function AboutScreen() {
    const {t} = useTranslation('about');
    const studentCards: StudentCardProps[] = [
        {
            id: '1',
            letter: 'D',
            name: 'Daniel',
            role: t('team.daniel.role'),
            description: t('team.daniel.description'),
            skills: t('team.daniel.skills', { returnObjects: true }) as string[]
        },
        {
            id: '2',
            letter: 'F',
            name: 'Fatih',
            role: t('team.fatih.role'),
            description: t('team.fatih.description'),
            skills: t('team.fatih.skills', { returnObjects: true }) as string[]
        },
        {
            id: '3',
            letter: 'J',
            name: 'Julian',
            role: t('team.julian.role'),
            description: t('team.julian.description'),
            skills: t('team.julian.skills', { returnObjects: true }) as string[]
        },
        {
            id: '4',
            letter: 'V',
            name: 'Vincent',
            role: t('team.vincent.role'),
            description: t('team.vincent.description'),
            skills: t('team.vincent.skills', { returnObjects: true }) as string[]
        }
    ];

    const features: FeatureProps[] = [
        {
            icon: MapPin,
            title: t('features.realTimeData.title'),
            description: t('features.realTimeData.description'),
            link: 'https://github.com'
        },
        {
            icon: TrendingUp,
            title: t('features.historicalData.title'),
            description: t('features.historicalData.description')
        },
        {
            icon: Database,
            title: t('features.dataAccuracy.title'),
            description: t('features.dataAccuracy.description')
        },
        {
            icon: Globe,
            title: t('features.accessibility.title'),
            description: t('features.accessibility.description')
        }
    ];

    const StudentCard = ({ card }: { card: StudentCardProps }) => (
        <Card
            bordered
            padding="$4"
            borderColor="$borderColor"
            borderWidth={1}
            borderRadius="$4"
            minWidth={250}
        >
            <YStack gap="$3">
                <XStack alignItems="center" gap="$3">
                    <View
                        width={48}
                        height={48}
                        borderRadius="$2"
                        backgroundColor="$accent5"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text fontSize={24} fontWeight="700" color="white">
                            {card.letter}
                        </Text>
                    </View>
                    <YStack>
                        <H2 fontSize="$6" fontFamily="$oswald">{card.name}</H2>
                        <Text fontSize="$3" color="$color" opacity={0.7}>
                            {card.role}
                        </Text>
                    </YStack>
                </XStack>
                <Text fontSize="$3" color="$color">
                    {card.description}
                </Text>
                <YStack gap="$2">
                    <Text fontSize="$2" fontWeight="600" color="$color" opacity={0.6}>
                        {t('team.skills')}
                    </Text>
                    <XStack gap="$2" flexWrap="wrap">
                        {card.skills.map((skill, index) => (
                            <View
                                key={index}
                                paddingHorizontal="$3"
                                paddingVertical="$1.5"
                                borderRadius="$2"
                                backgroundColor="$accent3"
                            >
                                <Text fontSize="$2" color="$color">
                                    {skill}
                                </Text>
                            </View>
                        ))}
                    </XStack>
                </YStack>
            </YStack>
        </Card>
    );

    const FeatureCard = ({ feature }: { feature: FeatureProps }) => (
        <Card
            bordered
            padding="$4"
            borderColor="$borderColor"
            borderWidth={1}
            borderRadius="$4"
            minWidth={300}
            flex={1}
        >
            <YStack gap="$3">
                <XStack alignItems="center" gap="$2">
                    <feature.icon size={28} color="$accent10" />
                    <H2 fontSize="$6" fontFamily="$oswald">{feature.title}</H2>
                </XStack>
                <Text fontSize="$3" color="$color" opacity={0.8}>
                    {feature.description}
                </Text>
                {feature.link && (
                    <Link href={feature.link as Href}>
                        <SecondaryButton size="$3">
                            <ExternalLink size={16} />
                            <SecondaryButtonText color="$accent8">
                                {t('common.learnMore')}
                            </SecondaryButtonText>
                        </SecondaryButton>
                    </Link>
                )}
            </YStack>
        </Card>
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView>
                <YStack padding="$4" gap="$6">
                    {/* Header */}
                    <YStack gap="$2">
                        <H1 fontFamily="$oswald">{t('title')}</H1>
                        <Text fontSize="$5" color="$color" opacity={0.7}>
                            {t('subtitle')}
                        </Text>
                    </YStack>

                    <Separator />

                    {/* Features */}
                    <YStack gap="$3">
                        <H2 fontFamily="$oswald">{t('features.title')}</H2>
                        <XStack gap="$3" flexWrap="wrap">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} feature={feature} />
                            ))}
                        </XStack>
                    </YStack>

                    <Separator />

                    {/* Team */}
                    <YStack gap="$3">
                        <H2 fontFamily="$oswald">{t('team.title')}</H2>
                        <XStack gap="$3" flexWrap="wrap">
                            {studentCards.map((card) => (
                                <StudentCard key={card.id} card={card} />
                            ))}
                        </XStack>
                    </YStack>

                    <Separator />

                    {/* Footer */}
                    <YStack gap="$2">
                        <Text fontSize="$4" fontWeight="600">
                            {t('footer.title')}
                        </Text>
                        <Text fontSize="$3" color="$color" opacity={0.7}>
                            {t('footer.description')}
                        </Text>
                    </YStack>
                </YStack>
            </SafeAreaView>
        </ScrollView>
    );
}

export default AboutScreen;
