import {
    CreateOrUpdateUserLocationRequest, CreateOrUpdateUserLocationResponse,
    DeleteUserLocationResponse,
    UserLocation
} from "@/api/models/userLocation.ts";
import { useHttpClient } from "@/api/client.ts";
import { Result } from "@/utils/errors";
import { api } from "@/utils/api";

export function useUserLocationStore() {
    const httpClient = useHttpClient();

    return {
        getAllUserLocationByUserId: (): Promise<Result<UserLocation[]>> => {
            return api.requestSafe(
                httpClient.get<UserLocation[]>(`/user-locations/user`),
                'UserLocationStore:getAllUserLocationByUserId'
            );
        },

        getUserLocationByUserIdAndLocationId: (locationId: number): Promise<Result<UserLocation>> => {
            return api.requestSafe(
                httpClient.get<UserLocation>(`/user-locations/location/${locationId}`),
                'UserLocationStore:getUserLocationByUserIdAndLocationId'
            );
        },

        createUserLocation: (body: CreateOrUpdateUserLocationRequest): Promise<Result<CreateOrUpdateUserLocationResponse>> => {
            return api.requestSafe(
                httpClient.post<CreateOrUpdateUserLocationResponse>("/user-locations", body),
                'UserLocationStore:createUserLocation'
            );
        },

        updateUserLocation: (id: number, body: CreateOrUpdateUserLocationRequest): Promise<Result<CreateOrUpdateUserLocationResponse>> => {
            return api.requestSafe(
                httpClient.put<CreateOrUpdateUserLocationResponse>(`/user-locations/${id}`, body),
                'UserLocationStore:updateUserLocation'
            );
        },

        deleteUserLocation: (id: number): Promise<Result<DeleteUserLocationResponse>> => {
            return api.requestSafe(
                httpClient.delete<DeleteUserLocationResponse>(`/user-locations/${id}`),
                'UserLocationStore:deleteUserLocation'
            );
        },
    };
}
