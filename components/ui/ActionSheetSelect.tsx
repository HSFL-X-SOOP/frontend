import { Pressable, StyleSheet } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Card, Text } from 'tamagui';
import { rgba } from '@tamagui/core';

export type SelectItem<T extends string | number> = {
  label: string;
  value: T;
};

type ActionSheetSelectProps<T extends string | number> = {
  items: SelectItem<T>[];
  value: T | null;
  placeholder?: string;
  onChange: (value: T) => void;
};

export function ActionSheetSelect<T extends string | number>({
  items,
  value,
  placeholder = 'Select',
  onChange,
}: ActionSheetSelectProps<T>) {
  const { showActionSheetWithOptions } = useActionSheet();

  const selectedLabel =
    items.find(i => i.value === value)?.label ?? placeholder;

  const openSheet = () => {
    showActionSheetWithOptions(
      {
        options: [...items.map(i => i.label), 'Cancel'],
        cancelButtonIndex: items.length,
      },
      index => {
        if (index !== undefined && index < items.length) {
          onChange(items[index].value);
        }
      }
    );
  };

  return (
    <Card backgroundColor="$content2" borderColor="$borderColor" borderWidth={1} borderRadius={8}>

      <Pressable style={styles.button} onPress={openSheet}>
        <Text style={[styles.text, !value && styles.placeholder]}>
          {selectedLabel}
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
  placeholder: {
    color: '#999',
  },
});

