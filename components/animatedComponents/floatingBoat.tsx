import React from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

interface FloatingBoatProps {
  containerWidth: number;
  containerHeight: number;
  amplitude: number;
  cyclesPerTile: number;
  levelSV: SharedValue<number>;
  phaseSV: SharedValue<number>;
  image: any;
  boatWidth?: number;
  boatHeight?: number;
  xBoatPositionRatio?: number;
  waterlineOffsetPx?: number;
  rotationDamping?: number;
  topOffset?: number;
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function FloatingBoat({
  containerWidth,
  containerHeight,
  amplitude,
  cyclesPerTile,
  levelSV,
  phaseSV,
  image,
  boatWidth = 72,
  boatHeight = 36,
  xBoatPositionRatio = 0.5,
  waterlineOffsetPx = 0,
  rotationDamping = 0.6,
  topOffset = 0,
  bottomOffset = 0,
  style,
}: FloatingBoatProps) {
  const k = (Math.PI * 2 * cyclesPerTile) / containerWidth;
  const anchorX = 0.5;
  const anchorY = 0.78;

  const animatedStyle = useAnimatedStyle(() => {
    const level = clamp01(levelSV.value);
    const waterArea = Math.max(0, containerHeight - topOffset - bottomOffset);
    const waterLevel = (1 - level) * waterArea;
    const boatXPosition = containerWidth * xBoatPositionRatio;
    const wavePhase = phaseSV.value * containerWidth;
    const waveHeight =  waterLevel + amplitude * Math.sin(k * (boatXPosition + wavePhase));
    const boatYPosition = topOffset + waveHeight;

    // Rotation aus Steigung
    const slope = amplitude * k * Math.cos(k * (boatXPosition + wavePhase));
    const rotation = Math.atan(slope) * rotationDamping;

    const left = boatXPosition - boatWidth * anchorX;
    const top = boatYPosition - boatHeight * anchorY + waterlineOffsetPx;

    return {
      position: "absolute",
      left,
      top,
      transform: [{ rotate: `${rotation}rad` }],
    };
  }, [containerWidth, containerHeight, topOffset, bottomOffset, boatWidth, boatHeight, xBoatPositionRatio, anchorX, anchorY, amplitude, cyclesPerTile, waterlineOffsetPx, rotationDamping]);

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Image source={image} style={{ width: boatWidth, height: boatHeight, resizeMode: "contain" }} />
    </Animated.View>
  );
}