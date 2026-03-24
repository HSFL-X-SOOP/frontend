import { View } from "tamagui"
import Animated from "react-native-reanimated";

interface Props {
    height: number;
    body: React.ReactNode;
    waterBgStyle?: any;
    paddingHorizontal?: number;
}

export function Body(probs: Props) {
  return (
    <Animated.View style={[{ height: probs.height, paddingHorizontal: probs.paddingHorizontal ?? 16, justifyContent: "center" }, probs.waterBgStyle ?? {}]}>
        <View flex={1} flexDirection="row" alignItems="center">
            {probs.body}
        </View>
    </Animated.View>
  );
}

