import { useEffect, useMemo, useState, useCallback } from "react";
import { StyleSheet, LayoutChangeEvent } from "react-native";
import { View } from "tamagui";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Bubbles } from "@/components/animatedComponents/bubbles/bubbles";
import { Card } from "../measurementCard/card";
import { Thermometer } from "../thermometer";
import { ScaleRight } from "../scaleRight";
import { AnimatedWaveLevel } from "@/components/animatedComponents/wave/animatedWaveLevel";
import { FloatingBoat } from "../floatingBoat";
import { labelForWaterTemperature, skyBgColor, waterBgColor, waveAnimationDuration, zoneForWaterTemperature } from "./tileConfig";
import { CloudSvg } from "../cloud";
import { BodyText } from "../measurementCard/bodyText";
import { useTranslation } from "@/hooks/ui/useTranslation";

type Props = {
  levelMeters?: number;
  temperatureC?: number;
  waveAmplitude?: number;
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  aspectRatio?: number;
  minMeters?: number;
  maxMeters?: number;
  tickCount?: number;
  tickStepMeters?: number;
  invertScale?: boolean;
  labelEvery?: number;
  labelDecimals?: number;
};

const AnimatedView = Animated.createAnimatedComponent(View);

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const snapNearZero = (v: number, eps = 0.005) => (Math.abs(v) < eps ? 0 : v);
const pct = (v: number, min: number, max: number) => (v - min) / (max - min);

export function CombinedTile({
  levelMeters,
  temperatureC,
  waveAmplitude,

  width,
  height,

  minWidth = 320,
  maxWidth = 980,
  aspectRatio = 2.0,

  minMeters = -2,
  maxMeters = 2,
  tickCount = 9,
  tickStepMeters,

  invertScale = false,
  labelEvery = 2,
  labelDecimals = 1,
}: Props) {

  const {t} = useTranslation('sensors');
  const minSafe = Math.min(minMeters, maxMeters);
  const maxSafe = Math.max(minMeters, maxMeters);

  const wavePhase = useSharedValue(0);

  const computedStep =
    Number.isFinite(tickStepMeters) && (tickStepMeters as number) > 0
      ? (tickStepMeters as number)
      : (maxSafe - minSafe) / Math.max(1, tickCount - 1);

  const [cardW, setCardW] = useState<number>(0);
  const onCardLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setCardW((prev) => (Math.abs(prev - w) > 1 ? w : prev));
  }, []);

  const baseW = typeof width === "number" ? width : cardW > 0 ? cardW : minWidth;
  const resolvedW = clamp(baseW, minWidth, maxWidth);

  const resolvedH = typeof height === "number" ? height : Math.round(resolvedW / aspectRatio);

  const headerRatio = 0.15;
  const SKY_H = Math.round(resolvedH * headerRatio);
  const WATER_H = resolvedH - SKY_H;

  const clamped = useMemo(
    () => clamp(snapNearZero(levelMeters ?? 0), minSafe, maxSafe),
    [levelMeters, minSafe, maxSafe]
  );

  const levelP = useSharedValue(pct(clamped, minSafe, maxSafe));
  useEffect(() => {
    levelP.value = withTiming(pct(clamped, minSafe, maxSafe), {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, minSafe, maxSafe, levelP]);

  const [waterW, setWaterW] = useState<number>(0);
  const onWaterLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWaterW((prev) => (Math.abs(prev - w) > 1 ? w : prev));
  }, []);

  const pad = Math.round(resolvedW * 0.03);
  const thermoW = Math.round(resolvedW * 0.12);
  const thermoH = Math.round(resolvedH * 0.36);

  const boatSize = Math.round(resolvedW * 0.16);
  const bubblesW = Math.round(resolvedW * 0.9);

  const thermoLeft = pad;
  const thermoTop = Math.max(0, WATER_H - thermoH - pad);

  const zone = useMemo(() => zoneForWaterTemperature(temperatureC ?? 0), [temperatureC]);

  const thermometerText = (
        <BodyText
          bodyText={`${temperatureC?.toFixed(2)} °C`}
          bodyHelperText={labelForWaterTemperature(zone, t)}
        />);

  const body = (
    <AnimatedView flex={1} style={{ height: WATER_H, width: "100%", justifyContent: "center", backgroundColor: skyBgColor }}>
      <View
        flex={1}
        onLayout={onWaterLayout}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={pad}
      >

        {waterW > 0 ? (
          <View style={StyleSheet.absoluteFill}>
              <AnimatedWaveLevel
              width={waterW}
              height={WATER_H}
              amplitude={waveAmplitude ?? 0}
              duration={waveAnimationDuration}
              cyclesPerTile={2}
              levelSV={levelP}
              waterColor={waterBgColor}
              showCrestLine={true}
              crestWidth={Math.max(2, Math.round(resolvedW * 0.003))}
              phaseSV={wavePhase}
              topOffset={50}
              />
          </View>
        ) : null}

        {waterW > 0 ? (
          <FloatingBoat
            containerWidth={waterW}
            containerHeight={WATER_H}
            amplitude={waveAmplitude ?? 0}
            cyclesPerTile={2}
            levelSV={levelP}
            phaseSV={wavePhase}
            image={require("@/assets/images/boat.png")}
            boatWidth={boatSize+100}
            boatHeight={boatSize+100}
            xBoatPositionRatio={0.5}
            waterlineOffsetPx={Math.round(resolvedH * 0.004)}
            rotationDamping={0.6}
            topOffset={50}
          />
        ) : null}

        {temperatureC !== undefined && (
            <Thermometer
            temperatureC={temperatureC}
            width={thermoW}
            height={180}
            minC={-10}
            maxC={40}
            style={{
              left: thermoLeft,
              position: "absolute",
              top: thermoTop,
            }}
            text={thermometerText}
            />
        )}

        {levelMeters !== undefined && (
          <ScaleRight
          height={WATER_H}
          min={minSafe}
          max={maxSafe}
          tickStep={computedStep}
          labelEvery={labelEvery}
          decimals={labelDecimals}
          invert={invertScale}
          topOffset={50}
          />
        )}

        <View position="absolute" top={0} left={50}>
          <CloudSvg />
        </View>

        <Bubbles width={bubblesW} waterHeight={WATER_H / 1.5}/>
      </View>
    </AnimatedView>
  );

  return (
    <View flex={1} onLayout={onCardLayout} justifyContent="center" alignItems="center">
      <Card
        title={""}
        value={clamped}
        metric={"m"}
        body={body}
        width={resolvedW}
        height={resolvedH}
        paddingHorizontal={0}
        headerRatio={headerRatio}
      />
    </View>
  );
}