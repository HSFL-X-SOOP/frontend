import {useSensorDataNew} from "@/hooks/useSensors";
import {useSupercluster, useMapFilters, useMapCamera, useMapState, useMapStyle} from "@/hooks/map";
import {useMapSpeedDialActions} from "@/hooks/map";
import {MapView, Camera, type CameraRef} from "@maplibre/maplibre-react-native";
import {useMemo, useRef} from "react";
import {View} from "react-native";
import SensorMarker from "./map/markers/native/SensorMarker";
import ClusterMarker from "./map/markers/native/ClusterMarker";
import MapSensorBottomSheet, {MapSensorBottomSheetRef} from "./map/controls/MapSensorBottomSheet";
import SensorList from "./map/sensors/SensorList";
import {SpeedDial} from "@/components/speeddial";
import {Plus} from "@tamagui/lucide-icons";
import MapFilterButton, {MapFilterState} from "./map/controls/MapFilterButton";
import {useTranslation} from '@/hooks/useTranslation';

interface MapProps {
    module1Visible?: boolean;
    module2Visible?: boolean;
    module3Visible?: boolean;
    isDark?: boolean;
}

const MAP_CONSTANTS = {
    highlightDuration: 3000,
    animationDuration: 500,
    zoomLevels: {
        min: 3,
        max: 18,
        sensorDetail: 12
    }
};

