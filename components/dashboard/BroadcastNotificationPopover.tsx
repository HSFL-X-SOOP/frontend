import {useState, useCallback} from 'react';
import {
    Adapt,
    Input,
    Label,
    Popover,
    PopoverProps,
    Sheet,
    Text,
    TextArea,
    XStack,
    YStack
} from 'tamagui';
import {useNotificationLocations} from '@/hooks/ui';
import {PrimaryButton, PrimaryButtonText, SecondaryButton} from '@/types/button';

interface BroadcastNotificationPopoverProps extends PopoverProps {
    Icon?: any;
    Name?: string;
    shouldAdapt?: boolean;
    userID?: number | null;
    marinaID?: number | null;
    t: any;
}

export function BroadcastNotificationPopover({
    Icon,
    Name,
    shouldAdapt,
    userID,
    marinaID,
    t,
    ...props
}: BroadcastNotificationPopoverProps) {
    const [notificationTitle, setNotificationTitle] = useState<string>('');
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const notificationLocations = useNotificationLocations();

    const handleSend = useCallback(async () => {
        if (!marinaID) return;

        const notificationLocation = {
            locationId: marinaID,
            notificationTitle: notificationTitle,
            notificationText: notificationMessage,
            createdBy: userID || -1,
        };
        await notificationLocations.create(notificationLocation);
    }, [marinaID, notificationTitle, notificationMessage, userID, notificationLocations]);

    return (
        <Popover size="$5" allowFlip stayInFrame offset={15} resize {...props}>
            <Popover.Trigger asChild>
                <SecondaryButton
                    size="$5"
                    icon={Icon}
                    circular
                />
            </Popover.Trigger>

            {shouldAdapt && (
                <Adapt platform="touch">
                    <Sheet animation="medium" modal dismissOnSnapToBottom>
                        <Sheet.Frame padding="$4">
                            <Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                            backgroundColor="$shadowColor"
                            animation="lazy"
                            enterStyle={{opacity: 0}}
                            exitStyle={{opacity: 0}}
                        />
                    </Sheet>
                </Adapt>
            )}

            <Popover.Content
                borderWidth={1}
                borderColor="$borderColor"
                width={300}
                height={275}
                enterStyle={{y: -10, opacity: 0}}
                exitStyle={{y: -10, opacity: 0}}
                elevate
                animation={['quick', { opacity: { overshootClamping: true } }]}
            >
                <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

                <YStack gap="$3">
                    <XStack>
                        <Text fontSize="$6" fontWeight="600">{Name}</Text>
                    </XStack>

                    <XStack gap="$3">
                        <Label size="$3" htmlFor="Title">
                            {t('harbor.title')}
                        </Label>
                        <Input
                            f={1}
                            size="$3"
                            id="Title"
                            onChangeText={setNotificationTitle}
                        />
                    </XStack>

                    <XStack gap="$3">
                        <Label size="$3" htmlFor="Message">
                            {t('harbor.message')}
                        </Label>
                        <TextArea
                            f={1}
                            size="$3"
                            id="Message"
                            onChangeText={setNotificationMessage}
                        />
                    </XStack>

                    <Popover.Close asChild>
                        <PrimaryButton
                            size="$3"
                            onPress={() => {
                                if (!marinaID) return;
                                handleSend();
                            }}
                        >
                            <PrimaryButtonText>
                                {t('harbor.sendToAllSubscribers')}
                            </PrimaryButtonText>
                        </PrimaryButton>
                    </Popover.Close>
                </YStack>
            </Popover.Content>
        </Popover>
    );
}
