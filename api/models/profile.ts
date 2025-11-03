export interface UserProfile {
    id: number;
    userId: number;
    language: Language;
    activityRoles: ActivityRole[];
    authorityRole: AuthorityRole
    measurementSystem: MeasurementSystem;
    createdAt: string;
    updatedAt?: string;
}

export interface UpdateProfileRequest {
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
    HARBOURMASTER = "HARBOURMASTER"
}

export enum MeasurementSystem {
    METRIC = "METRIC",
    IMPERIAL = "IMPERIAL"
}