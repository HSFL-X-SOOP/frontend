import {useTranslation} from "@/hooks/ui";
import { getMeasurementIcon, getMeasurementTypeSymbol, getTextFromMeasurementType } from "@/utils/measurements";
import { Card, H4, Text, useMedia, XStack, YStack } from "tamagui";
type MeasurementCardProps = {
    measurementType: string,
    value: string,
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({measurementType, value}) => {
    const media = useMedia();
    const {t} = useTranslation();

    return (
        <Card
            bordered
            animation="quick"
            scale={0.99}
            hoverStyle={{scale: 1}}
            pressStyle={{scale: 0.98}}
            backgroundColor="$background"
            width={media.lg ? 180 : media.md ? 160 : 140}
            height={100}
        >
            <Card.Header padded>
                <XStack gap="$2" alignItems="center" justifyContent="center">
                    {getMeasurementIcon(measurementType, 24)}
                    <YStack alignItems="center">
                        <Text fontSize="$1" color="$gray11" textAlign="center">
                            {getTextFromMeasurementType(measurementType, t)}
                        </Text>
                        <XStack alignItems="baseline" gap="$1">
                            <H4 fontSize="$6" color="$blue10">
                                {value}
                            </H4>
                            <Text fontSize="$3" color="$gray10">
                                {getMeasurementTypeSymbol(measurementType, t)}
                            </Text>
                        </XStack>
                    </YStack>
                </XStack>
            </Card.Header>
        </Card>
    );
}