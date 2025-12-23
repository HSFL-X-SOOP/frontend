import { Input, XStack, Text, YStack } from 'tamagui';
import { Hash } from '@tamagui/lucide-icons';
import { useRef, useEffect } from 'react';
import { TextInput } from 'react-native';

interface CodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  label: string;
  onSubmitEditing?: () => void;
  hasError?: boolean;
  errorMessage?: string;
}

const VALID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

export const CodeInput = ({
  value,
  onChangeText,
  placeholder,
  label,
  onSubmitEditing,
  hasError = false,
  errorMessage,
}: CodeInputProps) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const chars = value.padEnd(CODE_LENGTH, ' ').split('').slice(0, CODE_LENGTH);

  const handleChange = (text: string, index: number) => {
    const upperText = text.toUpperCase();

    if (text.length > 1) {
      const filtered = upperText
        .split('')
        .filter(char => VALID_CHARS.includes(char))
        .slice(0, CODE_LENGTH);

      onChangeText(filtered.join(''));

      const nextIndex = Math.min(filtered.length, CODE_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (upperText && VALID_CHARS.includes(upperText)) {
      const newChars = [...chars];
      newChars[index] = upperText;
      const newValue = newChars.join('').trim();
      onChangeText(newValue);

      if (index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      } else if (index === CODE_LENGTH - 1 && onSubmitEditing) {
        if (newValue.length === CODE_LENGTH) {
          onSubmitEditing();
        }
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!chars[index] || chars[index] === ' ') {
        // Current box is empty, just move focus backward
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Current box has a character, clear it and stay focused
        const newChars = [...chars];
        newChars[index] = ' ';
        onChangeText(newChars.join('').trim());
      }
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <YStack gap="$2">
      <XStack alignItems="center" gap="$2">
        <Text fontSize={14} fontWeight="500" color="$accent7">
          {label}
        </Text>
      </XStack>
      <XStack gap="$2" justifyContent="center" width="100%">
        {Array.from({ length: CODE_LENGTH }).map((_, index) => (
          <Input
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref as any;
            }}
            value={chars[index] === ' ' ? '' : chars[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect={false}
            textAlign="center"
            fontSize={24}
            fontWeight="600"
            flex={1}
            height={50}
            padding={0}
            borderColor={hasError ? "$red10" : "$borderColor"}
            focusStyle={{ borderColor: hasError ? "$red10" : "$accent7" }}
            selectTextOnFocus
          />
        ))}
      </XStack>
      {hasError && errorMessage && (
        <Text color="$red10" fontSize={12} textAlign="center">
          {errorMessage}
        </Text>
      )}
    </YStack>
  );
};
