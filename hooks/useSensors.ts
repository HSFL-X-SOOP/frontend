import {useState, useEffect} from 'react';
import {LocationWithBoxes} from '@/api/models/sensor';
import {useSensorStore} from '@/api/stores/sensors';
import {useToast} from '@/components/useToast';


/**
 * Hook to fetch sensor data with location boxes (new API format)
 */
export function useSensorDataNew() {
    const [data, setData] = useState<LocationWithBoxes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const sensorStore = useSensorStore();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await sensorStore.getSensorDataNew();
                setData(result);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sensor data';
                setError(errorMessage);
                setData([]);
                toast.error('Sensor Data Error', {
                    message: errorMessage,
                    duration: 5000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const refetch = async () => {
        try {
            setLoading(true);
            const result = await sensorStore.getSensorDataNew();
            setData(result);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sensor data';
            setError(errorMessage);
            toast.error('Sensor Data Error', {
                message: errorMessage,
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return {data, loading, error, refetch};
}

/**
 * Hook to fetch sensor data for a specific location within a time range (FAST API)
 * Uses the new FAST endpoint which includes backend-side data aggregation
 */
export function useSensorDataTimeRange(id: number | null, timeRange: string = '24h') {
    const [data, setData] = useState<LocationWithBoxes | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sensorStore = useSensorStore();
    const toast = useToast();

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await sensorStore.getSensorDataTimeRangeFAST(id, timeRange);
                setData(result);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch time range data';
                setError(errorMessage);
                setData(null);
                toast.error('Dashboard Data Error', {
                    message: errorMessage,
                    duration: 5000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, timeRange]);

    const refetch = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const result = await sensorStore.getSensorDataTimeRangeFAST(id, timeRange);
            setData(result);
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch time range data';
            setError(errorMessage);
            toast.error('Dashboard Data Error', {
                message: errorMessage,
                duration: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return {data, loading, error, refetch};
}
