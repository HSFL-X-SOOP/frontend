
import { ScrollView } from 'react-native';
import { Text, View } from 'tamagui';
import { styles } from './_layout';

export default function TermsOfServiceScreen() {


  return (
    <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
        <Text fontSize="$8" fontWeight="bold" style={styles.largeHeadline}>Terms of Service</Text>
        <Text fontSize="$5" style={styles.textLg}>...</Text>
        </ScrollView>
    </View>
  );
}