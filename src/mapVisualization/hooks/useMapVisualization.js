/*
import { useEffect, useRef, useState, useCallback } from 'react';
import { MapVisualization } from '../MapVisualization.js';

export const useMapVisualization = (containerId, options = {}) => {
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [layerStates, setLayerStates] = useState({
    airProperties: true,
    airQuality: true,
    waterLevelTemperature: true,
    temperature: false,
    windDirection: false
  });

  useEffect(() => {
    if (!mapRef.current && containerId) {
      mapRef.current = new MapVisualization(containerId, options);

      mapRef.current.on('featureSelected', ({ feature, sensorData }) => {
        setSelectedFeature(feature);
        setSensorData(sensorData);
      });

      mapRef.current.on('featureDeselected', () => {
        setSelectedFeature(null);
        setSensorData(null);
      });

      mapRef.current.on('layerToggled', ({ layerName, visible }) => {
        setLayerStates(prev => ({
          ...prev,
          [layerName]: visible
        }));
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [containerId, options]);

  const toggleLayer = useCallback((layerName) => {
    if (mapRef.current) {
      console.log("Toggling layerssssdfsdfsdfsdfsdf:", layerName);
      mapRef.current.toggleLayer(layerName);
    }
  }, []);

  const setLayerVisibility = useCallback((layerName, visible) => {
    if (mapRef.current) {
      mapRef.current.setLayerVisibility(layerName, visible);
    }
  }, []);




  const setView = useCallback((center, zoom) => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, []);

  const getMap = useCallback(() => {
    return mapRef.current;
  }, []);

  return {
    map: mapRef.current,
    selectedFeature,
    sensorData,
    layerStates,
    toggleLayer,
    setLayerVisibility,
    setView,
    getMap
  };
}; */
