import Map from 'ol/Map.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/Vector.js';
import {fromLonLat} from 'ol/proj';
import Select from 'ol/interaction/Select.js';
import {singleClick} from 'ol/events/condition.js';
import Style from 'ol/style/Style.js';
import LayerGroup from 'ol/layer/Group.js';
import {apply} from 'ol-mapbox-style';
import {
    AirPropertiesPopoverContent,
    airPropertiesSensorStyle,
    showAirPropertiesSensorData,
    createAirPropertiesSensorVectorSource,
    createAirPropertiesSensorStyleSelected
} from './data/air-properties-sensor.js';
import {
    AirQualityPopoverContent,
    airQualitySensorStyle,
    airQualitySensorData,
    showAirQualitySensorData,
    createAirQualitySensorStyleSelected
} from './data/air-quality-sensor.js';
import {
    WaterLevelTemperaturePopoverContent,
    waterLevelTemperatureSensorStyle,
    showWaterLevelTemperatureSensorData,
    createWaterLevelTemperatureSensorStyleSelected, loadWaterLevelTemperatureSensorData
} from './data/water-level-temperature-sensor.js';
import {createSensorDataVectorSource} from './data/sensor-utils.js';
import {ShowPopover, DisposePopover} from './popover.js';
import {DrawOverlay} from './overlays/overlay.js';
import openFreeMapStyle from "./style.json";
import { base } from 'framer-motion/client';

