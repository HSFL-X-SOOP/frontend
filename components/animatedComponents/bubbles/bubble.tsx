import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type BubbleSpec = {
  size: number;
  x: number;
  delay: number;
  duration: number;
  drift: number;
};

export function Bubble({
  spec,
  waterTop,
  waterHeight,
  width,
}: {
  spec: BubbleSpec;
  waterTop: number;
  waterHeight: number;
  width: number;
}) {
  const prog = useSharedValue(0);

  useEffect(() => {
    prog.value = withDelay(
      spec.delay,
      withRepeat(
        withTiming(1, { duration: spec.duration, easing: Easing.inOut(Easing.linear) }),
        -1,
        false
      )
    );
  }, [prog, spec.delay, spec.duration]);

  const style = useAnimatedStyle(() => {
    const y = (1 - prog.value) * (waterHeight + 20) - 10;
    const xDrift = Math.sin(prog.value * Math.PI * 2) * spec.drift;

    const opacity =
      prog.value < 0.12
        ? prog.value / 0.12
        : prog.value > 0.88
          ? (1 - prog.value) / 0.12
          : 1;
    const scale = 1 - prog.value * 0.12;

    return {
      opacity: opacity * 0.55,
      transform: [{ translateX: xDrift }, { translateY: y }, { scale }],
    };
  });

  const left = Math.round(width * spec.x) - spec.size / 2;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          width: spec.size,
          height: spec.size,
          borderRadius: spec.size / 2,
          left: left,
          top: waterTop + waterHeight - spec.size,
          position: "absolute",
          backgroundColor: "rgba(255,255,255,0.10)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.35)",
        },
      ]}
    />
  );
}
