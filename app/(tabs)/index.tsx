import { Redirect } from 'expo-router';

/**
 * Map Tab - Redirects to the main map screen
 */
export default function MapTabScreen() {
    return <Redirect href="/map" />;
}
