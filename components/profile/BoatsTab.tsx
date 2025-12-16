import React from 'react';
import {
    YStack,
    Card,
    H4,
    Text,
    Button,
    View
} from 'tamagui';
import {Anchor} from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/ui';

export const BoatsTab: React.FC = () => {
    const {t} = useTranslation();

    return (
        <YStack gap="$4">
            <Card elevate backgroundColor="$content1" borderRadius="$6" padding="$5"
                  borderWidth={1} borderColor="$borderColor">
                <YStack gap="$4" alignItems="center" paddingVertical="$6">
                    <View
                        width={80}
                        height={80}
                        backgroundColor="$accent2"
                        borderRadius="$10"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Anchor size={40} color="$accent7"/>
                    </View>
                    <YStack gap="$2" alignItems="center">
                        <H4 color="$accent7" fontFamily="$oswald">
                            {t('profile.boats.title')}
                        </H4>
                        <Text color="$color" opacity={0.7} textAlign="center">
                            {t('profile.boats.noBoats')}
                        </Text>
                    </YStack>
                    <Button
                        size="$4"
                        backgroundColor="$accent7"
                        color="white"
                        pressStyle={{backgroundColor: "$accent6"}}
                        hoverStyle={{backgroundColor: "$accent4"}}
                        icon={<Anchor size={16}/>}
                    >
                        {t('profile.boats.addBoat')}
                    </Button>
                </YStack>
            </Card>
        </YStack>
    );
};