import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ENV } from '@/config/environment';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from '@/context/SessionContext';
import { AuthorityRole } from '@/api/models/profile';
import { createLogger } from '@/utils/logger';

const logger = createLogger('Auth:GoogleSignIn');

export const useGoogleSignIn = () => {
  const router = useRouter();
  const { googleLogin, googleLoginStatus } = useAuth();
  const { login: logUserIn } = useSession();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      logger.debug('Configuring Google Sign-In', { platform: Platform.OS });
      GoogleSignin.configure({
        webClientId: ENV.googleWebClientId,
        offlineAccess: true,
      });
    }
  }, []);

  const handleGoogleSignIn = async (redirectPath: '/map' | '/' = '/map') => {
    try {
      logger.info('Starting Google Sign-In flow', { platform: Platform.OS });

      if (Platform.OS === 'web') {
        const loginUrl =
          ENV.mode === 'dev' ? `${ENV.apiUrl}/login/google` : '/api/login/google';
        logger.debug('Redirecting to Google OAuth', { loginUrl });
        window.location.assign(loginUrl);
        return;
      }

      logger.debug('Checking Play Services availability');
      await GoogleSignin.hasPlayServices();

      logger.debug('Initiating Google Sign-In');
      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        logger.error('No ID token received from Google Sign-In');
        throw new Error('No ID token received');
      }

      logger.debug('Authenticating with backend');
      const res = await googleLogin({ idToken });

      if (res) {
        logger.info('Google Sign-In successful', { hasProfile: !!res.profile });
        logUserIn({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          loggedInSince: new Date(),
          lastTokenRefresh: null,
          role: res.profile?.authorityRole ?? AuthorityRole.USER, // Standard: USER falls nicht vom Backend geliefert
          profile: res.profile,
        });
        router.push(redirectPath);
        return { success: true };
      } else {
        logger.error('Backend authentication failed');
        return { success: false, error: 'Backend authentication failed' };
      }
    } catch (error) {
      logger.error('Google Sign-In failed', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return {
    handleGoogleSignIn,
    isLoading: googleLoginStatus?.loading,
    error: googleLoginStatus?.error,
  };
};
