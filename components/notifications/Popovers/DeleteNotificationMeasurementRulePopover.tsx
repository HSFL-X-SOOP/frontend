import { H4, PopoverProps } from "tamagui";
import { useState } from "react";
import { useNotificationMeasurementRules } from "@/hooks/ui/useNotificationMeasurementRules";
import { NotificationMeasurementRule } from "@/api/models/notificationMeasurementRule";
import { YStack, Dialog, Button, Text } from "tamagui";

export function DeleteNotificationMeasurementRulePopover({
  Icon,
  Name,
  shouldAdapt,
  notification,
  fetchNotifications,
  t,
  ...props
}: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean; notification: NotificationMeasurementRule, t: any, fetchNotifications: () => void }) {
    const [open, setOpen] = useState(false)
    const notifications = useNotificationMeasurementRules();
    return (
        <Dialog
        allowFlip
        stayInFrame
        offset={15}
        {...props}
        open={open}
        onOpenChange={setOpen}
        >
            <Dialog.Trigger asChild>
                <Button icon={Icon} onPress={() => setOpen(true)} />
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay 
                onPress={() => setOpen(false)} 
                backgroundColor="rgba(0,0,0,0.3)" 
                />

                <Dialog.Content
                key={`${notification.id}-${notification.measurementTypeId}`}
                borderWidth={1}
                borderColor="$borderColor"
                elevate
                p="$4"
                maxWidth="90%"
                width="100%"
                borderRadius="$6"
                animation={[
                    'quick',
                    {
                    opacity: { overshootClamping: true },
                    },
                ]}
                enterStyle={{ opacity: 0, scale: 0.95 }}
                exitStyle={{ opacity: 0, scale: 0.95 }}
                >

                <YStack gap="$4" alignItems="center">
                    <H4 color="$accent7" fontFamily="$oswald">{t('dashboard.measurements.deleteConfirmText')}</H4>
                    <Dialog.Close asChild>
                        <Button
                            size="$4"
                            backgroundColor="$accent7"
                            color="white"
                            onPress={() => {
                            notifications.deleteNotificationMeasurementRule(notification.id)
                                .then(async () => {
                                    await fetchNotifications();
                                });
                            }}
                        >
                            {t('dashboard.measurements.delete')}
                        </Button>
                    </Dialog.Close>
                
                </YStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
  )
}