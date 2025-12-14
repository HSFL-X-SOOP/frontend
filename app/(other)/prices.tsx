
import { ScrollView } from 'react-native';
import { Text, View } from 'tamagui';
import { styles } from './_layout';

export default function PricesScreen() {

  return (
    <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
        <Text fontSize="$8" fontWeight="bold" style={styles.largeHeadline}>Preise</Text>
        <Text fontSize="$5" style={styles.textLg}>...</Text>
        </ScrollView>
    </View>
  );
}