import {useHttpClient} from '@/api/client';
import {LocationWithBoxes, SensorModule} from '@/api/models/sensor';
import {api} from '@/utils/api';
import {Result} from '@/utils/errors';

export function useSensorStore() {
    const httpClient = useHttpClient();

    return {
        getSensorData: (): Promise<Result<SensorModule[]>> => {
            return api.requestSafe(
                httpClient.get<SensorModule[]>('/latestmeasurements'),
                'SensorStore:getSensorData'
            );
        },

        getSensorDataNew: (timezone: string = 'UTC'): Promise<Result<LocationWithBoxes[]>> => {
            return api.requestSafe(
                httpClient.get<LocationWithBoxes[]>(`/latestmeasurementsNEW?timezone=${timezone}`),
                'SensorStore:getSensorDataNew'
            );
        },

        getSensorDataTimeRangeFAST: (id: number, timeRange: string = '24h', timezone: string = 'UTC'): Promise<Result<LocationWithBoxes>> => {
            return api.requestSafe(
                httpClient.get<LocationWithBoxes>(
                    `/location/${id}/measurementsWithinTimeRangeFAST`,
                    {params: {timeRange, timezone}}
                ),
                'SensorStore:getSensorDataTimeRangeFAST'
            );
        }
    };
}
