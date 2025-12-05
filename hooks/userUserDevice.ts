import {
    RegisterUserDeviceRequest,
    RegisterUserDeviceResponse,
} from "@/api/models/userDevice";
import { useUserDeviceStore } from "@/api/stores/userDevice";
import * as AsyncHandler from "@/hooks/core/asyncHandler";

export const useUserDevice = () => {
    const userDeviceStore = useUserDeviceStore();

    const [registerUserDevice, registerUserDeviceStatus] =
        AsyncHandler.useAsync<[RegisterUserDeviceRequest], RegisterUserDeviceResponse | null>(userDeviceStore.registerUserDevice);

    return {
        registerUserDevice,
        registerUserDeviceStatus,
    };
};
