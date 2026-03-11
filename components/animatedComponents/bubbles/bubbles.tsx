import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { View } from "tamagui"
import { Bubble, BubbleSpec } from "./bubble";

type Props = {
  width?: number;
  height?: number;
  waterHeight?: number;
};


export function Bubbles({
  width = 360,
  height = 250,
  waterHeight = 200,
}: Props) {
  const bubbles: BubbleSpec[] = useMemo(
    () => [
      { size: 10, x: 0.78, delay: 0, duration: 2600, drift: 6 },
      { size: 14, x: 0.86, delay: 650, duration: 3100, drift: 7 },
      { size: 8, x: 0.70, delay: 1200, duration: 2400, drift: 5 },
      { size: 12, x: 0.92, delay: 1700, duration: 3300, drift: 8 },
      { size: 9, x: 0.82, delay: 2100, duration: 2800, drift: 6 },
    ],
    []
  );

  return (
    <View style={[StyleSheet.absoluteFill]} pointerEvents="none">
        {bubbles.map((b, i) => (
            <Bubble
            key={i}
            spec={b}
            width={width}
            waterTop={-50}
            waterHeight={waterHeight}
            />
            ))}
    </View>
  );
}