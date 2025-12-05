import React from 'react';

interface SensorMarkerSvgProps {
  temperature: number | string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  indicatorColor: string;
  enableAnimations?: boolean;
  size?: number;
}

/**
 * SVG icon for sensor markers with temperature display
 */
export const SensorMarkerSvg = ({
  temperature,
  accentColor,
  backgroundColor,
  textColor,
  indicatorColor,
  enableAnimations = true,
  size = 48
}: SensorMarkerSvgProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Outer circle background */}
    <circle cx="24" cy="24" r="22" fill={backgroundColor} stroke={accentColor} strokeWidth="2" />

    {/* Indicator dot */}
    <circle cx="24" cy="8" r="3" fill={indicatorColor} />

    {/* Temperature text - simplified */}
    <text
      x="24"
      y="28"
      textAnchor="middle"
      fontSize="16"
      fontWeight="bold"
      fill={textColor}
    >
      {temperature}°
    </text>
  </svg>
);

export default SensorMarkerSvg;
