import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '@/config/constants';


import enCommon from '../locales/en/common.json';
import deCommon from '../locales/de/common.json';
import enAbout from '../locales/en/about.json';
import deAbout from '../locales/de/about.json';
import enApi from '../locales/en/api.json';
import deApi from '../locales/de/api.json';
import enSensors from '../locales/en/sensors.json';
import deSensors from '../locales/de/sensors.json';

const resources = {
  en: {
    common: enCommon,
    about: enAbout,
    api: enApi,
    sensors: enSensors,
  },
  de: {
    common: deCommon,
    about: deAbout,
    api: deApi,
    sensors: deSensors,
  },
};

const getStoredLanguage = async (): Promise<string> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_LANGUAGE);
    return stored || 'de';
  } catch {
    return 'de';
  }
};

const saveLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_LANGUAGE, language);
  } catch {
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de',
    fallbackLng: 'de',
    debug: __DEV__,

    interpolation: {
      escapeValue: false,
    },

    defaultNS: 'common',
    ns: ['common', 'about', 'api', 'sensors'],

    react: {
      useSuspense: false,
    },
  });


getStoredLanguage().then((language) => {
  i18n.changeLanguage(language);
});

i18n.on('languageChanged', (language) => {
  saveLanguage(language);
});

export default i18n;
export { saveLanguage, getStoredLanguage };