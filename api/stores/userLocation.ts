import {
    CreateOrUpdateUserLocationRequest, CreateOrUpdateUserLocationResponse,
    DeleteUserLocationResponse,
    UserLocation
} from "@/api/models/userLocation.ts";
import { useHttpClient } from "@/api/client.ts";

export function useUserLocationStore() {
    const httpClient = useHttpClient();

    return {
        getAllUserLocationByUserId: (userId: number,) =>
            httpClient.get<UserLocation[]>(`/user-locations/user/${userId}`).then(r => r.data),

        getUserLocationByUserIdAndLocationId: (userId: number, locationId: number) =>
            httpClient.get<UserLocation>(`/user-locations/${userId}/${locationId}`).then(r => r.data),

        createUserLocation: (body: CreateOrUpdateUserLocationRequest) =>
            httpClient.post<CreateOrUpdateUserLocationResponse>("/user-locations", body).then(r => r.data),

        updateUserLocation: (id: number, body: CreateOrUpdateUserLocationRequest) =>
            httpClient.put<CreateOrUpdateUserLocationResponse>(`/user-locations/${id}`, body).then(r => r.data),

        deleteUserLocation: (id: number) =>
            httpClient.delete<DeleteUserLocationResponse>(`/user-locations/${id}`).then(r => r.data),
    };
}
