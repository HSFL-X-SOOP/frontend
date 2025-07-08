import React, {useEffect, useRef} from "react";
import {MapVisualization} from "@/mapVisualization/MapVisualization";

interface MapWrapperProps {
    module1Visible: boolean;
    module2Visible: boolean;
    module3Visible: boolean;
    temperatureVisible: boolean;
    windDirectionVisible: boolean;
}

const MapWrapper: React.FC<MapWrapperProps> = ({module1Visible, module2Visible, module3Visible, temperatureVisible, windDirectionVisible}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (mapContainerRef.current) {
            mapInstanceRef.current = new MapVisualization(mapContainerRef.current.id, {
                center: [9.432, 54.798],
                zoom: 10,
            });
        }
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
            }
        };
    }, []);

    useEffect(() => {
        // Jetzt ist das DOM garantiert da!
        const popup = document.getElementById('popup');
        if (!popup) {
            console.error("Popup-Element nicht gefunden!");
        } else {
            console.log("Popup-Element gefunden:", popup);
        }
    }, []); // Leeres Array: läuft nach dem ersten Render

    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setModuleVisibility("WaterLevelTemperature", module1Visible);
        }
    }, [module1Visible]);

    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setModuleVisibility("AirProperties", module2Visible);
        }
    }, [module2Visible]);

    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setModuleVisibility("AirQuality", module3Visible);
        }
    }, [module3Visible]);

    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setOverlayVisibility("temperature", temperatureVisible);
        }
    }, [temperatureVisible]);

    useEffect(() => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setOverlayVisibility("windDirection", windDirectionVisible);
        }
    }, [windDirectionVisible]);


    return (
        <div className={"w-full h-full relative"}>
            <div id="map" ref={mapContainerRef} className={"dark:bg-secondary-500 w-full h-full"}/>
            <div id="temperature-overlay"
                 className="absolute top-0 left-0 w-full h-full pointer-events-none bg-transparent overflow-hidden box-border"
                 style={{display: "none"}}/>
            <div id="wind-direction-overlay"
                 className="absolute top-0 left-0 w-full h-full pointer-events-none bg-transparent overflow-hidden box-border"
                 style={{display: "none"}}/>
            <div id="popup"></div>
        </div>
    );
};

export default MapWrapper;