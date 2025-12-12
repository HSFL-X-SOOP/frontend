import {useCallback, useState} from "react";
import {
    RegisterUserDeviceRequest,
    RegisterUserDeviceResponse,
} from "@/api/models/userDevice";
import { useUserDeviceStore } from "@/api/stores/userDevice";
import {AppError} from "@/utils/errors";

/**
 * Hook for managing user devices with Result pattern
 *
 * Note: Errors are passed to onError callback
 */
export const useUserDevice = () => {
    const userDeviceStore = useUserDeviceStore();
    const [loading, setLoading] = useState(false);

    const registerUserDevice = useCallback(async (
        body: RegisterUserDeviceRequest,
        onSuccess: (data: RegisterUserDeviceResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userDeviceStore.registerUserDevice(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userDeviceStore]);

    return {
        loading,
        registerUserDevice
    };
};
