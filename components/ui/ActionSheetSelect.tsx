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
  compact?: boolean;
};

export function ActionSheetSelect<T extends string | number>({
  items,
  value,
  placeholder = 'Select',
  onChange,
  compact = false,
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

      <Pressable style={[styles.button, compact && styles.compactButton]} onPress={openSheet}>
        <Text style={[styles.text, compact && styles.compactText, !value && styles.placeholder]}>
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
  compactButton: {
    height: 36,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
  },
  compactText: {
    fontSize: 14,
  },
  placeholder: {
    color: '#999',
  },
});

