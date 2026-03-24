import { StyleSheet } from "react-native";
import { View } from "tamagui"
import Animated, {
  useAnimatedStyle
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Body } from "./body";
import { HeaderText } from "./header";

interface Props {
    title: string;
    value: number;
    metric: string;

    body: React.ReactNode;
    width: number;
    height: number;
    headerRatio?: number;
    paddingHorizontal?: number;
    badgeText?: string;
}

export function Card(probs: Props) {
    const headerHeight = Math.round(probs.height * (probs.headerRatio ?? 0.28));
    const bodyHeight = probs.height - headerHeight;

    const waterBgStyle = useAnimatedStyle(() => {
    return { backgroundColor: "#0B3D91" };
    });

    const headerBgStyle = useAnimatedStyle(() => {
    return { backgroundColor: "#0B1F3A" };
    });

    return (
        <View borderRadius={22} overflow="hidden" backgroundColor={"#0B2F6B"} style={[{ width: probs.width, height: probs.height }]}>
        {/* Header */}
        <Animated.View style={[{ height: headerHeight, paddingHorizontal: 16, paddingTop: 12, justifyContent: "center" }, headerBgStyle ?? {}]}>
            {/* Background color */}
            <LinearGradient
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={[
                "rgba(255,255,255,0.06)",
                "rgba(255,255,255,0.00)",
                "rgba(255,255,255,0.02)",
            ]}
            />
            <HeaderText title={probs.title} badgeText={probs.badgeText}/>
        </Animated.View>

        <Body height={bodyHeight} waterBgStyle={waterBgStyle} body={probs.body} paddingHorizontal={probs.paddingHorizontal ?? 16} />

        <View top={headerHeight - 1} position="absolute" height={2} left={0} right={0} pointerEvents="none" backgroundColor="rgba(255,255,255,0.22)"/>
        </View>
    );
}

