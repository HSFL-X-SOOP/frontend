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

interface MapProps {
    module1Visible?: boolean;
    module2Visible?: boolean;
    module3Visible?: boolean;
    isDark?: boolean;
}

export default function NativeMap(props: MapProps) {
    const {
        isDark = false
    } = props;
    const {t} = useTranslation();

    // Filter states
    const [module1Visible, setModule1Visible] = useState(props.module1Visible ?? true);
    const [module2Visible, setModule2Visible] = useState(props.module2Visible ?? true);
    const [module3Visible, setModule3Visible] = useState(props.module3Visible ?? false);
    const {data: content, loading} = useSensorDataNew();
    const mapRef = useRef<any>(null);
    const bottomSheetRef = useRef<MapSensorBottomSheetRef>(null);

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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [highlightedSensorId, setHighlightedSensorId] = useState<number | null>(null);
    const [viewportBounds, setViewportBounds] = useState<[number, number, number, number]>([
        mapBoundariesLongLat.sw[0],
        mapBoundariesLongLat.sw[1],
        mapBoundariesLongLat.ne[0],
        mapBoundariesLongLat.ne[1]
    ]);


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

        setZoomLevel(Math.max(zoomLevel, 12));
        setCurrentCoordinate([lon, lat]);

        bottomSheetRef.current?.snapToPeek();

        setTimeout(() => {
            setHighlightedSensorId(null);
        }, 3000);
    };

    const {clusters, getClusterExpansionZoom} = useSupercluster(
        filteredContent,
        bounds,
        zoomLevel
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
                            setZoomLevel(expansionZoom);
                            setCurrentCoordinate([longitude, latitude]);
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


    return (
        <View style={{flex: 1, backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5'}}>
            <MapView
                ref={mapRef}
                style={{flex: 1}}
                mapStyle={mapStyle}
                compassEnabled={true}
                zoomEnabled={true}
                onRegionIsChanging={(region: any) => {
                    // Snap sheet to peek during map movement
                    if (bottomSheetRef.current) {
                        bottomSheetRef.current.snapToPeek();
                    }
                    setBearing(region.heading || 0);
                    setPitch(region.pitch || 0);
                }}
                onRegionDidChange={async () => {
                    // Update bounds directly when region changes
                    try {
                        const bounds = await mapRef.current?.getVisibleBounds();
                        if (bounds && bounds.length === 2) {
                            // MapLibre native returns bounds as [[northeast], [southwest]]
                            const [[east, north], [west, south]] = bounds;
                            setViewportBounds([west, south, east, north]);
                        }

                        const zoom = await mapRef.current?.getZoom();
                        if (typeof zoom === 'number') {
                            setZoomLevel(zoom);
                        }

                        const center = await mapRef.current?.getCenter();
                        if (center && center.length === 2) {
                            setCurrentCoordinate(center);
                        }
                    } catch {
                        // Silently handle errors
                    }
                }}
            >
                <Camera
                    zoomLevel={zoomLevel}
                    centerCoordinate={currentCoordinate}
                    maxZoomLevel={18}
                    minZoomLevel={3}
                    animationDuration={500}
                    pitch={pitch}
                    heading={bearing}
                />
                {pins}
            </MapView>

            {/* SpeedDial mit allen Map-Aktionen */}
            <SpeedDial
                placement="bottom-right"
                labelPlacement="left"
                portal={false}
                icon={Plus}
                actions={[
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
                            if (zoomLevel < minMaxZoomLevel.max) {
                                setZoomLevel(zoomLevel + 1);
                            }
                        },
                    },
                    {
                        key: 'zoomout',
                        label: 'Zoom Out',
                        icon: ZoomOut,
                        onPress: () => {
                            if (zoomLevel > minMaxZoomLevel.min) {
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
                        onPress: () => setCurrentCoordinate(homeCoordinate),
                    },
                ]}
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
                    mapCenter={currentCoordinate}
                    horizontal
                />
            </MapSensorBottomSheet>

            {/* Filter Sheet */}
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
