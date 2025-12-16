import { YStack, XStack, View, Text } from 'tamagui';
import { Check, X } from '@tamagui/lucide-icons';
import { useTranslation } from '@/hooks/ui';

interface PasswordValidation {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  digit: boolean;
  special: boolean;
  validChars: boolean;
}

interface PasswordStrength {
  count: number;
  total: number;
  percentage: number;
}

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidation;
  strength: PasswordStrength;
  showDetails?: boolean;
}

const ValidationItem = ({ isValid, label }: { isValid: boolean; label: string }) => {
  const iconColor = isValid ? '#22c55e' : '#ef4444';

  return (
    <XStack gap="$2" alignItems="center">
      <View width={14} height={14} alignItems="center" justifyContent="center">
        {isValid ? <Check size={14} color={iconColor} /> : <X size={14} color={iconColor} />}
      </View>
      <Text fontSize={12} color={iconColor}>
        {label}
      </Text>
    </XStack>
  );
};

export const PasswordStrengthIndicator = ({
  validation,
  strength,
  showDetails = true,
}: PasswordStrengthIndicatorProps) => {
  const { t } = useTranslation();

  const getBarColor = () => {
    if (strength.percentage === 100) return '#22c55e';
    if (strength.percentage >= 60) return '#eab308';
    return '#ef4444';
  };

  return (
    <YStack gap="$3" paddingTop="$2">
      <YStack gap="$2">
        <Text fontSize={12} fontWeight="600" color="$color">
          {t('auth.passwordStrength')}
        </Text>
        <View width="100%" height={8} backgroundColor="$gray5" borderRadius="$4" overflow="hidden">
          <View
            width={`${strength.percentage}%`}
            height="100%"
            backgroundColor={getBarColor()}
          />
        </View>
      </YStack>

      {showDetails && (
        <YStack gap="$2" paddingLeft="$2">
          <ValidationItem isValid={validation.length} label={t('auth.passwordLength')} />
          <ValidationItem isValid={validation.lowercase} label={t('auth.passwordLowercase')} />
          <ValidationItem isValid={validation.uppercase} label={t('auth.passwordUppercase')} />
          <ValidationItem isValid={validation.digit} label={t('auth.passwordDigit')} />
          <ValidationItem isValid={validation.special} label={t('auth.passwordSpecial')} />
        </YStack>
      )}
    </YStack>
  );
};
