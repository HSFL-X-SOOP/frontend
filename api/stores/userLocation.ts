import {
    CreateUserLocationRequest, CreateUserLocationResponse
} from "@/api/models/userLocation.ts";
import { useHttpClient } from "@/api/client.ts";

export function useUserLocationStore() {
    const httpClient = useHttpClient();

    return {
        createUserLocation: (body: CreateUserLocationRequest) =>
            httpClient.post<CreateUserLocationResponse>("/user-locations", body).then(r => r.data),

    };
}
