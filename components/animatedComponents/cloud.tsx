import React from "react";
import Svg, { Path } from "react-native-svg";

type CloudSvgProps = {
  width?: number;
  height?: number;
  fill?: string;
  shadowFill?: string;
  shadowOffsetY?: number;
  opacity?: number;
};

export function CloudSvg({
  width = 160,
  height = 100,
  fill = "#FFFFFF",
  shadowFill = "rgba(0,0,0,0.12)",
  shadowOffsetY = 4,
  opacity = 1,
}: CloudSvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 120" opacity={opacity}>
      {/* Soft shadow */}
      <Path
        d="M62 92c-15 0-27-10-27-23 0-12 10-22 23-23 4-15 18-26 35-26 14 0 27 7 33 19 2-1 6-2 10-2 16 0 29 12 29 27 0 15-13 28-29 28H62z"
        fill={shadowFill}
        transform={`translate(0 ${shadowOffsetY})`}
      />
      {/* Cloud */}
      <Path
        d="M60 90c-16 0-29-11-29-25 0-13 11-24 25-25 4-17 20-30 39-30 16 0 31 8 38 22 3-2 7-3 12-3 18 0 33 14 33 31 0 17-15 30-33 30H60z"
        fill={fill}
      />
    </Svg>
  );
}