import React, { useMemo } from "react";
import { View } from "tamagui"
import { Bubbles } from "@/components/animatedComponents/bubbles/bubbles";
import { BodyText } from "@/components/animatedComponents/measurementCard/bodyText"
import { Card } from "@/components/animatedComponents/measurementCard/card";
import { labelForWaveHeight, skyBgColor, waterBgColor, waveAnimationDuration, zoneForWaveHeight } from "@/components/animatedComponents/animatedMeasurementTiles/tileConfig";
import { CloudSvg } from "@/components/animatedComponents/cloud";
import { useTranslation } from "@/hooks/ui/useTranslation";
import { AnimatedWaveLevel } from "../wave/animatedWaveLevel";
import { useSharedValue } from "react-native-reanimated";

type Props = {
  waveHeight: number;
  width?: number;
  height?: number;
  duration?: number;
};

export function WaveHeightTile({
  waveHeight,
  width = 360,
  height = 250,
  duration = waveAnimationDuration
}: Props) {
  const {t} = useTranslation('sensors');
  const zone = useMemo(() => zoneForWaveHeight(waveHeight), [waveHeight]);
  const wavePhase = useSharedValue(0);

  const body = (
        <View flex={1} flexDirection="row" height={75} alignItems="center" justifyContent="center" backgroundColor={skyBgColor} position={"absolute"} top={0} left={-20} right={-20} bottom={0}>
            <AnimatedWaveLevel amplitude={waveHeight} duration={duration} width={width} height={75} offsetY={0} levelSV={wavePhase}/>
            <BodyText bodyText={`${waveHeight.toFixed(1)}cm`} bodyHelperText={labelForWaveHeight(zone, t)} bodyStyle={{ position: "absolute", marginTop: 125 }}/>
            <Bubbles />
            <View position="absolute" top={10} left={-30}>
              <CloudSvg height={30} />
            </View>
        </View>
  )

  return (
    <Card 
      title={t("sensors.waveHeight")}
      value={waveHeight}
      metric={"cm"}
      body={body}
      width={width}
      height={height}
    />
  );
}
