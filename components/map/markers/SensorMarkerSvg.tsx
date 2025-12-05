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
 * Custom comparison function to prevent unnecessary re-renders
 * Only re-render if color or size properties change
 */
const arePropsEqual = (prevProps: SensorMarkerSvgProps, nextProps: SensorMarkerSvgProps): boolean => {
  return (
    prevProps.temperature === nextProps.temperature &&
    prevProps.accentColor === nextProps.accentColor &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.textColor === nextProps.textColor &&
    prevProps.indicatorColor === nextProps.indicatorColor &&
    prevProps.enableAnimations === nextProps.enableAnimations &&
    prevProps.size === nextProps.size
  );
};

/**
 * SVG icon for sensor markers with temperature display
 * Memoized to prevent unnecessary re-renders when parent re-renders
 */
export const SensorMarkerSvg = React.memo(
  ({
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
  ),
  arePropsEqual
);

SensorMarkerSvg.displayName = 'SensorMarkerSvg';

export default SensorMarkerSvg;
