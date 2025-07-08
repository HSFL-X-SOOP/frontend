async function GetGeomarData() {
    let url = "http://46.252.195.123/api/latestmeasurements"
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