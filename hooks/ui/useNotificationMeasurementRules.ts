import {useCallback, useState} from "react";
import { CreateOrUpdateNotificationMeasurementRuleRequest,
    CreateOrUpdateNotificationMeasurementRuleResponse,
    DeleteNotificationMeasurementRuleResponse,
    NotificationMeasurementRule
} from "@/api/models/notificationMeasurementRule";
import { useNotificationMeasurementRuleStore } from "@/api/stores/notificationMeasurementRule";
import {AppError} from "@/utils/errors";

/**
 * Hook for managing notification measurement rules with Result pattern
 *
 * Note: Errors are passed to onError callback
 */
export const useNotificationMeasurementRules = () => {
    const notificationMeasurementRuleStore = useNotificationMeasurementRuleStore();
    const [loading, setLoading] = useState(false);

    const getNotificationMeasurementRuleById = useCallback(async (
        id: number,
        onSuccess: (data: NotificationMeasurementRule) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationMeasurementRuleStore.getNotificationMeasurementRuleById(id);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationMeasurementRuleStore]);

    const getAllNotificationMeasurementRulesByUserId = useCallback(async (
        userId: number,
        onSuccess: (data: NotificationMeasurementRule[]) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationMeasurementRuleStore.getAllNotificationMeasurementRulesByUserId(userId);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationMeasurementRuleStore]);

    const getAllNotificationMeasurementRulesByUserIdAndLocationId = useCallback(async (
        userId: number,
        locationId: number,
        onSuccess: (data: NotificationMeasurementRule[]) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationMeasurementRuleStore.getAllNotificationMeasurementRulesByUserIdAndLocationId(userId, locationId);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationMeasurementRuleStore]);

    const getNotificationMeasurementRule = useCallback(async (
        id: number,
        onSuccess: (data: NotificationMeasurementRule | null) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationMeasurementRuleStore.getNotificationMeasurementRuleById(id);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationMeasurementRuleStore]);

    const create = useCallback(async (
        body: CreateOrUpdateNotificationMeasurementRuleRequest,
        onSuccess: (data: CreateOrUpdateNotificationMeasurementRuleResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationMeasurementRuleStore.createNotificationMeasurementRule(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationMeasurementRuleStore]);

    const update = useCallback(async (
        id: number,
        body: CreateOrUpdateNotificationMeasurementRuleRequest,
        onSuccess: (data: CreateOrUpdateNotificationMeasurementRuleResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationMeasurementRuleStore.updateNotificationMeasurementRule(id, body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationMeasurementRuleStore]);

    const deleteNotificationMeasurementRule = useCallback(async (
        id: number,
        onSuccess: (data: DeleteNotificationMeasurementRuleResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationMeasurementRuleStore.deleteNotificationMeasurementRule(id);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationMeasurementRuleStore]);

    return {
        loading,
        getNotificationMeasurementRuleById,
        getAllNotificationMeasurementRulesByUserId,
        getAllNotificationMeasurementRulesByUserIdAndLocationId,
        getNotificationMeasurementRule,
        create,
        update,
        deleteNotificationMeasurementRule
    };
};