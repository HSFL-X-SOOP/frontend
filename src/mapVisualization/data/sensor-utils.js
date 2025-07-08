import {fromLonLat} from 'ol/proj.js';
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature.js';
import VectorSource from 'ol/source/Vector.js';

function createSensorDataVectorSource(sensorData) {
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

    return sensorDataSource
}

export {createSensorDataVectorSource}