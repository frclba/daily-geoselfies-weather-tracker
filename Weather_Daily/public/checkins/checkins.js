let mymap;
createMap();
getData();

async function createMap() {
    mymap = L.map('checkinsMap').setView([0, 0], 1);
	const attribution = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const tiles = L.tileLayer(tileUrl, { attribution });

	tiles.addTo(mymap);
}


async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data)
    
    for (item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);
        
        const markerText = `
            <p>
            lat: ${item.lat}&deg;, lon: ${item.lon}&deg;.
            The weather here is ${item.weather.summary} with a temperature of 
            ${convert_fahrenheit_celcius(item.weather.temperature)}&deg; Celcius | (${item.weather.temperature}&deg; Fahrenheit.)
            The concentration of particulate matter (${item.air.parameter})
            is ${item.air.value} ${item.air.unit}  last read on ${item.air.lastUpdated}.
            </p>`

        marker.bindPopup(markerText);
    }
    console.log(data);
}

function convert_fahrenheit_celcius(temperature) {
    return ((temperature - 32) * 5/9).toFixed(2)
}