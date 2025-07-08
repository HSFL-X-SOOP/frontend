import React, {useEffect, useRef} from "react";
import {MapVisualization} from "@/mapVisualization/MapVisualization";

interface MapWrapperProps {
    temperatureVisible: boolean;
    windDirectionVisible: boolean;
}

const MapWrapper: React.FC<MapWrapperProps> = ({temperatureVisible, windDirectionVisible}) => {
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
        </div>
    );
};

export default MapWrapper;