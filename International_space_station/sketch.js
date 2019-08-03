let mymap;
const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';

// Making a marker with a custom icon
const issIcon = L.icon({
	iconUrl: 'iss200.png',
	iconSize: [50, 32],
	iconAnchor: [25, 16]
});


function setup() {
	mymap = L.map('issMap').setView([0, 0], 1);
	const attribution = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const tiles = L.tileLayer(tileUrl, { attribution });

	tiles.addTo(mymap);
	getIssLocation();
	
}


async function getIssLocation() {
	const response = await fetch(api_url);
	const data = await response.json();
	const { latitude, longitude } = data;

	const marker = L.marker([0, 0], { icon: issIcon }).addTo(mymap);
	marker.setLatLng([latitude, longitude], 2);
}