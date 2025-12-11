import { PopoverProps , YStack, Popover, Button, TextArea, Text, XStack, Label, Sheet, Adapt, Input } from "tamagui";
import { useState, useCallback } from 'react';
import { useNotificationLocations } from '@/hooks/ui/useNotificationLocations';


export function HarborMasterBroadcastNotificationPopover({
  Icon,
  Name,
  shouldAdapt,
  userID,
  marinaID,
  t,
  ...props
}: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean; userID?: number | null; marinaID?: number | null, t: any}) {
    const [notificationTitle, setNotificationTitle] = useState<string>('');
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const notificationLocations = useNotificationLocations();

    const createNotificationLocation = useCallback(async () => {
        if (!marinaID) return;

        const notificationLocation = {
            locationId: marinaID,
            notificationTitle: notificationTitle,
            notificationText: notificationMessage,
            createdBy: userID || -1,
        }
        await notificationLocations.create(notificationLocation);
    }, [marinaID, notificationTitle, notificationMessage, userID, notificationLocations]);

    return (
    <Popover size="$5" allowFlip stayInFrame offset={15} resize {...props}>
      <Popover.Trigger asChild>
        <Button 
            size="$5"
            variant="outlined"
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
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>
      )}

      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        width={300}
        height={275}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

        <YStack gap="$3">
            <XStack>
                <Text fontSize="$6" fontWeight="600">{Name}</Text>
            </XStack>
            <XStack gap="$3">
                <Label size="$3" htmlFor={"Title"}>
                {t('harbor.title')}
                </Label>
                <Input f={1} size="$3" id={"Title"} onChangeText={(text) => setNotificationTitle(text)} />
                
            </XStack>

            <XStack gap="$3">
                <Label size="$3" htmlFor={"Message"}>
                {t('harbor.message')}
                </Label>
                <TextArea f={1} size="$3" id={"Message"} onChangeText={(text) => setNotificationMessage(text)} />
            </XStack>


          <Popover.Close asChild>
            <Button
              size="$3"
              onPress={() => {
                if (!marinaID) {
                  return;
                }
                createNotificationLocation();
              }}
            >
              {t('harbor.sendToAllSubscribers')}
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}