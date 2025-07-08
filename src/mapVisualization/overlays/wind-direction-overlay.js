function CreateWindDirectionElement() {
  let windDirectionElement = document.createElement("p")    
  windDirectionElement.style.margin = `0`
  windDirectionElement.style.textAlign = "center"
  windDirectionElement.style.fontSize = "50px"
  windDirectionElement.textContent = `→`
  windDirectionElement.style.fontWeight = 'bold';
  return windDirectionElement
}

function UpdateWindDirectionElement(windDirectionElement, rotation) {
    windDirectionElement.style.rotate = `${rotation + 90}deg`
    return windDirectionElement
}

export {CreateWindDirectionElement, UpdateWindDirectionElement}