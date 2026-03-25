import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import { View } from "tamagui"
import { Bubbles } from "@/components/animatedComponents/bubbles/bubbles";
import { BodyText } from "@/components/animatedComponents/measurementCard/bodyText"
import { Card } from "@/components/animatedComponents/measurementCard/card";
import { labelForWaveHeight, skyBgColor, waveAnimationDuration, zoneForWaveHeight } from "@/components/animatedComponents/animatedMeasurementTiles/tileConfig";
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
  const waveCorrection = 3;

  const [waveW, setWaveW] = useState(0);
  const [waveH, setWaveH] = useState(0);
  const onWaveLayout = useCallback((e: LayoutChangeEvent) => {
    const { width: nextW, height: nextH } = e.nativeEvent.layout;
    setWaveW((prev) => (Math.abs(prev - nextW) > 1 ? nextW : prev));
    setWaveH((prev) => (Math.abs(prev - nextH) > 1 ? nextH : prev));
  }, []);

  const visualAmplitude = useMemo(() => Math.max(2, Math.min(200, waveHeight * 0.35)) / waveCorrection, [waveHeight]);

  const waveLevel = useSharedValue(0.55);
  const wavePhase = useSharedValue(0);

  const body = (
      <View flex={1} onLayout={onWaveLayout} flexDirection="row" alignItems="center" justifyContent="center" backgroundColor={skyBgColor} position={"absolute"} top={0} left={0} right={0} bottom={0}>
            {waveW > 0 && waveH > 0 ? (
              <View style={StyleSheet.absoluteFill}>
                <AnimatedWaveLevel amplitude={visualAmplitude} duration={duration} width={waveW} height={waveH} levelSV={waveLevel} phaseSV={wavePhase}/>
              </View>
            ) : null}
            <BodyText bodyText={`${waveHeight.toFixed(1)}cm`} bodyHelperText={labelForWaveHeight(zone, t)} bodyStyle={{ position: "absolute", marginTop: 15 }}/>
            <Bubbles width={waveW > 0 ? waveW : width} waterHeight={waveH > 0 ? waveH : 120} />
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
      paddingHorizontal={0}
      bodyBackgroundColor={skyBgColor}
    />
  );
}
