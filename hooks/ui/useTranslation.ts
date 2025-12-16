import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (namespace = 'common') => {
  const { t, i18n } = useI18nTranslation(namespace);

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: (language: string) => i18n.changeLanguage(language),
    isLoading: !i18n.isInitialized,
  };
};

export default useTranslation;