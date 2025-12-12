
import { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, Input, YStack } from 'tamagui';
import { styles } from '../_layout';
export default function ProfileSettingsApiScreen() {
  const [apiKey, setApiKey] = useState("");  
  return (

    <View style={styles.container}>
      <YStack gap="$4" padding="$4">
        <Text fontSize="$5">Hier kannst du deinen persönlichen API-Token verwalten:</Text>
        <Input
          placeholder="1234-5678-ABCD-EFGH"
          value={apiKey}
          onChangeText={setApiKey}
          width="95%"
        />
        <Button variant="outlined" disabled>
          <Text>Speichern (Coming Soon)</Text>
        </Button>
      </YStack>
    </View>
    
  );
}