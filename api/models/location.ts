// Location Info Models based on API schema

export interface GeoPoint {
    lat: number;
    lon: number;
}

export interface Contact {
    phone?: string | null;
    email?: string | null;
    website?: string | null;
}

export interface DetailedLocationDTO {
    id?: number | null;
    name?: string | null;
    description?: string | null;
    address?: string | null;
    coordinates?: GeoPoint | null;
    contact?: Contact | null;
    openingHours?: string | null;
}

export interface UpdateLocationRequest {
    name: string;
    address: string;
    description?: string | null;
    openingHours?: string | null;
    contact?: Contact | null;
    image?: ImageRequest | null;
}

export interface ImageRequest {
    base64?: string | null;
    contentType?: string | null;
}

// Response type for location image endpoint
export interface LocationImageResponse {
    url: string;
}