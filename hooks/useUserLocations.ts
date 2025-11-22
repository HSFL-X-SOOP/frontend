import {
    CreateUserLocationRequest, CreateUserLocationResponse
} from "@/api/models/userLocation";
import { useUserLocationStore } from "@/api/stores/userLocation";
import * as AsyncHandler from "@/hooks/core/asyncHandler";

export const useUserLocations = () => {
    const userLocationStore = useUserLocationStore();

    const [create, createStatus] =
        AsyncHandler.useAsync<[CreateUserLocationRequest], CreateUserLocationResponse>(userLocationStore.createUserLocation);


    return {
        create,
        createStatus,
    };
};
