function GetTemperatureColor(temperature)  {
  if (temperature>=40) {return "rgba(252,3,3,0.3)"}
  if (temperature>=30) {return "rgba(252,177,3,0.3)"}
  if (temperature>=20) {return "rgba(192,252,3,0.3)"}
  if (temperature>=10) {return "rgba(32, 252, 3,0.3)"}
  if (temperature>=0) {return "rgba(3,148,252,0.3)"}
}


function CreateTemperatureElement() {
    let temperatureElement = document.createElement("p")
    temperatureElement.style.fontWeight = 'bold';
    temperatureElement.className = "temperature-overlay-tile"
    return temperatureElement
}

function UpdateTemperatureElement(temperatureElement, airTemperature) {
    temperatureElement.textContent = `${airTemperature}°C`
    temperatureElement.style.backgroundColor = GetTemperatureColor(airTemperature)
    return temperatureElement
}

export {CreateTemperatureElement, UpdateTemperatureElement}