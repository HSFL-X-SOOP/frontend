import React from 'react';
import { Svg, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function GpsPin({ size = 48 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ff5a5f" />
          <Stop offset="1" stopColor="#ff393e" />
        </LinearGradient>
      </Defs>

      {/* Drop shadow */}
      <Circle cx="32" cy="55" r="6" fill="rgba(0,0,0,0.2)" />

      {/* Pin shape */}
      <Path
        d="M32 2C19 2 9 12.5 9 25.5C9 42 32 62 32 62C32 62 55 42 55 25.5C55 12.5 45 2 32 2Z"
        fill="url(#grad)"
      />

      {/* inner white circle */}
      <Circle cx="32" cy="26" r="10" fill="white" />
    </Svg>
  );
}