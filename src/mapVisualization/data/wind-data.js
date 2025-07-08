import {fromLonLat} from 'ol/proj.js';
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature.js';
import VectorSource from 'ol/source/Vector.js';
import Fill from 'ol/style/Fill.js';
import RegularShape from 'ol/style/RegularShape.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';

const shaft = new RegularShape({
  points: 2,
  radius: 2,
  stroke: new Stroke({
    width: 2,
    color: 'black',
  }),
  rotateWithView: true,
});

const head = new RegularShape({
  points: 3,
  radius: 5,
  fill: new Fill({
    color: 'black',
  }),
  rotateWithView: true,
});

const windDirectionArrows = [new Style({image: shaft}), new Style({image: head})];

function createWindDirectionArrow(longitude, latitude, windSpeed, windDirection) {
   return {
      "coord": {
         "lon": longitude,
         "lat": latitude
      },
      "wind": {
         "speed": windSpeed,
         "deg": windDirection
      }
   }
}

const windDirectionArrowsData = []

for(let i = 0; i < 20; i++) {
  for(let j = 0; j < 20; j++) {
    windDirectionArrowsData.push(createWindDirectionArrow(9.39 + i * 0.005, 54.825 - j * 0.005, 20.09, 270))
  }
}

const windDirectionArrowsDataSource = new VectorSource();
const features = [];

windDirectionArrowsData.forEach(function (data) {
  const feature = new Feature(
    new Point(fromLonLat([data.coord.lon, data.coord.lat])),
  );
  feature.setProperties(data);
  features.push(feature);
});

windDirectionArrowsDataSource.addFeatures(features);

const windDirectionDataStyle = function (feature) {
        const wind = feature.get('wind');
        // rotate arrow away from wind origin
        const angle = ((wind.deg - 180) * Math.PI) / 180;
        const scale = wind.speed / 10;
        shaft.setScale([1, scale]);
        shaft.setRotation(angle);
        head.setDisplacement([
          0,
          head.getRadius() / 2 + shaft.getRadius() * scale,
        ]);
        head.setRotation(angle);
        return windDirectionArrows;
      }

export {windDirectionArrowsDataSource, windDirectionDataStyle}