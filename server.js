const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening at ${port}`));

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if(err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/iss', async (request, response) => {
    const iss_api_url = `https://api.wheretheiss.at/v1/satellites/${process.env.ISS_API_KEY}`;    
	const iss_fetch_response = await fetch(iss_api_url);
    const iss_data = await iss_fetch_response.json();
    response.json(iss_data)
});

app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(`,`);
    const coordinates = {
        lat: latlon[0],
        lon: latlon[1]
    };

    const weather_api_url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${coordinates.lat},${coordinates.lon}`;
    const weather_fetch_response = await fetch(weather_api_url);
    const weather_data = await weather_fetch_response.json();
    
    const air_quality_url = `https://api.openaq.org/v1/latest?coordinates${coordinates.lat},${coordinates.lon}`;
    const air_quality_response = await fetch(air_quality_url);
    const air_quality_data = await air_quality_response.json();

    const data = {
        weather: weather_data,
        air_quality: air_quality_data
    };
    response.json(data);
});