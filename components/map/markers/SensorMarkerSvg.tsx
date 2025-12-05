import React, {useEffect} from 'react';
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
    Path,
} from 'react-native-svg';

import Animated, {
    Easing,
    interpolate,
    useAnimatedProps,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SensorMarkerSvgProps {
    temperature: number | string;
    width?: number;
    height?: number;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    indicatorColor?: string;
    enableAnimations?: boolean;  // Control animations
}

export const SensorMarkerSvg: React.FC<SensorMarkerSvgProps> = ({
                                                                    temperature,
                                                                    width = 96,
                                                                    height = 160,
                                                                    accentColor = '#7db07d',
                                                                    backgroundColor = '#1c1c1c',
                                                                    textColor = 'white',
                                                                    indicatorColor = '#1976D2',
                                                                    enableAnimations = false  // Disabled by default
                                                                }) => {
    const path1T = useSharedValue(0);
    const path2T = useSharedValue(0);
    const pulseT = useSharedValue(0);
    const indicatorT = useSharedValue(0);

    useEffect(() => {
        if (!enableAnimations) {
            path1T.value = 0;
            path2T.value = 0;
            pulseT.value = 0;
            indicatorT.value = 0.6;  // Static indicator visibility
            return;
        }

        const loop = (dur: number) =>
            withRepeat(withTiming(1, {duration: dur, easing: Easing.linear}), -1, false);

        path1T.value = withDelay(700, loop(1800));
        path2T.value = loop(1800);
        pulseT.value = loop(2800);
        indicatorT.value = loop(2800);
    }, [path1T, path2T, pulseT, indicatorT, enableAnimations]);

    const path1AnimatedProps = useAnimatedProps(() => {
        const opacity = interpolate(path1T.value, [0, 0.5, 1], [1, 0.5, 1]);
        return {opacity};
    });

    const path2AnimatedProps = useAnimatedProps(() => {
        const opacity = interpolate(path2T.value, [0, 0.5, 1], [1, 0.5, 1]);
        return {opacity};
    });

    const pulseAnimatedProps = useAnimatedProps(() => {
        const r = interpolate(pulseT.value, [0, 0.5, 1], [26, 32, 26]);
        const opacity = interpolate(pulseT.value, [0, 0.5, 1], [0, 0.5, 0]);
        return {r, opacity};
    });

    const indicatorAnimatedProps = useAnimatedProps(() => {
        const opacity = interpolate(indicatorT.value, [0, 0.5, 1], [0.6, 1, 0.6]);
        return {opacity};
    });

    return (
        <Svg width={width} height={height} viewBox="0 0 96 20">
            <Defs>
                <RadialGradient id="g-accent" cx="50%" cy="45%" r="60%">
                    <Stop offset="0%" stopColor="#7EE3FF" stopOpacity="1"/>
                    <Stop offset="100%" stopColor={accentColor} stopOpacity="1"/>
                </RadialGradient>
                <LinearGradient id="g-dark" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={backgroundColor}/>
                    <Stop offset="100%" stopColor={backgroundColor}/>
                </LinearGradient>
                <Filter id="f-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <FeGaussianBlur stdDeviation="4" result="blur"/>
                    <FeMerge>
                        <FeMergeNode in="blur"/>
                        <FeMergeNode in="SourceGraphic"/>
                    </FeMerge>
                </Filter>
            </Defs>

            <G id="marker-minimal-badge">
                <G id="logo-wrap" transform="translate(32.5,-63)">
                    <AnimatedPath
                        d="M26.3551 0.278339C25.6201 0.675669 25.2823 1.78819 25.5803 2.76166C25.6995 3.17885 25.9181 3.61592 26.0571 3.73512C26.2161 3.85431 27.2491 4.13245 28.3617 4.35098C30.5271 4.78804 31.6198 5.16551 33.5866 6.15883C39.8645 9.31761 44.5132 15.6352 45.4668 22.3302C45.586 23.2043 45.7251 24.1976 45.7847 24.5552C45.9039 25.3896 46.8774 26.2042 47.7118 26.2042C49.7978 26.1843 50.4136 24.4758 49.7382 20.6018C48.4468 13.1916 42.8444 5.8211 35.8315 2.32459C31.9973 0.397537 27.8054 -0.496456 26.3551 0.278339Z"
                        fill={accentColor}
                        stroke="black"
                        strokeWidth="0.5"
                        strokeOpacity=".5"
                        animatedProps={path1AnimatedProps}
                    />
                    <AnimatedPath
                        d="M25.2227 9.27788C24.7061 9.77454 24.6068 10.0527 24.6068 10.7877C24.6068 12.0791 25.1432 12.5956 26.9511 13.0922C31.8184 14.4432 35.2951 18.0986 36.8248 23.5222C37.4208 25.628 37.7784 25.9856 39.1691 26.0055C39.9836 26.0055 40.222 25.9062 40.7385 25.3896C41.3345 24.8135 41.3544 24.7539 41.2352 23.3632C40.9968 20.2839 38.9903 16.3305 36.3083 13.6485C33.5667 10.9069 29.9509 8.97988 27.1497 8.76135C25.8783 8.68188 25.7988 8.70175 25.2227 9.27788Z"
                        fill={accentColor}
                        stroke="black"
                        strokeWidth="0.5"
                        strokeOpacity=".5"
                        animatedProps={path2AnimatedProps}
                    />
                    <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.171017 21.1978C0.469016 20.1647 1.80008 18.7344 2.85301 18.3569C3.50861 18.1185 5.69394 18.0788 15.7862 18.1185L27.9247 18.1582L28.8783 18.7542C29.5935 19.1913 30.0107 19.6482 30.408 20.423L30.9643 21.4759V33.5349C30.9643 41.6405 30.8848 45.8323 30.7458 46.3687C30.4478 47.4812 28.918 48.9116 27.726 49.2096C27.1698 49.3487 25.1036 49.448 22.4415 49.448H18.051L18.0907 63.593L18 97H13C13 97 13.1042 49.9049 13.0843 49.6069C13.0843 49.5275 10.8791 49.448 8.17727 49.4083C3.82648 49.3487 3.17088 49.309 2.55501 48.9712C1.58155 48.4547 0.985549 47.8786 0.50875 46.9647C0.0723831 46.1713 0.0716847 46.0314 0.0123691 34.1484L0.0120839 34.0912C-0.0276494 25.7274 0.0319505 21.7739 0.171017 21.1978ZM18.9847 29.6609C18.4881 29.2239 17.7331 28.7471 17.2961 28.6279C14.8326 27.8928 12.2499 28.9855 11.0381 31.2701C10.4421 32.4025 10.4421 34.707 11.0381 35.8593C12.4486 38.5016 15.6074 39.4552 18.2298 38.0049C21.3886 36.2964 21.766 32.1045 18.9847 29.6609Z"
                        fill="url(#g-dark)"
                        stroke="black"
                        strokeWidth="0.5"
                    />
                    <AnimatedPath
                        d="M18.9847 29.6609C18.4881 29.2239 17.7331 28.7471 17.2961 28.6279C14.8326 27.8928 12.2499 28.9855 11.0381 31.2701C10.4421 32.4025 10.4421 34.707 11.0381 35.8593C12.4486 38.5016 15.6074 39.4552 18.2298 38.0049C21.3886 36.2964 21.766 32.1045 18.9847 29.6609Z"
                        fill={indicatorColor}
                        stroke={indicatorColor}
                        strokeWidth="1"
                        animatedProps={indicatorAnimatedProps}
                    />
                </G>

                <Circle cx="48" cy="48" r="29" fill="url(#g-accent)" opacity="0.35"/>
                <Circle cx="48" cy="48" r="26" fill="url(#g-dark)" stroke="black" strokeWidth="0.5"/>
                <Circle cx="48" cy="48" r="23" fill="url(#g-accent)"/>
                <Circle cx="48" cy="48" r="17" fill="url(#g-dark)" opacity="0.85"/>

                <SvgText
                    x="48"
                    y="54"
                    fontFamily="Arial, sans-serif"
                    fontSize="18"
                    fontWeight="bold"
                    fill={textColor}
                    textAnchor="middle"
                >
                    {temperature}°
                </SvgText>

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

export default SensorMarkerSvg;
