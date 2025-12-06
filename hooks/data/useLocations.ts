import {useState, useEffect} from 'react';
import {DetailedLocationDTO} from '@/api/models/location';
import {useToast} from '@/hooks/ui';
import {useSession} from '@/context/SessionContext';
import {useLocationStore} from '@/api/stores/location.service';
import {UI_CONSTANTS} from '@/config/constants';

/**
 * Hook to fetch all locations from the /locations endpoint
 * Locations are only fetched once when the component mounts
 */
export function useLocations() {
    const [data, setData] = useState<DetailedLocationDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();
    const {session} = useSession();
    const locationStore = useLocationStore();

    useEffect(() => {
        // Only fetch if user is authenticated
        if (!session?.accessToken) {
            setLoading(false);
            return;
        }

        const fetchLocations = async () => {
            try {
                setLoading(true);
                const result = await locationStore.getLocations();
                console.log("Fetched locations:", result);
                setData(result);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch locations';
                setError(errorMessage);
                setData([]);
                toast.error('Locations Error', {
                    message: errorMessage,
                    duration: UI_CONSTANTS.TOAST_DURATION.LONG
                });
            } finally {
                setLoading(false);
            }
        };

        void fetchLocations();
        // Empty array = only run once when component mounts
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refetch = async () => {
        if (!session?.accessToken) return;

        try {
            setLoading(true);
            const result = await locationStore.getLocations();
            setData(result);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch locations';
            setError(errorMessage);
            toast.error('Locations Error', {
                message: errorMessage,
                duration: UI_CONSTANTS.TOAST_DURATION.LONG
            });
        } finally {
            setLoading(false);
        }
    };

    return {data, loading, error, refetch};
}
