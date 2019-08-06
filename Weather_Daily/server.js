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
    const api_url = `https://api.darksky.net/forecast/9a3eb9d9cbec6695bc6b366eaa3e9df3/${latlon[0]},${latlon[1]}`;
    const fetch_response = await fetch(api_url);
    const data = await fetch_response.json();    
    response.json(data);
});