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
  }: SensorMarkerSvgProps) => {
    // Format temperature string
    const tempString = typeof temperature === 'number' ? Math.round(temperature).toString() : String(temperature);

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer circle background with shadow */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill={backgroundColor}
          stroke={accentColor}
          strokeWidth="2"
          filter="url(#shadow)"
        />

        {/* Inner circle for depth */}
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.5"
          opacity="0.5"
        />

        {/* Indicator dot at top */}
        <circle
          cx="24"
          cy="8"
          r="2.5"
          fill={indicatorColor}
        />

        {/* Temperature text with background for readability */}
        <rect
          x="14"
          y="18"
          width="20"
          height="16"
          rx="4"
          fill={backgroundColor}
          opacity="0.9"
        />

        {/* Temperature value */}
        <text
          x="24"
          y="30"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fontWeight="700"
          fill={textColor}
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {tempString}°
        </text>
      </svg>
    );
  },
  arePropsEqual
);

SensorMarkerSvg.displayName = 'SensorMarkerSvg';

export default SensorMarkerSvg;
