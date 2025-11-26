import {useHttpClient} from '@/api/client';
import {mockLocationWithBoxes, mockSensorModules, mockTimeRangeData} from '@/api/mock/mock-sensor-data';
import {LocationWithBoxes, SensorModule} from '@/api/models/sensor';

const USE_MOCK_DATA = false;

export function useSensorStore() {
    const httpClient = useHttpClient();
    return {
        getSensorData: async (): Promise<SensorModule[]> => {
            if (USE_MOCK_DATA) {
                console.log('Using mock sensor data (old API format)');
                await new Promise(resolve => setTimeout(resolve, 300));
                return mockSensorModules;
            }

            try {
                const response = await httpClient.get<SensorModule[]>('/latestmeasurements');
                return response.data;
            } catch (error) {
                console.error('API call failed, falling back to mock data:', error);
                return [];
            }
        },

        getSensorDataNew: async (timezone: string = 'UTC'): Promise<LocationWithBoxes[]> => {
            if (USE_MOCK_DATA) {
                console.log('Using mock sensor data (new API format)');
                await new Promise(resolve => setTimeout(resolve, 300));
                return mockLocationWithBoxes;
            }

            try {
                const response = await httpClient.get<LocationWithBoxes[]>(`/latestmeasurementsNEW?timezone=${timezone}`);
                return response.data;
            } catch (error) {
                console.error('API call failed, returning empty array:', error);
                return [];
            }
        },

        getSensorDataTimeRangeFAST: async (id: number, timeRange: string = '24h', timezone: string = 'UTC'): Promise<LocationWithBoxes | null> => {
            if (USE_MOCK_DATA) {
                console.log(`Using mock time range data (FAST) for location ${id}, range: ${timeRange}`);
                await new Promise(resolve => setTimeout(resolve, 300));
                return mockTimeRangeData(id, timeRange);
            }

            try {
                const response = await httpClient.get<LocationWithBoxes>(
                    `/location/${id}/measurementsWithinTimeRangeFAST`,
                    {params: {timeRange, timezone}}
                );
                return response.data;
            } catch (error) {
                console.error('API call failed:', error);
                return null;
            }
        }
    };
}
