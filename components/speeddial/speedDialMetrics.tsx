import 'maplibre-gl/dist/maplibre-gl.css';
import * as React from 'react';
import {useState} from 'react';
import {useTranslation} from '@/hooks/ui';
import {Plus} from '@tamagui/lucide-icons';
import {getMeasurementIcon} from '../map/sensors/MapSensorMeasurements';
import { Pressable } from 'react-native'
import { AnimatePresence, Button, Text, useTheme, XStack, YStack } from 'tamagui'
import {
  X
} from '@tamagui/lucide-icons'    

type Action = {
  key: string
  label: string
  onPress: () => void
}

type SpeedDialMetricsProps = {
  selectedValue?: string
  actions?: Action[]
}

export function SpeedDialMetrics({
  selectedValue = 'Wasserstand',
  actions,
}: SpeedDialMetricsProps) {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();   
  const theme = useTheme();
  const items: Action[] =
    actions ?? [
    ]

  const handleActionPress = (action: Action) => {
    setOpen(false)
    action.onPress()
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <YStack
            fullscreen
            zIndex={999}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            opacity={1}
            animation="quick"
          >
            <Pressable
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)' }}
              onPress={() => setOpen(false)}
            />
          </YStack>
        )}
      </AnimatePresence>

      <YStack
        position="absolute"
        right={100}
        bottom={25}
        zIndex={1000}
        alignItems="flex-end"
        gap="$3"
      >
        <AnimatePresence>
          {open && (
            <YStack gap="$2.5" marginBottom="$1" alignItems="flex-end">
              {items.map((action) => {

                return (
                  <Button
                    key={action.key}
                    width={220}
                    height={48}
                    borderRadius="$6"
                    justifyContent="flex-start"
                    backgroundColor="$background"
                    borderWidth={1}
                    borderColor="$borderColor"
                    shadowColor="$shadowColor"
                    shadowOpacity={0.12}
                    shadowRadius={10}
                    elevation={3}
                    enterStyle={{ opacity: 0, y: 10 }}
                    exitStyle={{ opacity: 0, y: 10 }}
                    opacity={1}
                    y={0}
                    animation="quick"
                    onPress={() => handleActionPress(action)}
                    pressStyle={{ opacity: 0.9, scale: 0.98 }}
                  >
                    <XStack alignItems="center" gap="$3" width="100%">
                      {getMeasurementIcon(action.label).icon}
                      <Text flex={1} fontSize="$3" fontWeight="600">
                        {t('sensor.'+action.label)}
                      </Text>
                    </XStack>
                  </Button>
                )
              })}
            </YStack>
          )}
        </AnimatePresence>

        <Button
          height={56}
          minWidth={220}
          borderRadius="$8"
          paddingHorizontal="$4"
          backgroundColor={"$background"}//"rgba(255,255,255,0.2)"
          color="white"
          shadowColor="$shadowColor"
          shadowOpacity={0.22}
          shadowRadius={14}
          elevation={6}
          onPress={() => setOpen((v) => !v)}
          pressStyle={{ opacity: 0.9, scale: 0.98 }}
        >
          <XStack alignItems="center" gap="$3" width="100%">
                {getMeasurementIcon(selectedValue).icon}
            <Text fontWeight="700" flex={1} numberOfLines={1}>
                {t('sensor.' + selectedValue)}
            </Text>


          </XStack>
        </Button>
      </YStack>
    </>
  )
}