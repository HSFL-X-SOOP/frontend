import Style from 'ol/style/Style.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Text from 'ol/style/Text.js';


function createAirQualitySensorData(longitude, latitude) {
    return {
        "coord": {
            "lon": longitude,
            "lat": latitude
        },
        "sensor_name": "Air Quality Sensor",
        "module_name": "Modul 3",
        "data": {
            "trace_gases": {
                "co": 10,
                "co2": 10,
                "so2": 10,
                "no2": 10,
                "o3": 10,
            },
            "black_carbon": 10,
            "aerosols": 10,
            "battery_voltage": 10
        }
    }
}

const airQualitySensorData = [
    createAirQualitySensorData(9.436822129361424, 54.78839605311228),
]

function createAirQualitySensorStyle(feature) {
    const data = feature.get('data')

    const circle = new Style({
        image: new CircleStyle({
            radius: 15,
            fill: new Fill({color: 'rgba(236, 248, 255, 0.86)'}),
            stroke: new Stroke({color: '#0066cc', width: 1})
        }),
        text: new Text({
            font: '14px Calibri,sans-serif',
            text: "M3",  // Use the 'name' property for the label
            fill: new Fill({color: '#000'}),
            stroke: new Stroke({color: '#fff', width: 3}),
            offsetY: -15,
        })
    });

    return circle
}

function createAirQualitySensorStyleSelected(feature, stroke_color) {
    const data = feature.get('data')

    const circle = new Style({
        image: new CircleStyle({
            radius: 15,
            fill: new Fill({color: 'rgba(236, 248, 255, 0.86)'}),
            stroke: new Stroke({color: stroke_color, width: 1})
        }),
        text: new Text({
            font: '14px Calibri,sans-serif',
            text: "M3",  // Use the 'name' property for the label
            fill: new Fill({color: '#000'}),
            stroke: new Stroke({color: '#fff', width: 3}),
            offsetY: -15,
        })
    });

    return circle
}


const airQualitySensorStyle = function (feature) {
    return createAirQualitySensorStyle(feature);
}

function AirQualityPopoverContent(feature) {
    const data = feature.get("data")
    const coord = feature.get("coord")
    return `
    <p class="p-0 m-0">Module Name: ${feature.get("module_name")}</p>\n
    <p class="p-0 m-0">Longitude: ${coord.lon}</p>\n
    <p class="p-0 m-0">Latitude: ${coord.lat}</p>\n
    <p class="p-0 m-0">CO: ${data.trace_gases.co}mg/m³</p>\n
    <p class="p-0 m-0">CO2: ${data.trace_gases.co2}ppm</p>\n
    <p class="p-0 m-0">SO2: ${data.trace_gases.so2}µg/m³</p>\n
    <p class="p-0 m-0">NO2: ${data.trace_gases.no2}µg/m³</p>\n
    <p class="p-0 m-0">O3: ${data.trace_gases.o3}µg/m³</p>\n
    <p class="p-0 m-0">Black Carbon: ${data.black_carbon}µg/m³</p>\n
    <p class="p-0 m-0">Aerosols: ${data.aerosols}µg/m³</p>\n
    <p class="p-0 m-0">Battery Voltage: ${data.battery_voltage}V</p>
    `
}

function showAirQualitySensorData(feature) {
    let selectedSensorData = document.getElementById("selected-sensor-data")
    let sensorDataHeader = document.createElement("h2")
    let sensor_name = document.createElement("p")
    let info = document.createElement("div")

    selectedSensorData.innerHTML = ""
    sensorDataHeader.textContent = "Sensor Data"
    sensor_name.textContent = "Sensor Name: " + feature.get("sensor_name")
    info.innerHTML = AirQualityPopoverContent(feature)

    selectedSensorData.append(sensorDataHeader, sensor_name, info)
}

export {
    createAirQualitySensorStyleSelected,
    airQualitySensorStyle,
    airQualitySensorData,
    showAirQualitySensorData,
    AirQualityPopoverContent
}