import VectorSource from 'ol/source/Vector.js';
import {fromLonLat} from 'ol/proj.js';
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature.js';

function createTemperatureData(longitude, latitude, temperature) {
   return {
      "coord": {
         "lon": longitude,
         "lat": latitude
      },
      "data": {
         "temperature": temperature
      }
   }
}

const temperatureDataSource = new VectorSource()
const temperatureData = [
    createTemperatureData(9.4295,54.802,25),
    createTemperatureData(9.4367,54.796,25),
    createTemperatureData(9.437,54.7885,25)

]
const features = []

temperatureData.forEach(function (data) {
  const feature = new Feature(
    new Point(fromLonLat([data.coord.lon, data.coord.lat])),
  );
  feature.setProperties(data);
  features.push(feature);
});

temperatureDataSource.addFeatures(features);

const temperatureDataWeight = function (feature) {
      const data = feature.get('data');
      return Math.max(0, Math.min(1, (data.temperature - 10) / 30)); // Normalize between 10 and 40 degrees
    }

export {temperatureDataSource, temperatureDataWeight}