import {
    CreateOrUpdateNotificationLocationRequest,
    CreateOrUpdateNotificationLocationResponse,
    DeleteNotificationLocationResponse,
    NotificationLocation,
} from "@/api/models/notificationLocation.ts";
import { useHttpClient } from "@/api/client.ts";

export function useNotificationLocationStore() {
    const httpClient = useHttpClient();

    return {
        getNotificationLocationByLocationId: (locationId: number) =>
            httpClient.get<NotificationLocation>(`/notification-locations/${locationId}`).then(r => r.data),

        getAllNotificationLocationsByLocationId: (locationId: number) =>
            httpClient.get<NotificationLocation[]>(`/notification-locations/all/${locationId}`).then(r => r.data),

        createNotificationLocation: (body: CreateOrUpdateNotificationLocationRequest) =>
            httpClient.post<CreateOrUpdateNotificationLocationResponse>("/notification-locations", body).then(r => r.data),

        deleteNotificationLocation: (id: number) =>
            httpClient.delete<DeleteNotificationLocationResponse>(`/notification-locations/${id}`).then(r => r.data),
    };
}
