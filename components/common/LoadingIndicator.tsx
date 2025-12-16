import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import {useTheme} from 'tamagui';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LoadingIndicatorProps {
    size?: number;
    color?: string;
}

const MARKER_VIEWBOX = {width: 50, height: 97};
const DEFAULT_MARKER_COLOR = '#252B5C';
const PING_CENTER = {x: 25, y: 27};
const PING_RADIUS = {min: 12, max: 24};

const hexToRgba = (hex: string, alpha: number) => {
    const sanitized = hex.replace('#', '');
    if (sanitized.length !== 6) {
        return `rgba(37, 43, 92, ${alpha})`;
    }

    const value = parseInt(sanitized, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({size = 120, color}) => {
    const theme = useTheme();
    const markerColor =
        color ?? theme?.accentColor?.get?.() ?? theme?.color?.get?.() ?? DEFAULT_MARKER_COLOR;
    const pingColor = useMemo(() => hexToRgba(markerColor, 0.2), [markerColor]);

    const firstPing = useRef(new Animated.Value(0)).current;
    const secondPing = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const buildPing = (animation: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: 1400,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: false
                    }),
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: false
                    })
                ])
            );

        const pingOne = buildPing(firstPing, 0);
        const pingTwo = buildPing(secondPing, 450);

        pingOne.start();
        pingTwo.start();

        return () => {
            pingOne.stop();
            pingTwo.stop();
            firstPing.stopAnimation();
            secondPing.stopAnimation();
        };
    }, [firstPing, secondPing]);

    const animatedRadiusOne = firstPing.interpolate({
        inputRange: [0, 1],
        outputRange: [PING_RADIUS.min, PING_RADIUS.max]
    });
    const animatedRadiusTwo = secondPing.interpolate({
        inputRange: [0, 1],
        outputRange: [PING_RADIUS.min, PING_RADIUS.max]
    });
    const animatedOpacityOne = firstPing.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.28, 0.16, 0]
    });
    const animatedOpacityTwo = secondPing.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.28, 0.16, 0]
    });

    const width = size;
    const height = size * (MARKER_VIEWBOX.height / MARKER_VIEWBOX.width);

    return (
        <View style={[styles.container, {width, height}]}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${MARKER_VIEWBOX.width} ${MARKER_VIEWBOX.height}`}>
                <AnimatedCircle
                    cx={PING_CENTER.x}
                    cy={PING_CENTER.y}
                    r={animatedRadiusOne}
                    opacity={animatedOpacityOne}
                    fill={pingColor}
                />
                <AnimatedCircle
                    cx={PING_CENTER.x}
                    cy={PING_CENTER.y}
                    r={animatedRadiusTwo}
                    opacity={animatedOpacityTwo}
                    fill={pingColor}
                />
                <Path
                    d="M26.3551 0.278339C25.6201 0.675669 25.2823 1.78819 25.5803 2.76166C25.6995 3.17885 25.9181 3.61592 26.0571 3.73512C26.2161 3.85431 27.2491 4.13245 28.3617 4.35098C30.5271 4.78804 31.6198 5.16551 33.5866 6.15883C39.8645 9.31761 44.5132 15.6352 45.4668 22.3302C45.586 23.2043 45.7251 24.1976 45.7847 24.5552C45.9039 25.3896 46.8774 26.2042 47.7118 26.2042C49.7978 26.1843 50.4136 24.4758 49.7382 20.6018C48.4468 13.1916 42.8444 5.8211 35.8315 2.32459C31.9973 0.397537 27.8054 -0.496456 26.3551 0.278339Z"
                    fill={markerColor}
                />
                <Path
                    d="M25.2227 9.27788C24.7061 9.77454 24.6068 10.0527 24.6068 10.7877C24.6068 12.0791 25.1432 12.5956 26.9511 13.0922C31.8184 14.4432 35.2951 18.0986 36.8248 23.5222C37.4208 25.628 37.7784 25.9856 39.1691 26.0055C39.9836 26.0055 40.222 25.9062 40.7385 25.3896C41.3345 24.8135 41.3544 24.7539 41.2352 23.3632C40.9968 20.2839 38.9903 16.3305 36.3083 13.6485C33.5667 10.9069 29.9509 8.97988 27.1497 8.76135C25.8783 8.68188 25.7988 8.70175 25.2227 9.27788Z"
                    fill={markerColor}
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.171017 21.1978C0.469016 20.1647 1.80008 18.7344 2.85301 18.3569C3.50861 18.1185 5.69394 18.0788 15.7862 18.1185L27.9247 18.1582L28.8783 18.7542C29.5935 19.1913 30.0107 19.6482 30.408 20.423L30.9643 21.4759V33.5349C30.9643 41.6405 30.8848 45.8323 30.7458 46.3687C30.4478 47.4812 28.918 48.9116 27.726 49.2096C27.1698 49.3487 25.1036 49.448 22.4415 49.448H18.051L18.0907 63.593L18 97H13C13 97 13.1042 49.9049 13.0843 49.6069C13.0843 49.5275 10.8791 49.448 8.17727 49.4083C3.82648 49.3487 3.17088 49.309 2.55501 48.9712C1.58155 48.4547 0.985549 47.8786 0.50875 46.9647C0.0723831 46.1713 0.0716847 46.0314 0.0123691 34.1484L0.0120839 34.0912C-0.0276494 25.7274 0.0319505 21.7739 0.171017 21.1978ZM18.9847 29.6609C18.4881 29.2239 17.7331 28.7471 17.2961 28.6279C14.8326 27.8928 12.2499 28.9855 11.0381 31.2701C10.4421 32.4025 10.4421 34.707 11.0381 35.8593C12.4486 38.5016 15.6074 39.4552 18.2298 38.0049C21.3886 36.2964 21.766 32.1045 18.9847 29.6609Z"
                    fill={markerColor}
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default LoadingIndicator;
