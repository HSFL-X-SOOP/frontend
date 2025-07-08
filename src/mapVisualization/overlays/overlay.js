import {fromLonLat, toLonLat} from 'ol/proj';
import {CreateTemperatureElement, UpdateTemperatureElement} from "./temperature-overlay";
import {CreateWindDirectionElement, UpdateWindDirectionElement} from "./wind-direction-overlay";

function GetClosestFeatureOfElement(map, vectorSource, element) {
    let rect = element.getBoundingClientRect();
    let mapRect = map.getTargetElement().getBoundingClientRect();
    let relX = rect.x - mapRect.x;
    let relY = rect.y - mapRect.y;

    let mapSize = map.getSize();
    if (relX < 0 || relY < 0 || relX > mapSize[0] || relY > mapSize[1]) {
        return null;
    }

    const coordinate = map.getCoordinateFromPixel([relX, relY]);

    if (!coordinate) {
        return null;
    }

    let featureLonLat = toLonLat(coordinate)
    let closestFeature = vectorSource.getClosestFeatureToCoordinate(fromLonLat(featureLonLat));

    return closestFeature;
}

function DrawOverlay(map, vectorSource, overlay, x_num, y_num, elementType) {
    overlay.innerHTML = '';
    let row = document.createElement("div");
    row.className = "flex flex-row flex-wrap w-full";
    overlay.append(row);

    const tileWidth = overlay.getBoundingClientRect().width / x_num;
    const tileHeight = overlay.getBoundingClientRect().height / y_num;

    for (let y = 0; y < y_num; y++) {
        let col = document.createElement("div")
        col.className = "col d-flex align-items-center"
        row.append(col)
        for (let x = 0; x < x_num; x++) {
            let element;
            switch (elementType) {
                case "Temperature":
                    element = CreateTemperatureElement();
                    break;
                case "WindDirection":
                    element = CreateWindDirectionElement();
                    break;
            }

            element.style.width = `${tileWidth}px`;
            element.style.height = `${tileHeight}px`;
            element.style.margin = "0";
            element.style.textAlign = "center";

            let relX = x * tileWidth + tileWidth / 2;
            let relY = y * tileHeight + tileHeight / 2;
            const coordinate = map.getCoordinateFromPixel([relX, relY]);
            let closestFeature = null;
            if (coordinate) {
                let featureLonLat = toLonLat(coordinate);
                closestFeature = vectorSource.getClosestFeatureToCoordinate(fromLonLat(featureLonLat));
            }

            if (closestFeature && closestFeature.get("data")) {
                switch (elementType) {
                    case "Temperature":
                        element = UpdateTemperatureElement(element, closestFeature.get("data").air_temperature);
                        break;
                    case "WindDirection":
                        element = UpdateWindDirectionElement(element, closestFeature.get("data").wind_direction);
                        break;
                }
            }

            col.append(element);
        }
    }
}

export {DrawOverlay}