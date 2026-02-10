import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type AppMode = 'dev' | 'test' | 'prod';

interface EnvironmentConfig {
  mode: AppMode;
  apiUrl: string;
  googleWebClientId: string;
  googleIosClientId: string;
  stripePublishableKey: string;
}

const ENV_CONFIG: Record<AppMode, { apiUrl: string; googleWebClientId: string; googleIosClientId: string; stripePublishableKey: string }> = {
  dev: {
    apiUrl: Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
  test: {
    apiUrl: 'https://test.marlin-live.com/api',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
  prod: {
    apiUrl: 'https://marlin-live.com/api',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
    googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
};

function getEnvironment(): EnvironmentConfig {
  const mode = (Constants.expoConfig?.extra?.appMode as AppMode) || 'test';

  return {
    mode,
    apiUrl: ENV_CONFIG[mode].apiUrl,
    googleWebClientId: ENV_CONFIG[mode].googleWebClientId,
    googleIosClientId: ENV_CONFIG[mode].googleIosClientId,
    stripePublishableKey: ENV_CONFIG[mode].stripePublishableKey,
  };
}

export const ENV = getEnvironment();