import ProfileScreen from "@/app/(profile)/profile";
import LoginScreen from "@/app/(auth)/login";
import { useSession } from '@/context/SessionContext';

/**
 * Account Tab
 * - Shows Profile if logged in
 * - Shows Login if not logged in
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
