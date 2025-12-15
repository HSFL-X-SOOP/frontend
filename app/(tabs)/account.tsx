import { Redirect } from 'expo-router';
import { useSession } from '@/context/SessionContext';

/**
 * Account Tab
 * - Redirects to Profile if logged in
 * - Redirects to Login if not logged in
 */
export default function AccountTabScreen() {
    const { session } = useSession();

    // Check if user is logged in
    const isLoggedIn = session?.profile?.id != null;

    if (isLoggedIn) {
        return <Redirect href="/(profile)/profile" />;
    } else {
        return <Redirect href="/(auth)/login" />;
    }
}
