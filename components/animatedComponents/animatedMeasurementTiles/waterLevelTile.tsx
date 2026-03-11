import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { View } from "tamagui";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { BodyText } from "../measurementCard/bodyText";
import { Card } from "../measurementCard/card";
import { ScaleRight } from "../scaleRight";
import { Bubbles } from "../bubbles/bubbles";
import { crestColor, labelForWaterLevel, skyBgColor, waterBgColor, zoneForWaterLevel } from "./tileConfig";
import { CloudSvg } from "../cloud";
import { useTranslation } from "@/hooks/ui/useTranslation";

type Props = {
  levelMeters: number;
  width?: number;
  height?: number;
  minMeters?: number;
  maxMeters?: number;
  tickCount?: number;
  tickStepMeters?: number;
  invertScale?: boolean;
  labelEvery?: number;
  labelDecimals?: number;
  topOffsetPx?: number;
  bottomOffsetPx?: number;
};

const AnimatedView = Animated.createAnimatedComponent(View);

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const snapNearZero = (v: number, eps = 0.005) => (Math.abs(v) < eps ? 0 : v);
const pct = (v: number, min: number, max: number) => (v - min) / (max - min);

export function WaterLevelTile({
  levelMeters,
  width = 360,
  height = 250,
  minMeters = -2,
  maxMeters = 2,
  tickCount = 9,
  tickStepMeters,
  invertScale = false,
  labelEvery = 2,
  labelDecimals = 1,
  topOffsetPx = 12,
  bottomOffsetPx = 0,
}: Props) {
  const {t} = useTranslation('sensors');
  const minSafe = Math.min(minMeters, maxMeters);
  const maxSafe = Math.max(minMeters, maxMeters);

  const computedStep =
    Number.isFinite(tickStepMeters) && (tickStepMeters as number) > 0
      ? (tickStepMeters as number)
      : (maxSafe - minSafe) / Math.max(1, tickCount - 1);

  const SKY_H = Math.round(height * 0.28);
  const WATER_H = height - SKY_H;

  const innerWaterH = Math.max(0, WATER_H - topOffsetPx - bottomOffsetPx);

  const waterLevel = useMemo(
    () => clamp(snapNearZero(levelMeters), minSafe, maxSafe),
    [levelMeters, minSafe, maxSafe]
  );

  const levelP = useSharedValue(pct(waterLevel, minSafe, maxSafe));
  useEffect(() => {
    levelP.value = withTiming(pct(waterLevel, minSafe, maxSafe), {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [waterLevel, minSafe, maxSafe, levelP]);

  const fillStyle = useAnimatedStyle(() => {
    const p = clamp(levelP.value, 0, 1);
    return { height: p * innerWaterH, backgroundColor: waterBgColor };
  });

  const lineStyle = useAnimatedStyle(() => {
    const p = clamp(levelP.value, 0, 1);
    const y = (1 - p) * innerWaterH;
    return { top: y };
  });
  const zone = useMemo(() => zoneForWaterLevel(waterLevel), [waterLevel]);
  const body = (
    <AnimatedView flex={1} style={{ height: WATER_H, width: "100%", justifyContent: "center", backgroundColor: skyBgColor }}>
      <View
        style={{
          flex: 1,
          marginTop: topOffsetPx,
          marginBottom: bottomOffsetPx,
          overflow: "hidden",
        }}
      >
        <View flex={1} flexDirection="row" alignItems="center" justifyContent="center">
          {/* Waterfill*/}
          <AnimatedView style={[styles.fill, fillStyle]} />

          {/* Waterline */}
          <AnimatedView style={[styles.levelLine, lineStyle]} pointerEvents="none" />

          <BodyText
            bodyText={`${waterLevel.toFixed(2)} m`}
            bodyHelperText={labelForWaterLevel(zone, t)}
            bodyStyle={{ position: "absolute", marginTop: 0 }}
          />

          <ScaleRight
            height={innerWaterH}
            min={minSafe}
            max={maxSafe}
            tickStep={computedStep}
            labelEvery={labelEvery}
            decimals={labelDecimals}
            invert={invertScale}
          />


          <Bubbles width={50} />
        </View>
          <View position="absolute" top={0} left={0}>
            <CloudSvg height={30} />
          </View>
      </View>
    </AnimatedView>
  );

  return (
    <Card
      title={t("sensors.waterLevel")}
      value={waterLevel}
      metric={"m"}
      body={body}
      width={width}
      height={height}
      paddingHorizontal={0}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: waterBgColor,
  },

  levelLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: crestColor,
    borderRadius: 999,
  },
});