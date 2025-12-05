import React from 'react';
import { YStack, Text, Spinner } from 'tamagui';

interface LazyLoadFallbackProps {
  message?: string;
}

/**
 * Fallback component displayed while lazy-loaded components are loading
 * Shows a spinner and optional message
 */
export const LazyLoadFallback: React.FC<LazyLoadFallbackProps> = ({
  message = 'Loading...'
}) => (
  <YStack
    flex={1}
    justifyContent="center"
    alignItems="center"
    gap="$4"
    padding="$4"
  >
    <Spinner size="large" color="$accent10" />
    <Text fontSize="$4" color="$color" textAlign="center">
      {message}
    </Text>
  </YStack>
);

export default LazyLoadFallback;
