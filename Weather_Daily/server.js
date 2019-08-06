const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const app = express();

app.listen(3000, () => console.log('listening at 3000'));

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

app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(`,`);
    const coordinates = {
        lat: latlon[0],
        lon: latlon[1]
    };

    const weather_api_url = `https://api.darksky.net/forecast/9a3eb9d9cbec6695bc6b366eaa3e9df3/${coordinates.lat},${coordinates.lon}`;
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