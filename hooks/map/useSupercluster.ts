import {LocationWithBoxes} from '@/api/models/sensor';
import {useMemo} from 'react';
import Supercluster from 'supercluster';

export type ClusterProperties = {
    cluster: boolean;
    point_count?: number;
    locationWithBoxes?: LocationWithBoxes;
};

export type ClusterPoint = {
    type: 'Feature';
    id?: number;
    properties: ClusterProperties;
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
};

export function useSupercluster(
    locations: LocationWithBoxes[],
    bounds: [number, number, number, number],
    zoom: number,
    options?: Supercluster.Options<ClusterProperties, any>
) {
    const hasLocations = locations && locations.length > 0;
    const safeZoom = !isNaN(zoom) ? zoom : 7;

    const supercluster = useMemo(() => {
        const cluster = new Supercluster<ClusterProperties>({
            radius: 60,
            maxZoom: 18,
            minZoom: 3,
            ...options,
        });

        if (!hasLocations) {
            return cluster;
        }

        const points: ClusterPoint[] = locations.map((locationWithBoxes) => ({
            type: 'Feature' as const,
            properties: {
                cluster: false,
                locationWithBoxes,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: [
                    locationWithBoxes.location.coordinates.lon,
                    locationWithBoxes.location.coordinates.lat,
                ],
            },
        }));

        cluster.load(points);
        return cluster;
    }, [locations, options, hasLocations]);

    const clusters = useMemo(() => {
        if (!hasLocations) {
            return [];
        }

        try {
            return supercluster.getClusters(bounds, Math.round(safeZoom));
        } catch (error) {
            return [];
        }
    }, [supercluster, bounds, safeZoom, hasLocations]);

    const getClusterExpansionZoom = (clusterId: number) => {
        return supercluster.getClusterExpansionZoom(clusterId);
    };

    const getClusterLeaves = (clusterId: number, limit?: number) => {
        return supercluster.getLeaves(clusterId, limit || 10);
    };

    return {clusters, getClusterExpansionZoom, getClusterLeaves};
}
