let mymap;
createMap();
getData();
getIssData();

async function createMap() {
    mymap = L.map('checkinsMap').setView([0, 0], 1);
	const attribution = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const tiles = L.tileLayer(tileUrl, { attribution });
	tiles.addTo(mymap);
}

async function getIssData() {
    // FETCH ISS DATA FROM SERVER
    const response_iss = await fetch('/iss');
    const dataISS = await response_iss.json();

    // ISS marker custom icon
    const issIcon = L.icon({
        iconUrl: 'iss200.png',
        iconSize: [50, 32],
        iconAnchor: [25, 16]
    });

    const { latitude, longitude } = dataISS;
    const markerISS = L.marker([latitude, longitude], { icon: issIcon }).addTo(mymap);
    markerISS.setLatLng([latitude, longitude], 2);
    
    const issText = `<p>INTERNATIONAL SPACE STATION</p>
        <p>latitude:${latitude}</p>
        <p>longitude:${longitude}</p>`
    
    markerISS.bindPopup(issText);
}

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data)
    
    for (item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);
        
        let markerText = `
            <p>
            lat: ${item.lat}&deg;, lon: ${item.lon}&deg;.
            </p>
            <p>
            The weather here is ${item.weather.summary} with a temperature of 
            ${convert_fahrenheit_celcius(item.weather.temperature)}&deg; Celcius | (${item.weather.temperature}&deg; Fahrenheit.)
            </p>`
        
        if (item.air.value < 0) {
            markerText += `<p> No air quality reading. </p>`
        } else {
            markerText += `<p> The concentration of particulate matter (${item.air.parameter}) is ${item.air.value} ${item.air.unit}  last read on ${item.air.lastUpdated}.</p>`
        }

        marker.bindPopup(markerText);
    }
    console.log(data);
}

function convert_fahrenheit_celcius(temperature) {
    return ((temperature - 32) * 5/9).toFixed(2)
}