import {Href, Link} from 'expo-router';
import {ScrollView, SafeAreaView} from 'react-native';
import {Card, Text, XStack, YStack, View, Button, H1, H2, Separator} from 'tamagui';
import {ExternalLink, Globe, Database, MapPin, TrendingUp} from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/useTranslation';

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

export default function AboutScreen() {
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
            letter: 'K',
            name: 'Krister',
            role: t('team.krister.role'),
            description: t('team.krister.description'),
            skills: t('team.krister.skills', { returnObjects: true }) as string[]
        },
        {
            id: '5',
            letter: 'T',
            name: 'Tarek',
            role: t('team.tarek.role'),
            description: t('team.tarek.description'),
            skills: t('team.tarek.skills', { returnObjects: true }) as string[]
        },
    ]

    const features : FeatureProps[] = [
        {
            icon: MapPin,
            title: t('features.interactiveMap'),
            description: t('features.interactiveMapDesc'),
            link: '/map'
        },
        {
            icon: TrendingUp,
            title: t('features.dashboard'),
            description: t('features.dashboardDesc'),
            link: '/dashboard/5'
        },
        {
            icon: Database,
            title: t('features.api'),
            description: t('features.apiDesc'),
            link: 'https://marlin-live.com/swagger/index.html'
        }
    ]

    return (
        <SafeAreaView style={{flex: 1}}>
            <YStack flex={1} backgroundColor="$content3">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic"
                >
                    <YStack gap="$6" padding="$4" maxWidth={1000} alignSelf="center" paddingTop="$4">

                        <Card
                            padding="$8"
                            backgroundColor="$accent5"
                            borderRadius="$6"
                            marginTop="$4"
                            borderWidth={1}
                            borderColor="$accent6"
                        >
                            <YStack gap="$4" alignItems="center">
                                <H1 fontSize={48} fontFamily="$oswald" fontWeight="bold" textAlign="center"
                                    color="white">
                                    {t('about.title')}
                                </H1>
                                <Text fontSize={24} textAlign="center" color="white" opacity={0.95} fontWeight="500">
                                    {t('about.subtitle')}
                                </Text>
                                <Text fontSize={18} textAlign="center" color="white" opacity={0.9} maxWidth={600}
                                      lineHeight={26}>
                                    {t('about.description')}
                                </Text>
                            </YStack>
                        </Card>

                        <YStack gap="$5" marginTop="$6">
                            <YStack gap="$3" alignItems="center">
                                <H2 fontSize={32} fontFamily="$oswald" fontWeight="600" textAlign="center"
                                    color="$accent7">
                                    {t('about.ourFeatures')}
                                </H2>
                                <View width={60} height={4} backgroundColor="$accent7" borderRadius="$2"/>
                            </YStack>

                            <YStack gap="$4">
                                {features.map((feature, index) => (
                                    <FeatureCard key={index} feature={feature}/>
                                ))}
                            </YStack>
                        </YStack>

                        <Separator marginVertical="$8" borderColor="$borderColor"/>

                        <YStack gap="$5">
                            <YStack gap="$3" alignItems="center">
                                <H2 fontSize={32} fontFamily="$oswald" fontWeight="600" textAlign="center"
                                    color="$accent7">
                                    {t('about.ourTeam')}
                                </H2>
                                <View width={60} height={4} backgroundColor="$accent7" borderRadius="$2"/>
                            </YStack>

                            <Text fontSize={18} textAlign="center" color="$color" opacity={0.85} marginBottom="$4"
                                  maxWidth={700} alignSelf="center" lineHeight={24}>
                                {t('about.teamDescription')}
                            </Text>

                            <YStack gap="$4">
                                {studentCards.map(student => (
                                    <ModernStudentCard
                                        key={student.id}
                                        student={student}
                                    />
                                ))}
                            </YStack>
                        </YStack>

                        <Card
                            padding="$8"
                            backgroundColor="$content1"
                            borderRadius="$6"
                            borderWidth={1}
                            borderColor="$borderColor"
                            marginTop="$8"
                            marginBottom="$6"
                        >
                            <YStack gap="$6" alignItems="center">
                                <View
                                    width={80}
                                    height={80}
                                    backgroundColor="$accent2"
                                    borderRadius="$12"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Globe size={48} color="$accent7"/>
                                </View>

                                <YStack gap="$3" alignItems="center">
                                    <H2 fontSize={28} fontFamily="$oswald" fontWeight="600" textAlign="center"
                                        color="$accent7">
                                        {t('about.aboutProject')}
                                    </H2>
                                    <View width={60} height={4} backgroundColor="$accent7" borderRadius="$2"/>
                                </YStack>

                                <Text fontSize={18} textAlign="center" color="$color" lineHeight={26} maxWidth={700}
                                      opacity={0.9}>
                                    {t('about.projectDescription')}
                                </Text>

                                <Link href={"https://projekt.marlin-live.com" as Href} style={{textDecorationLine: 'none'}}>
                                    <Button backgroundColor="$accent7" color="white" borderRadius="$6"
                                            paddingHorizontal="$6" paddingVertical="$4"
                                            hoverStyle={{backgroundColor: "$accent4"}}>
                                        <XStack alignItems="center" gap="$3">
                                            <ExternalLink size={20} color="white"/>
                                            <Text color="white" fontWeight="600" fontSize={16}>{t('about.visitWebsite')}</Text>
                                        </XStack>
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


const FeatureCard = ({ feature }: { feature: FeatureProps }) => {
    const {t} = useTranslation('about');
    return (
    <Card
        padding="$5"
        backgroundColor="$content1"
        borderRadius="$6"
        borderWidth={1}
        borderColor="$borderColor"
        hoverStyle={{
            backgroundColor: "$content2",
            borderColor: "$accent6"
        }}
    >
        <XStack alignItems="center" gap="$4">
            <View
                width={56}
                height={56}
                backgroundColor="$accent2"
                borderRadius="$10"
                alignItems="center"
                justifyContent="center"
            >
                <feature.icon size={28} color="$accent6"/>
            </View>

            <YStack flex={1} gap="$2">
                <Text fontSize="$6" fontWeight="600" color="$color">
                    {feature.title}
                </Text>
                <Text fontSize="$3" color="$color" opacity={0.8} lineHeight="$4">
                    {feature.description}
                </Text>
                {feature.link && (
                    <Link href={feature.link as Href}>
                        <Text fontSize="$3" color="$accent7" textDecorationLine="underline">
                            {t('about.learnMore')}
                        </Text>
                    </Link>
                )}
            </YStack>
        </XStack>
    </Card>
    );
};

const ModernStudentCard = ({student}: {student: StudentCardProps}) => (
    <Card
        padding="$5"
        backgroundColor="$content1"
        borderRadius="$6"
        borderWidth={1}
        borderColor="$borderColor"
        hoverStyle={{
            backgroundColor: "$content2",
            scale: 1.02
        }}
    >
        <XStack alignItems="flex-start" gap="$4">
            <View
                width={72}
                height={72}
                backgroundColor="$accent7"
                borderRadius="$12"
                alignItems="center"
                justifyContent="center"
            >
                <Text fontSize="$9" fontWeight="bold" color="white">
                    {student.letter}
                </Text>
            </View>

            <YStack flex={1} gap="$3">
                <YStack gap="$1">
                    <Text fontSize="$7" fontWeight="bold" color="$color">
                        {student.name}
                    </Text>
                    <Text fontSize="$5" fontWeight="600" color="$accent7">
                        {student.role}
                    </Text>
                </YStack>

                <Text fontSize="$4" color="$color" opacity={0.8} lineHeight="$5">
                    {student.description}
                </Text>

                <XStack flexWrap="wrap" gap="$2" marginTop="$2">
                    {student.skills.map((skill, index) => (
                        <View
                            key={index}
                            backgroundColor="$accent2"
                            paddingHorizontal="$3"
                            paddingVertical="$2"
                            borderRadius="$4"
                        >
                            <Text fontSize="$2" color="$accent8" fontWeight="500">
                                {skill}
                            </Text>
                        </View>
                    ))}
                </XStack>
            </YStack>
        </XStack>
    </Card>
);