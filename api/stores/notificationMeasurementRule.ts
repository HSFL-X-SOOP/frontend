import {
    CreateOrUpdateNotificationMeasurementRuleRequest,
    CreateOrUpdateNotificationMeasurementRuleResponse,
    DeleteNotificationMeasurementRuleResponse,
    NotificationMeasurementRule,
} from "@/api/models/notificationMeasurementRule";
import { useHttpClient } from "@/api/client.ts";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export function useNotificationMeasurementRuleStore() {
    const httpClient = useHttpClient();

    return {
        getNotificationMeasurementRuleById: (id: number) =>
            httpClient.get<NotificationMeasurementRule>(`/notification-measurement-rules/${id}`).then(r => r.data),

        getAllNotificationMeasurementRulesByUserId: (userId: number) =>
            httpClient.get<NotificationMeasurementRule[]>(`/notification-measurement-rules/user/${userId}`).then(r => r.data),

        getNotificationMeasurementRule: (userId: number, locationId: number, measurementTypeId: number) =>
            httpClient.get<NotificationMeasurementRule | null>(`/notification-measurement-rules/user/${userId}/location/${locationId}/measurementTypeId/${measurementTypeId}`).then(r => r.data),

        createNotificationMeasurementRule: (body: CreateOrUpdateNotificationMeasurementRuleRequest) =>
            httpClient.post<CreateOrUpdateNotificationMeasurementRuleResponse>("/notification-measurement-rules", body).then(r => r.data),

        updateNotificationMeasurementRule: (id: number, body: CreateOrUpdateNotificationMeasurementRuleRequest) =>
            httpClient.put<CreateOrUpdateNotificationMeasurementRuleResponse>(`/notification-measurement-rules/${id}`, body).then(r => r.data),

        deleteNotificationMeasurementRule: (id: number) =>
            httpClient.delete<DeleteNotificationMeasurementRuleResponse>(`/notification-measurement-rules/${id}`).then(r => r.data),
    };
}
