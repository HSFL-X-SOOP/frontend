import Style from 'ol/style/Style.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Text from 'ol/style/Text.js';
import { GetGeomarData } from './geomar-data';

function createListOfGeomarSensorData(geomarData) {
    let list = [];
    geomarData.forEach(data => {
        list.push(createGeomarSensorData(data));
    });
    return list;
}

function createGeomarSensorData(data) {
    let name = data["location"]["name"];
    let lat = data["location"]["coordinates"]["lat"];
    let lon = data["location"]["coordinates"]["lon"];
    let sensorData = getSensorDataOfList(data["latestMeasurements"]);

    return {
        "name": name,
        "sensor_name": "Water Level Temperature Sensor",
        "module_name": "Modul 1",
        "coord": {
            "lon": lon,
            "lat": lat
        },
        "data": sensorData
    };
}

function getSensorDataOfList(list) {
    let time = "";
    let waterTemp = "";
    let waterTempSymbol = "";
    let standardDeviation = "";
    let standardDeviationSymbol = "";
    let volt = "";
    let voltSymbol = "";
    let tide = "";
    let tideSymbol = "";
    let waveHeight = "";
    let waveHeightSymbol = "";
    list.forEach(element => {
        switch (element["measurementType"]["name"]) {
            case "Temperature, water":
            case "WTemp":
                waterTemp = element["value"];
                waterTempSymbol = element["measurementType"]["unitSymbol"];
                time = element["time"];
                break;
            case "Standard deviation":
                standardDeviation = element["value"];
                standardDeviationSymbol = element["measurementType"]["unitSymbol"];
                break;
            case "Battery, voltage":
                volt = element["value"];
                voltSymbol = element["measurementType"]["unitSymbol"];
                break;
            case "Tide":
                tide = element["value"];
                tideSymbol = element["measurementType"]["unitSymbol"];
                break;
            case "Wave Height":
                waveHeight = element["value"];
                waveHeightSymbol = element["measurementType"]["unitSymbol"];
                break;
        }
    });
    return {
        "time": time,
        "waterTemp": waterTemp,
        "waterTempSymbol": waterTempSymbol,
        "standardDeviation": standardDeviation,
        "standardDeviationSymbol": standardDeviationSymbol,
        "volt": volt,
        "voltSymbol": voltSymbol,
        "tide": tide,
        "tideSymbol": tideSymbol,
        "waveHeight": waveHeight,
        "waveHeightSymbol": waveHeightSymbol
    };
}

async function loadWaterLevelTemperatureSensorData() {
    const geomarData = await GetGeomarData();
    return createListOfGeomarSensorData(geomarData);
}

function createWaterLevelTemperatureSensorStyle(feature) {
    const data = feature.get('data');

    const circle = new Style({
        image: new CircleStyle({
            radius: 15,
            fill: new Fill({ color: 'rgba(0, 153, 255, 0.5)' }),
            stroke: new Stroke({ color: '#0066cc', width: 1 })
        }),
        text: new Text({
            font: '14px Calibri,sans-serif',
            text: "M1",  // Use the 'name' property for the label
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
            offsetY: -15,
        })
    });

    return circle;
}

function createWaterLevelTemperatureSensorStyleSelected(feature, stroke_color) {
    const data = feature.get('data');

    const circle = new Style({
        image: new CircleStyle({
            radius: 15,
            fill: new Fill({ color: 'rgba(0, 153, 255, 0.5)' }),
            stroke: new Stroke({ color: stroke_color, width: 1 })
        }),
        text: new Text({
            font: '14px Calibri,sans-serif',
            text: "M1",  // Use the 'name' property for the label
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
            offsetY: -15,
        })
    });

    return circle;
}

const waterLevelTemperatureSensorStyle = function (feature) {
    return createWaterLevelTemperatureSensorStyle(feature);
};

function WaterLevelTemperaturePopoverContent(feature) {
    const data = feature.get("data");
    const coord = feature.get("coord");
    return `
    <p class="p-0 m-0">Ort: ${feature.get("name")}</p>\n
    <p class="p-0 m-0">Longitude: ${coord.lon}</p>\n
    <p class="p-0 m-0">Latitude: ${coord.lat}</p>\n
    <p class="p-0 m-0">Standard Deviation: ${data.standardDeviation}${data.standardDeviationSymbol}</p>\n
    <p class="p-0 m-0">Wave Height: ${data.waveHeight}${data.waveHeightSymbol}</p>\n
    <p class="p-0 m-0">Tide: ${data.tide}${data.tideSymbol}</p>\n
    <p class="p-0 m-0">Water Temperature: ${data.waterTemp}${data.waterTempSymbol}</p>\n
    <p class="p-0 m-0">Battery Voltage: ${data.volt}${data.voltSymbol}</p>
    <p class="p-0 m-0">Time: ${data.time}</p>
    `;
}

function showWaterLevelTemperatureSensorData(feature) {
    let selectedSensorData = document.getElementById("selected-sensor-data");
    let sensorDataHeader = document.createElement("h2");
    let sensor_name = document.createElement("p");
    let info = document.createElement("div");

    selectedSensorData.innerHTML = "";
    sensorDataHeader.textContent = "Sensor Data";
    sensor_name.textContent = "Sensor Name: " + feature.get("sensor_name");
    info.innerHTML = WaterLevelTemperaturePopoverContent(feature);

    selectedSensorData.append(sensorDataHeader, sensor_name, info);
}

export {
    createGeomarSensorData,
    createWaterLevelTemperatureSensorStyleSelected,
    waterLevelTemperatureSensorStyle,
    loadWaterLevelTemperatureSensorData,
    showWaterLevelTemperatureSensorData,
    WaterLevelTemperaturePopoverContent
};