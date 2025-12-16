import { useMemo } from 'react';

export const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
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

export const usePasswordValidation = (password: string) => {
  const validation = useMemo<PasswordValidation>(() => {
    const hasValidLength = password.length >= 8 && password.length <= 64;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[@$!%*?&#\-]/.test(password);
    const hasOnlyValidChars = /^[A-Za-z\d@$!%*?&#\-]*$/.test(password);

    return {
      length: hasValidLength,
      lowercase: hasLowercase,
      uppercase: hasUppercase,
      digit: hasDigit,
      special: hasSpecial,
      validChars: hasOnlyValidChars,
    };
  }, [password]);

  const strength = useMemo<PasswordStrength>(() => {
    if (password.length === 0) return { count: 0, total: 5, percentage: 0 };

    const validationValues = [
      validation.length,
      validation.lowercase,
      validation.uppercase,
      validation.digit,
      validation.special,
    ];
    const validCount = validationValues.filter(Boolean).length;

    const lengthScore = Math.min((password.length / 12) * 40, 40);
    const criteriaScore = (validCount / validationValues.length) * 60;
    const percentage = Math.min(lengthScore + criteriaScore, 100);

    return {
      count: validCount,
      total: validationValues.length,
      percentage,
    };
  }, [password, validation]);

  const isValid = useMemo(() => {
    return (
      validation.length &&
      validation.lowercase &&
      validation.uppercase &&
      validation.digit &&
      validation.special &&
      validation.validChars
    );
  }, [validation]);

  return {
    validation,
    strength,
    isValid,
  };
};

export const useEmailValidation = (email: string) => {
  const isValid = useMemo(() => {
    return EMAIL_REGEX.test(email);
  }, [email]);

  return {
    isValid,
  };
};
