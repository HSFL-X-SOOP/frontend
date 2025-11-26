import {Home, Minus, Navigation, Plus} from "@tamagui/lucide-icons";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {useTheme} from "tamagui";

type MapZoomControlProps = {
    zoomLevel: number;
    minMaxZoomLevel: { min: number; max: number };
    setZoomLevel: (level: number) => void;
    setCurrentCoordinate: (coord: [number, number]) => void;
    homeCoordinate: [number, number];
    setBearing: (bearing: number) => void;
    setPitch: (pitch: number) => void;
    bearing: number;
};

export default function MapZoomControl({
                                           zoomLevel,
                                           minMaxZoomLevel,
                                           setZoomLevel,
                                           setCurrentCoordinate,
                                           homeCoordinate,
                                           setBearing,
                                           setPitch,
                                           bearing
                                       }: MapZoomControlProps) {
    const t = useTheme();
    const NAVIGATION_ICON_ROTATION_OFFSET = 45; // Adjust this value based on the icon design

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, {
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    backgroundColor: t.background?.val
                }]}
                onPress={() => {
                    if (zoomLevel < minMaxZoomLevel.max) {
                        setZoomLevel(zoomLevel + 1);
                    }
                }}
                activeOpacity={0.7}
            >
                <Plus color={t.color?.val} size={20}/>
            </TouchableOpacity>

            {/* Linie */}
            <View style={{height: 1, backgroundColor: t.borderColor?.val}}/>

            {/* Navigation/Kompass */}
            <TouchableOpacity
                style={[styles.button, {backgroundColor: t.background?.val}]}
                onPress={() => {
                    setBearing(0);
                    setPitch(0);
                }}
                activeOpacity={0.7}
            >
                <View style={{transform: [{rotate: `${bearing - NAVIGATION_ICON_ROTATION_OFFSET}deg`}]}}>
                    <Navigation color={t.color?.val} size={20}/>
                </View>
            </TouchableOpacity>

            {/* Linie */}
            <View style={{height: 1, backgroundColor: t.borderColor?.val}}/>

            {/* Home Button */}
            <TouchableOpacity
                style={[styles.button, {backgroundColor: t.background?.val}]}
                onPress={() => setCurrentCoordinate(homeCoordinate)}
                activeOpacity={0.7}
            >
                <Home color={t.color?.val} size={20}/>
            </TouchableOpacity>

            {/* Linie */}
            <View style={{height: 1, backgroundColor: t.borderColor?.val}}/>

            <TouchableOpacity
                style={[styles.button, {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                    backgroundColor: t.background?.val
                }]}
                onPress={() => {
                    if (zoomLevel > minMaxZoomLevel.min) {
                        setZoomLevel(zoomLevel - 1);
                    }
                }}
                activeOpacity={0.7}
            >
                <Minus color={t.color?.val} size={20}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 20,
        bottom: 100,
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
    },
    button: {
        width: 44,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.18,
        shadowRadius: 3,
        elevation: 3,
    }
});