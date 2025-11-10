import {useSensorDataNew} from "@/hooks/useSensors";
import {useSupercluster} from "@/hooks/useSupercluster";
import {Camera, MapView} from "@maplibre/maplibre-react-native";
import {useMemo, useState, useRef} from "react";
import {View} from "react-native";
import SensorMarker from "./map/markers/native/SensorMarker";
import ClusterMarker from "./map/markers/native/ClusterMarker";
import {BoxType, LocationWithBoxes} from "@/api/models/sensor";
import MapSensorBottomSheet, {MapSensorBottomSheetRef} from "./map/controls/MapSensorBottomSheet";
import SensorList from "./map/sensors/SensorList";
import {SpeedDial} from "@/components/speeddial";
import {Plus, Home, Navigation, ZoomIn, ZoomOut, List, Filter} from "@tamagui/lucide-icons";
import MapFilterButton from "./map/controls/MapFilterButton";
import {useTranslation} from '@/hooks/useTranslation';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface MapProps {
    module1Visible?: boolean;
    module2Visible?: boolean;
    module3Visible?: boolean;
    isDark?: boolean;
}

// ==========================================
// CONSTANTS
// ==========================================
const MAP_CONSTANTS = {
    homeCoordinate: [9.26, 54.47926] as [number, number],
    zoomLevels: {
        min: 3,
        max: 18,
        default: 7,
        sensorDetail: 12
    },
    boundaries: {
        ne: [49.869301, 71.185001],
        sw: [-31.266001, 27.560001]
    },
    highlightDuration: 3000, // ms
    animationDuration: 500   // ms
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function NativeMap(props: MapProps) {
    const {isDark = false} = props;
    const {t} = useTranslation();

    // ==========================================
    // REFS
    // ==========================================
    const mapRef = useRef<any>(null);
    const bottomSheetRef = useRef<MapSensorBottomSheetRef>(null);

    // ==========================================
    // DATA FETCHING
    // ==========================================
    const {data: content, loading} = useSensorDataNew();

    // ==========================================
    // FILTER STATES
    // ==========================================
    const [module1Visible, setModule1Visible] = useState(props.module1Visible ?? true);
    const [module2Visible, setModule2Visible] = useState(props.module2Visible ?? true);
    const [module3Visible, setModule3Visible] = useState(props.module3Visible ?? false);

    // ==========================================
    // MAP VIEW STATES
    // ==========================================
    const [zoomLevel, setZoomLevel] = useState(MAP_CONSTANTS.zoomLevels.default);
    const [bearing, setBearing] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [currentCoordinate, setCurrentCoordinate] = useState<[number, number]>(MAP_CONSTANTS.homeCoordinate);
    const [viewportBounds, setViewportBounds] = useState<[number, number, number, number]>([
        MAP_CONSTANTS.boundaries.sw[0],
        MAP_CONSTANTS.boundaries.sw[1],
        MAP_CONSTANTS.boundaries.ne[0],
        MAP_CONSTANTS.boundaries.ne[1]
    ]);

    // ==========================================
    // UI STATES
    // ==========================================
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [highlightedSensorId, setHighlightedSensorId] = useState<number | null>(null);

    // ==========================================
    // COMPUTED VALUES
    // ==========================================
    const bounds: [number, number, number, number] = useMemo(() => viewportBounds, [viewportBounds]);

    const mapStyle = useMemo(() => {
        return isDark
            ? require('@/assets/mapStyles/dark_mode_new.json')
            : require('@/assets/mapStyles/light_mode_new.json');
    }, [isDark]);

    // Filter sensors based on module visibility
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

    // Filter sensors visible in current viewport
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

    // ==========================================
    // CLUSTERING
    // ==========================================
    const {clusters, getClusterExpansionZoom} = useSupercluster(
        filteredContent,
        bounds,
        zoomLevel
    );

    // Create markers from clusters
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
                        onPress={() => handleClusterPress(longitude, latitude, cluster.id as number)}
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

    // ==========================================
    // EVENT HANDLERS
    // ==========================================

    /**
     * Handle sensor selection from the list
     */
    const handleSensorSelect = (sensor: LocationWithBoxes) => {
        const {lat, lon} = sensor.location.coordinates;
        setHighlightedSensorId(sensor.location.id);

        // Zoom in if needed
        setZoomLevel(Math.max(zoomLevel, MAP_CONSTANTS.zoomLevels.sensorDetail));
        setCurrentCoordinate([lon, lat]);

        // Snap bottom sheet to peek position
        bottomSheetRef.current?.snapToPeek();

        // Clear highlight after duration
        setTimeout(() => {
            setHighlightedSensorId(null);
        }, MAP_CONSTANTS.highlightDuration);
    };

    /**
     * Handle cluster press to expand
     */
    const handleClusterPress = (longitude: number, latitude: number, clusterId: number) => {
        const expansionZoom = getClusterExpansionZoom(clusterId);
        setZoomLevel(expansionZoom);
        setCurrentCoordinate([longitude, latitude]);
    };

    /**
     * Handle map region changes
     */
    const handleRegionIsChanging = (region: any) => {
        // Snap bottom sheet immediately when map starts moving
        bottomSheetRef.current?.snapToPeek();

        setBearing(region.heading || 0);
        setPitch(region.pitch || 0);
    };

    /**
     * Handle when map region change completes
     */
    const handleRegionDidChange = async () => {
        try {
            // Update viewport bounds
            const bounds = await mapRef.current?.getVisibleBounds();
            if (bounds && bounds.length === 2) {
                const [[east, north], [west, south]] = bounds;
                setViewportBounds([west, south, east, north]);
            }

            // Update zoom level
            const zoom = await mapRef.current?.getZoom();
            if (typeof zoom === 'number') {
                setZoomLevel(zoom);
            }

            // Update center coordinate
            const center = await mapRef.current?.getCenter();
            if (center && center.length === 2) {
                setCurrentCoordinate(center);
            }
        } catch {
            // Silently handle errors
        }
    };

    // ==========================================
    // SPEED DIAL ACTIONS
    // ==========================================
    const speedDialActions = [
        {
            key: 'sensors',
            label: t('navigation.sensors'),
            icon: List,
            onPress: () => setIsDrawerOpen(!isDrawerOpen),
        },
        {
            key: 'filter',
            label: t('map.filters'),
            icon: Filter,
            onPress: () => setIsFilterOpen(true),
        },
        {
            key: 'zoomin',
            label: 'Zoom In',
            icon: ZoomIn,
            onPress: () => {
                if (zoomLevel < MAP_CONSTANTS.zoomLevels.max) {
                    setZoomLevel(zoomLevel + 1);
                }
            },
        },
        {
            key: 'zoomout',
            label: 'Zoom Out',
            icon: ZoomOut,
            onPress: () => {
                if (zoomLevel > MAP_CONSTANTS.zoomLevels.min) {
                    setZoomLevel(zoomLevel - 1);
                }
            },
        },
        {
            key: 'compass',
            label: 'Reset View',
            icon: Navigation,
            onPress: () => {
                setBearing(0);
                setPitch(0);
            },
        },
        {
            key: 'home',
            label: 'Go Home',
            icon: Home,
            onPress: () => setCurrentCoordinate(MAP_CONSTANTS.homeCoordinate),
        },
    ];

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <View style={{flex: 1, backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5'}}>
            {/* Main Map View */}
            <MapView
                ref={mapRef}
                style={{flex: 1}}
                mapStyle={mapStyle}
                compassEnabled={true}
                zoomEnabled={true}
                onRegionIsChanging={handleRegionIsChanging}
                onRegionDidChange={handleRegionDidChange}
            >
                <Camera
                    zoomLevel={zoomLevel}
                    centerCoordinate={currentCoordinate}
                    maxZoomLevel={MAP_CONSTANTS.zoomLevels.max}
                    minZoomLevel={MAP_CONSTANTS.zoomLevels.min}
                    animationDuration={MAP_CONSTANTS.animationDuration}
                    pitch={pitch}
                    heading={bearing}
                />
                {pins}
            </MapView>

            {/* Floating Action Button with Speed Dial */}
            <SpeedDial
                placement="bottom-right"
                labelPlacement="left"
                portal={false}
                icon={Plus}
                actions={speedDialActions}
                fabSize="$6"
                gap="$2"
            />

            {/* Bottom Sheet for Sensor List */}
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

            {/* Filter Modal */}
            <MapFilterButton
                module1Visible={module1Visible}
                setModule1Visible={setModule1Visible}
                module2Visible={module2Visible}
                setModule2Visible={setModule2Visible}
                module3Visible={module3Visible}
                setModule3Visible={setModule3Visible}
                isOpen={isFilterOpen}
                onOpenChange={setIsFilterOpen}
            />
        </View>
    );
}