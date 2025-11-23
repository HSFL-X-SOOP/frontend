import {
    CreateOrUpdateNotificationMeasurementRuleRequest,
    CreateOrUpdateNotificationMeasurementRuleResponse,
    DeleteNotificationMeasurementRuleResponse,
    NotificationMeasurementRule,
} from "@/api/models/notificationMeasurementRule";
import { useHttpClient } from "@/api/client.ts";

export function useNotificationMeasurementRuleStore() {
    const httpClient = useHttpClient();

    return {
        getNotificationMeasurementRuleById: (id: number) =>
            httpClient.get<NotificationMeasurementRule>(`/notification-measurement-rules/${id}`).then(r => r.data),

        getAllNotificationMeasurementRulesByUserId: (userId: number) =>
            httpClient.get<NotificationMeasurementRule[]>(`/notification-measurement-rules/user/${userId}`).then(r => r.data),

        createNotificationMeasurementRule: (body: CreateOrUpdateNotificationMeasurementRuleRequest) =>
            httpClient.post<CreateOrUpdateNotificationMeasurementRuleResponse>("/notification-measurement-rules", body).then(r => r.data),

        updateNotificationMeasurementRule: (id: number, body: CreateOrUpdateNotificationMeasurementRuleRequest) =>
            httpClient.put<CreateOrUpdateNotificationMeasurementRuleResponse>(`/notification-measurement-rules/${id}`, body).then(r => r.data),

        deleteNotificationMeasurementRule: (id: number) =>
            httpClient.delete<DeleteNotificationMeasurementRuleResponse>(`/notification-measurement-rules/${id}`).then(r => r.data),
    };
}
