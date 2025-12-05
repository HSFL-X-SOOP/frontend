import React from 'react';

interface SensorMarkerSvgProps {
  color?: string;
  size?: number;
}

/**
 * SVG icon for sensor markers
 */
export const SensorMarkerSvg = ({ color = '#FF9500', size = 24 }: SensorMarkerSvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="12" r="10" fill={color} />
  </svg>
);

export default SensorMarkerSvg;
