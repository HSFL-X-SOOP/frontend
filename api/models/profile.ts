export interface UserProfile {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    language: Language | null;
    activityRoles: ActivityRole[];
    roles?: ActivityRole[]; // Alias for activityRoles
    authorityRole: AuthorityRole;
    measurementSystem: MeasurementSystem | null;
    assignedLocation?: object | null;
    verified: boolean;
    profileCreatedAt: string | null;
    profileUpdatedAt: string | null;
    userCreatedAt: string;
    userUpdatedAt: string | null;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    language?: Language;
    roles?: ActivityRole[];
    measurementSystem?: MeasurementSystem;
}

export enum Language {
    EN = "EN",
    DE = "DE"
}

export enum ActivityRole {
    SWIMMER = "SWIMMER",
    SAILOR = "SAILOR",
    FISHERMAN = "FISHERMAN"
}

export enum AuthorityRole {
    ADMIN = "ADMIN",
    USER = "USER",
    HARBOURMASTER = "HARBOR_MASTER"  // API returns HARBOR_MASTER with underscore
}

export enum MeasurementSystem {
    METRIC = "METRIC",
    IMPERIAL = "IMPERIAL"
}