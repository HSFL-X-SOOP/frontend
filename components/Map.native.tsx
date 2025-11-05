import {useSensorDataNew} from "@/hooks/useSensors";
import {useSupercluster} from "@/hooks/useSupercluster";
import {Camera, MapView} from "@maplibre/maplibre-react-native";
import {useMemo, useState, useRef} from "react";
import {View} from "react-native";
import SensorMarker from "./map/markers/native/SensorMarker";
import ClusterMarker from "./map/markers/native/ClusterMarker";
import MapZoomControl from "./map/controls/MapZoomControl";
import {BoxType, LocationWithBoxes} from "@/api/models/sensor";
import MapSensorBottomSheet, {MapSensorBottomSheetRef} from "./map/controls/MapSensorBottomSheet";
import SensorList from "./map/sensors/SensorList";
import MapDrawerToggle from "./map/controls/MapDrawerToggle";

interface MapProps {
    module1Visible?: boolean;
    module2Visible?: boolean;
    module3Visible?: boolean;
    isDark?: boolean;
}

export default function NativeMap(props: MapProps) {
    const {
        module1Visible = true,
        module2Visible = true,
        module3Visible = false,
        isDark = false
    } = props;
    const {data: content, loading} = useSensorDataNew();
    // Helpers
    const clampZoom = (z: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(z)));
    const clampFloat = (z: number, min: number, max: number) => Math.max(min, Math.min(max, z));
    const nearlyEqual = (a: number, b: number, eps = 1e-4) => Math.abs(a - b) < eps;
    const normalizeBounds = (vb: [number[], number[]]) => {
        const [p1, p2] = vb;
        const swLon = Math.min(p1[0], p2[0]);
        const neLon = Math.max(p1[0], p2[0]);
        const swLat = Math.min(p1[1], p2[1]);
        const neLat = Math.max(p1[1], p2[1]);
        return [swLon, swLat, neLon, neLat] as [number, number, number, number];
    };

    const mapRef = useRef<any>(null);
    const bottomSheetRef = useRef<MapSensorBottomSheetRef>(null);
    const scheduleApplyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const homeCoordinate: [number, number] = [9.26, 54.47926];
    const minMaxZoomLevel = {min: 3, max: 18};
    const mapBoundariesLongLat = {
        ne: [49.869301, 71.185001],
        sw: [-31.266001, 27.560001]
    };

    const [zoomLevel, setZoomLevel] = useState(7);
    const [bearing, setBearing] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [currentCoordinate, setCurrentCoordinate] = useState<[number, number]>(homeCoordinate);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [highlightedSensorId, setHighlightedSensorId] = useState<number | null>(null);
    const [viewportBounds, setViewportBounds] = useState<[number, number, number, number]>([
        mapBoundariesLongLat.sw[0],
        mapBoundariesLongLat.sw[1],
        mapBoundariesLongLat.ne[0],
        mapBoundariesLongLat.ne[1]
    ]);

    const handleSetZoomLevel = (newZoom: number | ((prev: number) => number)) => {
        const actualNewZoom = typeof newZoom === 'function' ? newZoom(zoomLevel) : newZoom;
        setZoomLevel(actualNewZoom);
    };

    const handleSetCurrentCoordinate = (newCoord: [number, number]) => {
        setCurrentCoordinate(newCoord);
    };

    const bounds: [number, number, number, number] = useMemo(() => viewportBounds, [viewportBounds]);

    const filteredContent = useMemo(() => {
        if (!content) return [];

        return content.filter(locationWithBoxes => {
            const hasWaterBoxes = locationWithBoxes.boxes.some(box =>
                box.type === BoxType.WaterBox || box.type === BoxType.WaterTemperatureOnlyBox
            );
            const hasAirBoxes = locationWithBoxes.boxes.some(box =>
                box.type === BoxType.AirBox
            );

            if (module1Visible && hasWaterBoxes) return true;
            return module2Visible && hasAirBoxes;


        });
    }, [content, module1Visible, module2Visible, module3Visible]);

    const visibleSensors = useMemo(() => {
        return filteredContent.filter(sensor => {
            const {lat, lon} = sensor.location.coordinates;
            return (
                lon >= bounds[0] &&
                lat >= bounds[1] &&
                lon <= bounds[2] &&
                lat <= bounds[3]
            );
        });
    }, [filteredContent, bounds]);

    const handleSensorSelect = (sensor: LocationWithBoxes) => {
        const {lat, lon} = sensor.location.coordinates;
        setHighlightedSensorId(sensor.location.id);

        handleSetZoomLevel(Math.max(zoomLevel, 12));
        handleSetCurrentCoordinate([lon, lat]);

        bottomSheetRef.current?.snapToPeek();

        setTimeout(() => {
            setHighlightedSensorId(null);
        }, 3000);
    };

    const integerZoom = useMemo(
        () => clampZoom(zoomLevel, minMaxZoomLevel.min, minMaxZoomLevel.max),
        [zoomLevel]
    );
    const {clusters, getClusterExpansionZoom} = useSupercluster(
        filteredContent,
        bounds,
        integerZoom
    );

    const mapStyle = useMemo(() => {
        return isDark
            ? require('@/assets/mapStyles/dark_mode_new.json')
            : require('@/assets/mapStyles/light_mode_new.json');
    }, [isDark]);

    const pins = useMemo(() => {
        return clusters.map((cluster) => {
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
                        onPress={() => {
                            const expansionZoom = getClusterExpansionZoom(cluster.id as number);
                            handleSetZoomLevel(expansionZoom);
                            handleSetCurrentCoordinate([longitude, latitude]);
                        }}
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
    }, [clusters, getClusterExpansionZoom]);

    // Centralized map state sync
    const applyMapState = async () => {
        try {
            const z = await mapRef.current?.getZoom?.();
            const center = await mapRef.current?.getCenter?.();
            const vb = await mapRef.current?.getVisibleBounds?.();
            if (typeof z === 'number') {
                const clampedZ = clampFloat(z, minMaxZoomLevel.min, minMaxZoomLevel.max);
                if (!nearlyEqual(clampedZ, zoomLevel)) setZoomLevel(clampedZ);
            }
            if (Array.isArray(center) && center.length === 2) {
                const [lng, lat] = center;
                const [curLng, curLat] = currentCoordinate;
                if (!nearlyEqual(lng, curLng) || !nearlyEqual(lat, curLat)) {
                    setCurrentCoordinate([lng, lat]);
                }
            }
            if (Array.isArray(vb) && vb.length === 2) {
                const next = normalizeBounds(vb as [number[], number[]]);
                const [b0, b1, b2, b3] = viewportBounds;
                if (
                    !nearlyEqual(next[0], b0) ||
                    !nearlyEqual(next[1], b1) ||
                    !nearlyEqual(next[2], b2) ||
                    !nearlyEqual(next[3], b3)
                ) {
                    setViewportBounds(next);
                }
            }
        } catch {}
    };

    const scheduleApply = () => {
        if (scheduleApplyRef.current) clearTimeout(scheduleApplyRef.current);
        scheduleApplyRef.current = setTimeout(() => { void applyMapState(); }, 100);
    };

    return (
        <View style={{flex: 1, backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5'}}>
            <MapView
                ref={mapRef}
                style={{flex: 1}}
                mapStyle={mapStyle}
                compassEnabled={true}
                zoomEnabled={true}
                onRegionIsChanging={(region: any) => {
                    // Snap sheet to peek during map movement (like web onMove)
                    if (bottomSheetRef.current) {
                        bottomSheetRef.current.snapToPeek();
                    }
                    setBearing(region.heading);
                    setPitch(region.pitch);
                }}
                onRegionDidChange={() => {
                    scheduleApply();
                }}
            >
                <Camera
                    zoomLevel={zoomLevel}
                    centerCoordinate={currentCoordinate}
                    maxZoomLevel={18}
                    minZoomLevel={3}
                    animationDuration={0}
                    pitch={pitch}
                    heading={bearing}
                />
                {pins}
            </MapView>

            <MapZoomControl
                zoomLevel={zoomLevel}
                minMaxZoomLevel={minMaxZoomLevel}
                setZoomLevel={handleSetZoomLevel}
                setCurrentCoordinate={handleSetCurrentCoordinate}
                homeCoordinate={homeCoordinate}
                setBearing={setBearing}
                setPitch={setPitch}
                bearing={bearing}
            />

            <MapDrawerToggle onPress={() => setIsDrawerOpen(!isDrawerOpen)} isOpen={isDrawerOpen}/>

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
                    mapCenter={currentCoordinate}
                    horizontal
                />
            </MapSensorBottomSheet>
        </View>
    );
}