export default function NativeMap(props: MapProps) {
    const {isDark = false} = props;
    const {t} = useTranslation();

    // REFS
    const mapRef = useRef<MapView>(null);
    const cameraRef = useRef<CameraRef>(null);
    const bottomSheetRef = useRef<MapSensorBottomSheetRef>(null);
    const hasSnappedForGestureRef = useRef(false);

    // DATA
    const {data: content, loading} = useSensorDataNew();

    // CONSOLIDATED HOOKS - Extract shared logic
    const {
        module1Visible, setModule1Visible,
        module2Visible, setModule2Visible,
        module3Visible, setModule3Visible,
        filteredContent
    } = useMapFilters(content, props.module1Visible, props.module2Visible, props.module3Visible);

    // Create consolidated filter state
    const filterState: MapFilterState = {
        module1Visible,
        module2Visible,
        module3Visible,
    };

    const handleFilterChange = (newState: MapFilterState) => {
        if (newState.module1Visible !== module1Visible) setModule1Visible(newState.module1Visible);
        if (newState.module2Visible !== module2Visible) setModule2Visible(newState.module2Visible);
        if (newState.module3Visible !== module3Visible) setModule3Visible(newState.module3Visible);
    };

    const {
        viewportBounds, setViewportBounds,
        zoomLevel, setZoomLevel,
        center, setCenter,
        bounds
    } = useMapCamera();

    const {
        isDrawerOpen, setIsDrawerOpen,
        isFilterOpen, setIsFilterOpen,
        highlightedSensorId, setHighlightedSensorId,
        toggleDrawer, toggleFilter, clearHighlight
    } = useMapState();

    const { mapStyle } = useMapStyle(isDark);

    const visibleSensors = useMemo(() => {
        return filteredContent.filter(sensor => {
            // Type guard for location and coordinates
            if (!sensor.location?.coordinates) return false;

            const {lat, lon} = sensor.location.coordinates;
            return (
                lon >= bounds[0] &&
                lat >= bounds[1] &&
                lon <= bounds[2] &&
                lat <= bounds[3]
            );
        });
    }, [filteredContent, bounds]);

    // CLUSTERING
    const {clusters, getClusterExpansionZoom} = useSupercluster(
        filteredContent,
        bounds,
        zoomLevel
    );

    const pins = useMemo(() => {
        return clusters.map(cluster => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {cluster: isCluster, point_count, locationWithBoxes} = cluster.properties;

            if (isCluster) {
                return (
                    <ClusterMarker
                        key={`cluster-${cluster.id}`}
                        latitude={latitude}
                        longitude={longitude}
                        pointCount={point_count!}
                        clusterId={cluster.id as number}
                        onPress={() =>
                            handleClusterPress(longitude, latitude, cluster.id as number)
                        }
                    />
                );
            }

            return (
                <SensorMarker
                    key={locationWithBoxes!.location.id}
                    locationWithBoxes={locationWithBoxes!}
                />
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clusters, getClusterExpansionZoom, highlightedSensorId]);

    // ========== CAMERA HELPERS ==========

    const setCameraSafe = (options: Parameters<CameraRef["setCamera"]>[0]) => {
        cameraRef.current?.setCamera({
            animationDuration: MAP_CONSTANTS.animationDuration,
            ...options,
        });
    };

    const flyTo = (lon: number, lat: number, zoom?: number) => {
        const targetZoom = zoom ?? Math.max(zoomLevel, MAP_CONSTANTS.zoomLevels.sensorDetail);
        setCameraSafe({
            centerCoordinate: [lon, lat],
            zoomLevel: targetZoom,
        });
        setCenter([lon, lat]);
        setZoomLevel(targetZoom);
    };

    // ========== EVENTS ==========

    const handleSensorSelect = (sensor: LocationWithBoxes) => {
        const {lat, lon} = sensor.location.coordinates;
        setHighlightedSensorId(sensor.location.id);
        flyTo(lon, lat);
        bottomSheetRef.current?.snapToPeek();
        setTimeout(() => setHighlightedSensorId(null), MAP_CONSTANTS.highlightDuration);
    };

    const handleClusterPress = (longitude: number, latitude: number, clusterId: number) => {
        const expansionZoom = getClusterExpansionZoom(clusterId);
        flyTo(longitude, latitude, expansionZoom);
    };

    const handleRegionIsChanging = () => {
        // Nur max. einmal pro Geste snappen, keine States!
        if (isDrawerOpen && !hasSnappedForGestureRef.current) {
            bottomSheetRef.current?.snapToPeek();
            hasSnappedForGestureRef.current = true;
        }
    };

    const handleRegionDidChange = async () => {
        hasSnappedForGestureRef.current = false;

        try {
            const map = mapRef.current;
            if (!map) return;

            const [visibleBounds, currentZoom] = await Promise.all([
                map.getVisibleBounds?.(),
                map.getZoom?.()
            ]);

            if (!visibleBounds || visibleBounds.length !== 2) return;

            const [a, b] = visibleBounds as [number[], number[]];

            const west = Math.min(a[0], b[0]);
            const south = Math.min(a[1], b[1]);
            const east = Math.max(a[0], b[0]);
            const north = Math.max(a[1], b[1]);

            const [prevWest, prevSouth, prevEast, prevNorth] = viewportBounds;
            const threshold = 0.0001;

            const boundsChanged =
                Math.abs(west - prevWest) > threshold ||
                Math.abs(south - prevSouth) > threshold ||
                Math.abs(east - prevEast) > threshold ||
                Math.abs(north - prevNorth) > threshold;

            if (boundsChanged) {
                setViewportBounds([west, south, east, north]);
            }

            if (typeof currentZoom === 'number' && Math.abs(currentZoom - zoomLevel) > 0.01) {
                setZoomLevel(currentZoom);
            }

            const newLon = (west + east) / 2;
            const newLat = (south + north) / 2;
            if (
                Math.abs(newLon - center[0]) > threshold ||
                Math.abs(newLat - center[1]) > threshold
            ) {
                setCenter([newLon, newLat]);
            }
        } catch (error) {
            console.debug('Error getting map state:', error);
        }
    };

    // ========== SPEED DIAL ==========

    const handleZoomIn = async () => {
        const currentZoom = (await mapRef.current?.getZoom?.()) ?? zoomLevel;
        if (currentZoom < MAP_CONSTANTS.zoomLevels.max) {
            const newZoom = currentZoom + 1;
            setCameraSafe({zoomLevel: newZoom});
            setZoomLevel(newZoom);
        }
    };

    const handleZoomOut = async () => {
        const currentZoom = (await mapRef.current?.getZoom?.()) ?? zoomLevel;
        if (currentZoom > MAP_CONSTANTS.zoomLevels.min) {
            const newZoom = currentZoom - 1;
            setCameraSafe({zoomLevel: newZoom});
            setZoomLevel(newZoom);
        }
    };

    const handleResetView = () => {
        setCameraSafe({heading: 0, pitch: 0});
    };

    const handleGoHome = () => {
        flyTo(
            MAP_CONSTANTS.homeCoordinate[0],
            MAP_CONSTANTS.homeCoordinate[1],
            MAP_CONSTANTS.zoomLevels.default
        );
    };

    const speedDialActions = useMapSpeedDialActions({
        setIsDrawerOpen,
        setIsFilterOpen,
        onZoomIn: handleZoomIn,
        onZoomOut: handleZoomOut,
        onResetView: handleResetView,
        onGoHome: handleGoHome,
    });

    // ========== RENDER ==========

    return (
        <View style={{flex: 1, backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5'}}>
            <MapView
                ref={mapRef}
                style={{flex: 1}}
                mapStyle={mapStyle}
                compassEnabled
                zoomEnabled
                onRegionIsChanging={handleRegionIsChanging}
                onRegionDidChange={handleRegionDidChange}
            >
                <Camera
                    ref={cameraRef}
                    defaultSettings={{
                        centerCoordinate: MAP_CONSTANTS.homeCoordinate,
                        zoomLevel: MAP_CONSTANTS.zoomLevels.default,
                        pitch: 0,
                        heading: 0,
                    }}
                />
                {pins}
            </MapView>

            <SpeedDial
                placement="bottom-right"
                labelPlacement="left"
                portal={false}
                icon={Plus}
                actions={speedDialActions}
                fabSize="$6"
                gap="$2"
            />

            <MapSensorBottomSheet
                ref={bottomSheetRef}
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
            >
                <SensorList
                    sensors={visibleSensors}
                    allSensors={filteredContent}
                    onSensorSelect={handleSensorSelect}
                    highlightedSensorId={highlightedSensorId}
                    loading={loading}
                    mapCenter={center}
                    horizontal
                />
            </MapSensorBottomSheet>

            <MapFilterButton
                filterState={filterState}
                onFilterChange={handleFilterChange}
                isOpen={isFilterOpen}
                onOpenChange={setIsFilterOpen}
            />
        </View>
    );
}
