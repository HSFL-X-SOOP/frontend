import {fromLonLat} from 'ol/proj.js';
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature.js';
import VectorSource from 'ol/source/Vector.js';
import Style from 'ol/style/Style.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Icon from 'ol/style/Icon.js';

// const sensorDataPoint = new Style({
//   image: new CircleStyle({
//     radius: 7,
//     fill: new Fill({color: 'yellow'}),
//     stroke: new Stroke({color: 'red', width: 1}),
//   }),
// });

function createSensorDataStyle(feature) {
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
      fill: new Fill({ color: 'rgba(0, 153, 255, 0.5)' }),
      stroke: new Stroke({ color: '#0066cc', width: 1 })
    })
  });

  return [circle, wind_arrow]
}


async function getSensorData(longitude, latitude) {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&models=icon_seamless&current=temperature_2m,wind_speed_10m,wind_direction_10m&forecast_days=1`
  const response = await fetch(url, {
      method: "GET"
  })
  const data = await response.json();
  return {
    "temperature": data.current.temperature_2m,
    "wind_direction": data.current.wind_direction_10m,
    "wind_speed": data.current.wind_speed_10m,
  }
}

async function createSensorData(longitude, latitude) {
  const fetchedData = await getSensorData(longitude, latitude) 
  return {
      "coord": {
         "lon": longitude,
         "lat": latitude
      },
      "data": fetchedData
   }
}

function createFakeSensorData(longitude, latitude) {
  return {
      "coord": {
         "lon": longitude,
         "lat": latitude
      },
      "data": {
          "temperature": 21,
          "wind_direction": 250,
          "wind_speed": 18,
      }
   }
}
const sensorData = [
    await createFakeSensorData(9.4367, 54.796),
    await createFakeSensorData(9.437, 54.7885),
    // await createSensorData(9.4295, 54.802),
    // await createSensorData(9.542039207249285, 54.51069732199451), // Schleswig Schloss
    // await createSensorData(9.71559392307798, 54.52414462677734), // Missunde
    // await createSensorData(9.934568072662614, 54.66034130282637), // Kappeln
    // await createSensorData(9.868234526079595, 54.47305515348609), // Eckernförde
    // await createSensorData(10.133823712178105, 54.31114321214153), // Kiel Querkai
    // await createSensorData(10.17132953616414, 54.329012329712754), // Kiel Schwentine Werft
    // await createSensorData(10.216554343991787, 54.4042499260097), // Kiel Laboe
    // await createSensorData(9.711172066706121, 54.313332929813754), // Rendsburg
    // await createSensorData(9.126408784000207, 53.88780618582467), // Brunsbüttel
    // await createSensorData(10.980480508401266, 54.375842855573865), // Heiligenhafen
    // await createSensorData(11.19104586109911, 54.51394399850085), // Fehmarn
    // await createSensorData(8.296229935540385, 54.909481414684905), // Westerland
    // await createSensorData(8.694068755148862, 54.73080963743536), // Dagebüll
    // await createSensorData(8.815529667066356, 54.48633428418012), // Nordstrand
    // await createSensorData(8.58397921359508, 54.324191810957615), // Sankt Peter Ording
    // await createSensorData(8.849777321827073, 54.12813503606), // Büsum
    // await createSensorData( 9.591076207849072, 54.845860511473575), // Bockholm
]
const sensorDataSource = new VectorSource();

const features = [];
sensorData.forEach(function (data) {
  const feature = new Feature(
    new Point(fromLonLat([data.coord.lon, data.coord.lat])),
  );
  feature.setProperties(data);
  features.push(feature);
});
sensorDataSource.addFeatures(features);

const sensorDataStyle = function (feature) {
    return createSensorDataStyle(feature);
}

export {sensorDataSource, sensorDataStyle}