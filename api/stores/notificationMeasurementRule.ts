import {
    CreateOrUpdateNotificationMeasurementRuleRequest,
    CreateOrUpdateNotificationMeasurementRuleResponse,
    DeleteNotificationMeasurementRuleResponse,
    NotificationMeasurementRule,
} from "@/api/models/notificationMeasurementRule";
import { useHttpClient } from "@/api/client.ts";
import { Result } from "@/utils/errors";
import { api } from "@/utils/api";

export function useNotificationMeasurementRuleStore() {
    const httpClient = useHttpClient();

    return {
        getNotificationMeasurementRuleById: (id: number): Promise<Result<NotificationMeasurementRule>> => {
            return api.requestSafe(
                httpClient.get<NotificationMeasurementRule>(`/notification-measurement-rules/${id}`),
                'NotificationMeasurementRuleStore:getNotificationMeasurementRuleById'
            );
        },

        getAllNotificationMeasurementRulesByUserId: (): Promise<Result<NotificationMeasurementRule[]>> => {
            return api.requestSafe(
                httpClient.get<NotificationMeasurementRule[]>(`/notification-measurement-rules/user`),
                'NotificationMeasurementRuleStore:getAllNotificationMeasurementRulesByUserId'
            );
        },

        getAllNotificationMeasurementRulesByUserIdAndLocationId: (locationId: number): Promise<Result<NotificationMeasurementRule[]>> => {
            return api.requestSafe(
                httpClient.get<NotificationMeasurementRule[]>(`/notification-measurement-rules/user/location/${locationId}`),
                'NotificationMeasurementRuleStore:getAllNotificationMeasurementRulesByUserIdAndLocationId'
            );
        },

        // getNotificationMeasurementRule: (locationId: number, measurementTypeId: number): Promise<Result<NotificationMeasurementRule | null>> => {
        //     return api.requestSafe(
        //         httpClient.get<NotificationMeasurementRule | null>(`/notification-measurement-rules/user/location/${locationId}/measurementTypeId/${measurementTypeId}`),
        //         'NotificationMeasurementRuleStore:getNotificationMeasurementRule'
        //     );
        // },

        createNotificationMeasurementRule: (body: CreateOrUpdateNotificationMeasurementRuleRequest): Promise<Result<CreateOrUpdateNotificationMeasurementRuleResponse>> => {
            return api.requestSafe(
                httpClient.post<CreateOrUpdateNotificationMeasurementRuleResponse>("/notification-measurement-rules", body),
                'NotificationMeasurementRuleStore:createNotificationMeasurementRule'
            );
        },

        updateNotificationMeasurementRule: (id: number, body: CreateOrUpdateNotificationMeasurementRuleRequest): Promise<Result<CreateOrUpdateNotificationMeasurementRuleResponse>> => {
            return api.requestSafe(
                httpClient.put<CreateOrUpdateNotificationMeasurementRuleResponse>(`/notification-measurement-rules/${id}`, body),
                'NotificationMeasurementRuleStore:updateNotificationMeasurementRule'
            );
        },

        deleteNotificationMeasurementRule: (id: number): Promise<Result<DeleteNotificationMeasurementRuleResponse>> => {
            return api.requestSafe(
                httpClient.delete<DeleteNotificationMeasurementRuleResponse>(`/notification-measurement-rules/${id}`),
                'NotificationMeasurementRuleStore:deleteNotificationMeasurementRule'
            );
        },
    };
}