export class MapVisualization {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            center: [9.432, 54.798],
            zoom: 10,
            ...options
        };

        this.map = null;
        this.layers = {};
        this.overlays = {};
        this.eventListeners = {};
        this.selectedFeature = null;
        this.sensorData = null;
        this.airPropertiesSensorVectorSource = null;

        this.init();
    }

    async init() {
        this.createMap();
        await this.createLayers();
        this.createOverlays();
        this.setupEventListeners();
    }

    createMap() {
        this.openfreemap = new LayerGroup();

        this.map = new Map({
            layers: [this.openfreemap],
            target: this.containerId,
            view: new View({
                center: fromLonLat(this.options.center),
                zoom: this.options.zoom,
            }),
        });

        apply(this.openfreemap, openFreeMapStyle);
    }

    async createLayers() {
        this.airPropertiesSensorVectorSource = await createAirPropertiesSensorVectorSource();
        this.layers.airProperties = new VectorLayer({
            source: this.airPropertiesSensorVectorSource,
            visible: false,
            title: "AirProperties",
            style: airPropertiesSensorStyle,
        });

        this.layers.airQuality = new VectorLayer({
            source: createSensorDataVectorSource(airQualitySensorData),
            visible: false,
            title: "AirQuality",
            style: airQualitySensorStyle,
        });

        const waterLevelTemperatureData = await loadWaterLevelTemperatureSensorData();
        const waterLevelTemperatureSource = createSensorDataVectorSource(waterLevelTemperatureData);
        this.layers.waterLevelTemperature = new VectorLayer({
            source: waterLevelTemperatureSource,
            visible: false,
            title: "WaterLevelTemperature",
            style: waterLevelTemperatureSensorStyle,
        });

        Object.values(this.layers).forEach(layer => {
            this.map.addLayer(layer);
        });
    }

    createOverlays() {
        this.overlays.temperature = document.getElementById('temperature-overlay');
        this.overlays.windDirection = document.getElementById('wind-direction-overlay');
    }

    setupEventListeners() {
        const selectInteraction = new Select({
            condition: singleClick,
            style: (feature) => this.getSelectedStyle(feature)
        });
        this.map.addInteraction(selectInteraction);

        this.map.on('click', (evt) => this.handleMapClick(evt));
        this.map.on('moveend', () => this.handleMapMoveEnd());
    }

    getSelectedStyle(feature) {
        let selectedColor = "#D3AF37";
        let style = new Style();

        switch (feature.get("module_name")) {
            case "Modul 1":
                style = createWaterLevelTemperatureSensorStyleSelected(feature, selectedColor);
                break;
            case "Modul 2":
                style = createAirPropertiesSensorStyleSelected(feature, selectedColor);
                break;
            case "Modul 3":
                style = createAirQualitySensorStyleSelected(feature, selectedColor);
                break;
        }
        return style;
    }

    handleMapClick(evt) {
        const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
            this.selectedFeature = feature;

            switch (feature.get("sensor_name")) {
                case "Air Properties Sensor":
                    this.sensorData = showAirPropertiesSensorData(feature);
                    ShowPopover(this.overlays.popup, this.overlays.popup.getElement(), evt, feature, AirPropertiesPopoverContent(feature));
                    break;
                case "Air Quality Sensor":
                    this.sensorData = showAirQualitySensorData(feature);
                    ShowPopover(this.overlays.popup, this.overlays.popup.getElement(), evt, feature, AirQualityPopoverContent(feature));
                    break;
                case "Water Level Temperature Sensor":
                    this.sensorData = showWaterLevelTemperatureSensorData(feature);
                    ShowPopover(this.overlays.popup, this.overlays.popup.getElement(), evt, feature, WaterLevelTemperaturePopoverContent(feature));
                    break;
            }

            this.emit('featureSelected', {feature, sensorData: this.sensorData});
            return feature;
        });

        if (!feature) {
            DisposePopover(this.overlays.popup.getElement());
            this.selectedFeature = null;
            this.sensorData = null;
            this.emit('featureDeselected');
        }
    }

    handleMapMoveEnd() {
        if (this.overlays && this.overlays.temperature && this.overlays.temperature.style.display !== "none") {
            DrawOverlay(this.map, this.airPropertiesSensorVectorSource, this.overlays.temperature, 10, 10, "Temperature");
        }
        if (this.overlays && this.overlays.windDirection && this.overlays.windDirection.style.display !== "none") {
            DrawOverlay(this.map, this.airPropertiesSensorVectorSource, this.overlays.windDirection, 10, 10, "WindDirection");
        }
        this.map.render();
    }

    setOverlayVisibility(overlayName, visible) {
        if (this.overlays[overlayName]) {
            this.overlays[overlayName].style.display = visible ? "" : "none";
            if (visible) {
                if (overlayName === "temperature") {
                    DrawOverlay(this.map, this.airPropertiesSensorVectorSource, this.overlays.temperature, 10, 10, "Temperature");
                }
                if (overlayName === "windDirection") {
                    DrawOverlay(this.map, this.airPropertiesSensorVectorSource, this.overlays.windDirection, 10, 10, "WindDirection");
                }
            }
        }
    }

    setModuleVisibility(moduleName, visible) {
        this.map.getLayers().forEach(function(element, index, array){
            let baseVectorLayerTitle = element.get('title')
            if (element instanceof VectorLayer && baseVectorLayerTitle == moduleName){
                element.setVisible(visible)
            }
        })
    }

    toggleLayer(layerName) {
        if (layerName === 'temperature' && this.overlays.temperature) {
            const isVisible = this.overlays.temperature.style.display !== 'none';
            this.overlays.temperature.style.display = isVisible ? 'none' : '';
            if (!isVisible) {
                DrawOverlay(this.map, this.airPropertiesSensorVectorSource, this.overlays.temperature, 10, 10, "Temperature");
            }
        }
        if (layerName === 'windDirection' && this.overlays.windDirection) {
            const isVisible = this.overlays.windDirection.style.display !== 'none';
            this.overlays.windDirection.style.display = isVisible ? 'none' : '';
            if (!isVisible) {
                DrawOverlay(this.map, this.airPropertiesSensorVectorSource, this.overlays.windDirection, 10, 10, "WindDirection");
            }
        }
    }

    setLayerVisibility(layerName, visible) {
        if (this.layers[layerName]) {
            this.layers[layerName].setVisible(visible);
            this.emit('layerVisibilityChanged', {layerName, visible});
        }
    }

    setView(center, zoom) {
        this.map.getView().setCenter(fromLonLat(center));
        this.map.getView().setZoom(zoom);
        this.emit('viewChanged', {center, zoom});
    }

    getSelectedFeature() {
        return this.selectedFeature;
    }

    getSensorData() {
        return this.sensorData;
    }

    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    off(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }

    destroy() {
        if (this.map) {
            this.map.setTarget(null);
            this.map = null;
        }

        this.eventListeners = {};
    }
} 