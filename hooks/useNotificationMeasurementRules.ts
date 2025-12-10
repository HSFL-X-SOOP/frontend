import { CreateOrUpdateNotificationMeasurementRuleRequest, 
    CreateOrUpdateNotificationMeasurementRuleResponse, 
    DeleteNotificationMeasurementRuleResponse, 
    NotificationMeasurementRule 
} from "@/api/models/notificationMeasurementRule";
import { useNotificationMeasurementRuleStore } from "@/api/stores/notificationMeasurementRule";
import * as AsyncHandler from "@/hooks/core/asyncHandler";

export const useNotificationMeasurementRules = () => {
    const notificationMeasurementRuleStore = useNotificationMeasurementRuleStore();

    const [getNotificationMeasurementRuleById, getNotificationMeasurementRuleByIdStatus] =
        AsyncHandler.useAsync<[number], NotificationMeasurementRule>(notificationMeasurementRuleStore.getNotificationMeasurementRuleById);
    
    const [getAllNotificationMeasurementRulesByUserId, getAllNotificationMeasurementRulesByUserIdStatus] =
        AsyncHandler.useAsync<[number], NotificationMeasurementRule[]>(notificationMeasurementRuleStore.getAllNotificationMeasurementRulesByUserId);

    const [getAllNotificationMeasurementRulesByUserIdAndLocationId, getAllNotificationMeasurementRulesByUserIdAndLocationIdStatus] =
        AsyncHandler.useAsync<[number, number], NotificationMeasurementRule[]>(notificationMeasurementRuleStore.getAllNotificationMeasurementRulesByUserIdAndLocationId);

    const [getNotificationMeasurementRule, getNotificationMeasurementRuleStatus] =
        AsyncHandler.useAsync<[number, number, number], NotificationMeasurementRule | null>(notificationMeasurementRuleStore.getNotificationMeasurementRule);

    const [create, createStatus] =
        AsyncHandler.useAsync<[CreateOrUpdateNotificationMeasurementRuleRequest], CreateOrUpdateNotificationMeasurementRuleResponse>(notificationMeasurementRuleStore.createNotificationMeasurementRule);

    const [update, updateStatus] =
        AsyncHandler.useAsync<[number, CreateOrUpdateNotificationMeasurementRuleRequest], CreateOrUpdateNotificationMeasurementRuleResponse>(notificationMeasurementRuleStore.updateNotificationMeasurementRule);

    const [deleteNotificationMeasurementRule, deleteNotificationMeasurementRuleStatus] =
        AsyncHandler.useAsync<[number], DeleteNotificationMeasurementRuleResponse>(notificationMeasurementRuleStore.deleteNotificationMeasurementRule);

    return {
        getNotificationMeasurementRuleById,
        getNotificationMeasurementRuleByIdStatus,

        getAllNotificationMeasurementRulesByUserId,
        getAllNotificationMeasurementRulesByUserIdStatus,

        getAllNotificationMeasurementRulesByUserIdAndLocationId,
        getAllNotificationMeasurementRulesByUserIdAndLocationIdStatus,

        getNotificationMeasurementRule,
        getNotificationMeasurementRuleStatus,

        create,
        createStatus,

        update,
        updateStatus,

        deleteNotificationMeasurementRule, 
        deleteNotificationMeasurementRuleStatus,
    };
};