import Style from 'ol/style/Style.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Text from 'ol/style/Text.js';
import Icon from 'ol/style/Icon.js';
import { createSensorDataVectorSource } from './sensor-utils.js';

async function createAirPropertiesSensorData(longitude, latitude) {
    const fetchedData = await fetchAirPropertiesSensorData(longitude, latitude) 
    return {
    
      "coord": {
         "lon": longitude,
         "lat": latitude
      },
      "sensor_name": "Air Properties Sensor",
      "module_name": "Modul 2",
      "data": fetchedData
   }
}

async function fetchAirPropertiesSensorData(longitude, latitude) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&models=icon_seamless&current=temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m,surface_pressure&forecast_days=1`
  const response = await fetch(url, {
      method: "GET"
  })
  const data = await response.json();
  return {
    "wind_speed": data.current.wind_speed_10m,
    "wind_direction": data.current.wind_direction_10m,
    "air_temperature": data.current.temperature_2m,
    "barometric_pressure": data.current.surface_pressure,
    "humidity": data.current.relative_humidity_2m,
    "battery_voltage": 4
  }
}

async function loadAirPropertiesSensorData() {
    return [
        await createAirPropertiesSensorData(9.542039207249285, 54.51069732199451), // Schleswig Schloss
        await createAirPropertiesSensorData(9.71559392307798, 54.52414462677734), // Missunde
        await createAirPropertiesSensorData(9.934568072662614, 54.66034130282637), // Kappeln
        await createAirPropertiesSensorData(11.19104586109911, 54.51394399850085), // Fehmarn
        await createAirPropertiesSensorData(12.607701028979859, 41.8793343283549), // Rom
        await createAirPropertiesSensorData(-1.7277645297286661, 43.40528026437781), // San Sebastian
        await createAirPropertiesSensorData(32.559898, 15.508457), // Khartum Afrika
    ];
}

async function createAirPropertiesSensorVectorSource() {
    const data = await loadAirPropertiesSensorData();
    return createSensorDataVectorSource(data);
}

function createAirPropertiesSensorStyle(feature) {
    const data = feature.get('data')

    const wind_arrow = new Style({
        image: new Icon({
        src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,0 90,100 50,80 10,100" fill="blue"/>
            </svg>
        `),
        rotation: (Math.PI / 180) * (data.wind_direction + 180),
        rotateWithView: true,
        scale: 0.75,
        anchor: [0.5,0.6]
        })
    });

    const circle = new Style({
        image: new CircleStyle({
        radius: 15,
        fill: new Fill({ color: 'rgba(236, 248, 255, 0.86)' }),
        stroke: new Stroke({ color: '#0066cc', width: 1 })
        }),
        text: new Text({
        font: '14px Calibri,sans-serif',
        text: "M2",  // Use the 'name' property for the label
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#fff', width: 3 }),
        offsetY: -15,
    })
    });

    return [circle, wind_arrow]
}

function createAirPropertiesSensorStyleSelected(feature, stroke_color) {
    const data = feature.get('data')

    const wind_arrow = new Style({
        image: new Icon({
        src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,0 90,100 50,80 10,100" fill="${stroke_color}"/>
            </svg>
        `),
        rotation: (Math.PI / 180) * (data.wind_direction + 180),
        rotateWithView: true,
        scale: 0.75,
        anchor: [0.5,0.6]
        })
    });

    const circle = new Style({
        image: new CircleStyle({
        radius: 15,
        fill: new Fill({ color: 'rgba(236, 248, 255, 0.86)' }),
        stroke: new Stroke({ color: stroke_color, width: 1 })
        }),
        text: new Text({
        font: '14px Calibri,sans-serif',
        text: "M2",  // Use the 'name' property for the label
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#fff', width: 3 }),
        offsetY: -15,
    })
    });

    return [circle, wind_arrow]
}


const airPropertiesSensorStyle = function (feature) {
    return createAirPropertiesSensorStyle(feature);
}

function AirPropertiesPopoverContent(feature) {
    const data = feature.get("data")
    const coord = feature.get("coord")
    return `
    <p class="p-0 m-0">Module Name: ${feature.get("module_name")}</p>\n
    <p class="p-0 m-0">Longitude: ${coord.lon}</p>\n
    <p class="p-0 m-0">Latitude: ${coord.lat}</p>\n
    <p class="p-0 m-0">Wind Speed: ${data.wind_speed}km/h</p>\n
    <p class="p-0 m-0">Wind Direction: ${data.wind_direction}°</p>\n
    <p class="p-0 m-0">Air Temperature: ${data.air_temperature}°C</p>\n
    <p class="p-0 m-0">Barometric Pressure: ${data.barometric_pressure}hPa</p>\n
    <p class="p-0 m-0">Humidity: ${data.humidity}%</p>\n
    <p class="p-0 m-0">Battery Voltage: ${data.battery_voltage}V</p>
    `
}

function showAirPropertiesSensorData(feature) {
    let selectedSensorData = document.getElementById("selected-sensor-data")
    let sensorDataHeader = document.createElement("h2")
    let sensor_name = document.createElement("p")
    let info = document.createElement("div")

    
    selectedSensorData.innerHTML = ""
    sensorDataHeader.textContent = "Sensor Data"
    sensor_name.textContent = "Sensor Name: " + feature.get("sensor_name")
    info.innerHTML = AirPropertiesPopoverContent(feature)
    selectedSensorData.append(sensorDataHeader, sensor_name, info)
}

export {
    createAirPropertiesSensorStyleSelected,
    airPropertiesSensorStyle,
    showAirPropertiesSensorData,
    AirPropertiesPopoverContent,
    loadAirPropertiesSensorData,
    createAirPropertiesSensorVectorSource
};