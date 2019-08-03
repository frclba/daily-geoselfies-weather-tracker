function setup() {
	const mymap = L.map('issMap').setView([0, 0], 1);
	
	const attribution = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
	const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const tiles = L.tileLayer(tileUrl, { attribution });

	tiles.addTo(mymap)

}
