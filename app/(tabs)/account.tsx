import { useSession } from '@/context/SessionContext';
import LoginScreen from '@/app/(auth)/login';
import ProfileScreen from '@/app/(profile)/profile';

/**
 * Account Tab
 * - Shows Profile if logged in
 * - Shows Login if not logged in
 * - Imports original screens from (auth) and (profile)
 * - Navigation within screens is platform-aware via getAuthRoute/getProfileRoute helpers
 */
export default function AccountTabScreen() {
    const { session } = useSession();

    // Check if user is logged in
    const isLoggedIn = session?.profile?.id != null;

    if (isLoggedIn) {
        return <ProfileScreen />;
    } else {
        return <LoginScreen />;
    }
}
