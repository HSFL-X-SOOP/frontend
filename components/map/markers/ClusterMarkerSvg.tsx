import React, { useEffect } from 'react';
import Svg, {
  G,
  Circle,
  Text as SvgText,
} from 'react-native-svg';

import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ClusterMarkerSvgProps {
  count: number;
  width?: number;
  height?: number;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  enableAnimations?: boolean;
}

export const ClusterMarkerSvg: React.FC<ClusterMarkerSvgProps> = ({
  count,
  width = 96,
  height = 96,
  accentColor = '#1798db',
  backgroundColor = '#1c1c1c',
  textColor = 'white',
  enableAnimations = false,
}) => {
  const pulseT = useSharedValue(0);

  useEffect(() => {
    if (!enableAnimations) {
      pulseT.value = 0;
      return;
    }

    const loop = (dur: number) =>
      withRepeat(withTiming(1, { duration: dur, easing: Easing.linear }), -1, false);

    pulseT.value = loop(2800);
  }, [pulseT, enableAnimations]);

  const pulseAnimatedProps = useAnimatedProps(() => {
    const r = interpolate(pulseT.value, [0, 0.5, 1], [30, 40, 30]);
    const opacity = interpolate(pulseT.value, [0, 0.5, 1], [0, 0.5, 0]);
    return { r, opacity };
  });

  const displayCount = count > 99 ? '99+' : `${count}+`;

  return (
    <Svg width={width} height={height} viewBox="0 0 96 96">
      <G id="marker-minimal-badge">
        <Circle cx="48" cy="48" r="26" fill={accentColor} opacity="0.35" />
        <Circle cx="48" cy="48" r="34" fill={backgroundColor} />
        <Circle cx="48" cy="48" r="28" fill={accentColor} />
        <Circle cx="48" cy="48" r="20" fill={backgroundColor} opacity="0.85" />

        <G id="logo-wrap">
          <SvgText
            x="48"
            y="54"
            fontFamily="Arial, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill={textColor}
            textAnchor="middle"
          >
            {displayCount}
          </SvgText>
        </G>

        <G id="pulse-min-badge">
          <AnimatedCircle
            cx="48"
            cy="48"
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            animatedProps={pulseAnimatedProps}
          />
        </G>
      </G>
    </Svg>
  );
};
