import { View, Text } from "tamagui";

interface Props {
    title: string;
    badgeText?: string;
}

export function HeaderText(probs: Props) {
  return (
    <View flexDirection="row" alignItems="center" justifyContent="space-between">
        <Text fontSize={16} fontWeight={600} color={"rgba(255,255,255,0.92)"}>{probs.title}</Text>
        {probs.badgeText && (
            <View backgroundColor={"rgba(255,255,255,0.12)"} paddingHorizontal={8} paddingVertical={4} borderRadius={12}>
                <Text fontSize={12} fontWeight={600} color={"rgba(255,255,255,0.92)"}>{probs.badgeText}</Text>
            </View>
        )}
    </View>
  );
}

