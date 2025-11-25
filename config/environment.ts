import Constants from 'expo-constants';

export type AppMode = 'dev' | 'test' | 'prod';

interface EnvironmentConfig {
  mode: AppMode;
  apiUrl: string;
  googleWebClientId: string;
}

const ENV_CONFIG: Record<AppMode, { apiUrl: string; googleWebClientId: string }> = {
  dev: {
    apiUrl: 'http://localhost:8080',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  },
  test: {
    apiUrl: 'https://test.marlin-live.com/api',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  },
  prod: {
    apiUrl: 'https://marlin-live.com/api',
    googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  },
};

function getEnvironment(): EnvironmentConfig {
  const mode = (Constants.expoConfig?.extra?.appMode as AppMode) || 'test';

  return {
    mode,
    apiUrl: ENV_CONFIG[mode].apiUrl,
    googleWebClientId: ENV_CONFIG[mode].googleWebClientId,
  };
}

export const ENV = getEnvironment();