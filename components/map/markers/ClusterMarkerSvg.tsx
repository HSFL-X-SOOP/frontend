import React, { useEffect } from 'react';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Filter,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
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
  enableAnimations?: boolean;
}

export const ClusterMarkerSvg: React.FC<ClusterMarkerSvgProps> = ({
  count,
  width = 96,
  height = 96,
  accentColor = '#7db07d',
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
      <Defs>
        <RadialGradient id="g-accent" cx="50%" cy="45%" r="60%">
          <Stop offset="0%" stopColor="#7EE3FF" stopOpacity="1" />
          <Stop offset="100%" stopColor={accentColor} stopOpacity="1" />
        </RadialGradient>
        <LinearGradient id="g-dark" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#111111" />
          <Stop offset="100%" stopColor="#000000" />
        </LinearGradient>
        <Filter id="f-glow" x="-50%" y="-50%" width="200%" height="200%">
          <FeGaussianBlur stdDeviation="4" result="blur" />
          <FeMerge>
            <FeMergeNode in="blur" />
            <FeMergeNode in="SourceGraphic" />
          </FeMerge>
        </Filter>
      </Defs>

      <G id="marker-minimal-badge">
        <Circle cx="48" cy="48" r="26" fill="url(#g-accent)" opacity="0.35" />
        <Circle cx="48" cy="48" r="34" fill="url(#g-dark)" />
        <Circle cx="48" cy="48" r="28" fill="url(#g-accent)" />
        <Circle cx="48" cy="48" r="20" fill="url(#g-dark)" opacity="0.85" />

        <G id="logo-wrap">
          <SvgText
            x="48"
            y="54"
            fontFamily="Arial, sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="white"
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
