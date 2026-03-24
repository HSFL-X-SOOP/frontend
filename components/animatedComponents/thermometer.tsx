import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import Svg, { Rect, Circle, Line, Text as SvgText } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

type Props = {
  temperatureC: number;
  width?: number;
  height?: number;
  style?: any;
  minC?: number;
  maxC?: number;
  text?: React.ReactNode;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function Thermometer({
  temperatureC,
  width = 380,
  height = 200,
  minC = -10,
  maxC = 40,
  style = {},
  text
}: Props) {
  const { minSafe, maxSafe } = useMemo(() => {
    const a = Number.isFinite(minC) ? minC : -10;
    const b = Number.isFinite(maxC) ? maxC : 40;
    return a <= b ? { minSafe: a, maxSafe: b } : { minSafe: b, maxSafe: a };
  }, [minC, maxC]);

  const denom = useMemo(() => {
    return maxSafe === minSafe ? 1 : maxSafe - minSafe;
  }, [minSafe, maxSafe]);

  // --- Layout ---
  const P = 16;
  const thermoW = 52;
  const bulbR = 16;
  const tubeW = 16;

  const thermoH = height - P * 2;

  // Tube geometry
  const thermometerXOffset = 35;
  const tubeX = (thermoW - tubeW) / 2 + thermometerXOffset;
  const tubeTop = 10;
  const tubeBottom = thermoH - bulbR * 2 - 10;
  const tubeH = tubeBottom - tubeTop;

  const bulbCX = thermoW / 2 + thermometerXOffset;
  const bulbCY = tubeBottom + bulbR;

  const scaleGap = 10;
  const scaleW = 54;
  const svgW = thermoW + scaleGap + scaleW;

  const tempClamped = useMemo(
    () => Math.max(minSafe, Math.min(maxSafe, temperatureC)),
    [temperatureC, minSafe, maxSafe]
  );

  const levelTarget = useMemo(() => (tempClamped - minSafe) / denom, [tempClamped, minSafe, denom]);
  const level = useSharedValue(levelTarget);

  useEffect(() => {
    level.value = withTiming(levelTarget, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [levelTarget, level]);

  const liquid = useAnimatedProps(() => {
    const lv = clamp(level.value, 0, 1);
    const h = Math.max(2, tubeH * lv);
    const y = tubeTop + (tubeH - h);
    return { y, height: h} as any;
  });

  const marker = useAnimatedProps(() => {
    const lv = clamp(level.value, 0, 1);
    const y = tubeTop + (tubeH - tubeH * lv);
    return { y1: y, y2: y } as any;
  });

  const { tickStart, tickEnd } = useMemo(() => {
    const start = Math.ceil(minSafe / 5) * 5;
    const end = Math.floor(maxSafe / 5) * 5;
    return { tickStart: start, tickEnd: end };
  }, [minSafe, maxSafe]);

  const majorTicks = useMemo(() => {
    const vals: number[] = [];
    const first = Math.ceil(tickStart / 10) * 10;
    for (let v = first; v <= tickEnd + 1e-9; v += 10) vals.push(v);

    if (minSafe % 10 !== 0) vals.unshift(minSafe);
    if (maxSafe % 10 !== 0 && vals[vals.length - 1] !== maxSafe) vals.push(maxSafe);

    return Array.from(new Set(vals)).sort((a, b) => a - b);
  }, [tickStart, tickEnd, minSafe, maxSafe]);

  const minorTicks = useMemo(() => {
    const vals: number[] = [];
    for (let v = tickStart; v <= tickEnd + 1e-9; v += 5) {
      if (v % 10 !== 0) vals.push(v);
    }
    return vals;
  }, [tickStart, tickEnd]);

  const yForTemp = (t: number) => {
    const lv = (t - minSafe) / denom;
    return tubeTop + (tubeH - tubeH * lv);
  };

  function colorForTemp(t: number) {
  if (t < 16) return "#7DD3FC";
  if (t < 22) return "#34D399";
  return "#FDBA74";
}
const liquidColor = useMemo(() => colorForTemp(tempClamped), [tempClamped]);

  return (
    <View style={[{ width: svgW, height: thermoH }, style]}>
      <Svg width={svgW} height={thermoH}>
        <Rect
          x={tubeX}
          y={tubeTop}
          width={tubeW}
          height={tubeH}
          rx={tubeW / 2}
          fill="rgba(255,255,255,0.22)"
        />

        {/* Liquid */}
        <AnimatedRect animatedProps={liquid} x={tubeX} width={tubeW} rx={tubeW / 2} fill={liquidColor} />

        {/* Bulb */}
        <Circle cx={bulbCX} cy={bulbCY} r={bulbR} fill="rgba(255,255,255,0.22)" />
        <AnimatedCircle cx={bulbCX} cy={bulbCY} r={bulbR - 4} fill={liquidColor}/>
        <Circle cx={bulbCX - 5} cy={bulbCY - 6} r={3} fill="rgba(255,255,255,0.35)" />

        {/* Marker */}
        <AnimatedLine
          animatedProps={marker}
          x1={10 + tubeW + 14}
          x2={15 + tubeW + 18}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {minorTicks.map((v) => {
          const y = yForTemp(v);
          return (
            <Line
              key={`m-${v}`}
              x1={10 + scaleGap}
              x2={10 + scaleGap + 10}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}

        {majorTicks.map((v) => {
          const y = yForTemp(v);
          return (
            <React.Fragment key={`M-${v}`}>
              <Line
                x1={10 + scaleGap}
                x2={10 + scaleGap + 16}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.75)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <SvgText
                x={0}
                y={y + 4}
                fontSize="12"
                fontWeight="700"
                fill="rgba(255,255,255,0.92)"
              >
                {v}°
              </SvgText>
            </React.Fragment>
          );
        })
        }
      </Svg>
      {text && (
        <View style={{ position: "absolute", bottom: 40, left: 100, width: 200, alignItems: "center" }}>
          {text}
        </View>
      )}
    </View>
  );
}
