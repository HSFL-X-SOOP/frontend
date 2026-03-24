import { View, Text } from "tamagui";

interface Props {
    bodyText: string;
    bodyHelperText: string;
    bodyStyle?: any;
}

export function BodyText(probs: Props) {
  return (
    <View style={probs.bodyStyle}>
        <Text fontSize={46} fontWeight={900} color={"rgba(255,255,255,0.98)"} letterSpacing={0.3} textShadowColor={"rgba(0,0,0,0.35)"} 
        textShadowOffset={{ width: 0, height: 2 }} textShadowRadius={10}>
            {probs.bodyText}
        </Text>
        <Text marginTop={6} color={"rgba(255,255,255,0.92)"} fontSize={16} fontWeight={600}>
            {probs.bodyHelperText}
        </Text>
    </View>
  );
}

