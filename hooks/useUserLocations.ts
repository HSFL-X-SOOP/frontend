import {
    CreateOrUpdateUserLocationRequest, CreateOrUpdateUserLocationResponse,
    DeleteUserLocationResponse,
    UserLocation
} from "@/api/models/userLocation";
import { useUserLocationStore } from "@/api/stores/userLocation";
import * as AsyncHandler from "@/hooks/core/asyncHandler";

export const useUserLocations = () => {
    const userLocationStore = useUserLocationStore();

    const [getUserLocationByUserIdAndLocationId, getUserLocationByUserIdAndLocationIdStatus] =
        AsyncHandler.useAsync<[number, number], UserLocation>(userLocationStore.getUserLocationByUserIdAndLocationId);

    const [create, createStatus] =
        AsyncHandler.useAsync<[CreateOrUpdateUserLocationRequest], CreateOrUpdateUserLocationResponse>(userLocationStore.createUserLocation);

    const [update, updateStatus] =
        AsyncHandler.useAsync<[number, CreateOrUpdateUserLocationRequest], CreateOrUpdateUserLocationResponse>(userLocationStore.updateUserLocation);

    const [deleteUserLocation, deleteUserLocationStatus] =
        AsyncHandler.useAsync<[number], DeleteUserLocationResponse>(userLocationStore.deleteUserLocation);

    return {
        getUserLocationByUserIdAndLocationId,
        getUserLocationByUserIdAndLocationIdStatus,
        
        create,
        createStatus,

        update,
        updateStatus,

        deleteUserLocation, 
        deleteUserLocationStatus,
    };
};
