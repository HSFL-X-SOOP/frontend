async function GetGeomarData() {
    let url = "/api/latestmeasurements"
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    let data = await response.json()
    console.log(data)
    return data
}

export {GetGeomarData}