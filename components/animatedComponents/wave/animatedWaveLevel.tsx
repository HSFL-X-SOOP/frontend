import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation
} from "react-native-reanimated";
import { waterBgColor, crestColor } from "@/components/animatedComponents/animatedMeasurementTiles/tileConfig";
import { buildTileableSineFillPath, buildTileableSineLinePath } from "./waveSineUtils";
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedView = Animated.createAnimatedComponent(View);

export interface AnimatedWaveLevelProps {
  width: number;
  height: number;
  amplitude?: number | undefined;
  duration?: number;
  cyclesPerTile?: number;
  levelSV: SharedValue<number>;
  offsetY?: number;
  waterColor?: string;
  showCrestLine?: boolean;
  crestColor?: string;
  crestWidth?: number;
  phaseSV?: SharedValue<number>;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export interface AnimatedWaveLevelProps {
  width: number;
  height: number;
  topOffset?: number;
  bottomOffset?: number;
  amplitude?: number;
  duration?: number;
  cyclesPerTile?: number;
  levelSV: SharedValue<number>;
  waterColor?: string;
  showCrestLine?: boolean;
  crestWidth?: number;
  phaseSV?: SharedValue<number>;
}

export function AnimatedWaveLevel({
  width,
  height,
  topOffset = 0,
  bottomOffset = 0,
  amplitude = 0,
  duration = 1600,
  cyclesPerTile = 2,
  levelSV,
  waterColor = waterBgColor,
  showCrestLine = true,
  crestWidth = 3,
  phaseSV,
}: AnimatedWaveLevelProps) {
  const t = phaseSV ?? useSharedValue(0);
  const innerH = Math.max(0, height - topOffset - bottomOffset);
  const drawWidth = width * 2;

  useEffect(() => {
    const flat = Math.abs(amplitude) <= 0.001;

    cancelAnimation(t);
    t.value = 0;

    if (!flat) {
      t.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);
    }

    return () => cancelAnimation(t);
  }, [amplitude, duration, t]);

  const waveStyle = useAnimatedStyle(() => {
    const flat = Math.abs(amplitude) <= 0.001;
    const tx = flat ? 0 : Math.round(-width * t.value);
    return {
      transform: [{ translateX: tx }],
      position: "absolute",
      left: 0,
      top: 0,
    };
  }, [amplitude, width]);

  const fillAnimatedProps = useAnimatedProps(() => {
    const safeLevel = clamp01(levelSV.value);
    const waterLevelY = (1 - safeLevel) * innerH;

    const animatedWaterFill = buildTileableSineFillPath(
      drawWidth,
      innerH,
      amplitude,
      Math.round(cyclesPerTile),
      width,
      waterLevelY
    );

    return { d: animatedWaterFill };
  });

  const lineAnimatedProps = useAnimatedProps(() => {
    const safeLevel = clamp01(levelSV.value);
    const waterLevelY = (1 - safeLevel) * innerH;

    const animatedWaterLine = buildTileableSineLinePath(
      drawWidth,
      amplitude,
      Math.round(cyclesPerTile),
      width,
      waterLevelY
    );

    return { d: animatedWaterLine };
  });

  return (
    <View style={{ width, height, overflow: "hidden" }}>
      <View style={{ position: "absolute", left: 0, right: 0, top: topOffset, height: innerH, overflow: "hidden" }}>
        <AnimatedView style={[{ width: drawWidth, height: innerH }, waveStyle]}>
          <Svg width={drawWidth} height={innerH}>
            <AnimatedPath animatedProps={fillAnimatedProps} fill={waterColor} />
            {showCrestLine ? (
              <AnimatedPath
                animatedProps={lineAnimatedProps}
                fill="none"
                stroke={crestColor}
                strokeWidth={crestWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
          </Svg>
        </AnimatedView>
      </View>
    </View>
  );
}