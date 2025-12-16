import { useState } from 'react';
import { Button, Text, Input, YStack, View } from 'tamagui';
import { styles } from '../_layout';
export default function ProfileSettingsFeedbackAndSupportScreen() {
  const [message, setMessage] = useState("");
  return (

    <View style={styles.container} backgroundColor="$background">
      <YStack space="$4" padding="$4">
        <Text fontSize="$5">Gib uns Feedback oder stelle eine Support-Anfrage:</Text>
        <Input
          placeholder="Dein Feedback oder deine Frage..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          width="95%"
        />
        <Button variant="outlined" disabled>
          <Text>Absenden (Coming Soon)</Text>
        </Button>
      </YStack>
    </View>

  );
}