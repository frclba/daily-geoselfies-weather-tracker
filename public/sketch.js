function setup() {
    const video = createCapture(VIDEO);
    const button = document.getElementById('submit');
    noCanvas();
    video.size(160, 120);

    if('geolocation' in navigator) {
        console.log('Geolocation Available')
        
        navigator.geolocation.getCurrentPosition(async position => {
        let lat, lon, weather, air;
            try{
                // USER POSTION
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                               
                // FETCH WEATHER DATA FROM SERVER
                const api_url = `/weather/${lat},${lon}`;
                const response = await fetch(api_url);
                const data = await response.json();
                weather = data.weather.currently;
                air = data.air_quality.results[0].measurements[0] || null;

                const temperatureCelcius = (data.weather.currently.temperature - 32) * 5/9;

                // SET Weather DATA ON PAGE
                document.getElementById('latitude').textContent = lat.toFixed(2) ;
                document.getElementById('longitude').textContent = lon.toFixed(2);
                document.getElementById('summary').textContent = weather.summary;
                document.getElementById('temperatureFahrenheit').textContent = weather.temperature;
                document.getElementById('temperatureCelcius').textContent = temperatureCelcius.toFixed(1);  
                
                // SET AIR DATA ON PAGE
                document.getElementById('aq_parameter').textContent = air.parameter;
                document.getElementById('aq_value').textContent = air.value;
                document.getElementById('aq_units').textContent = air.unit;
                document.getElementById('aq_date').textContent = new Date(air.lastUpdated).toLocaleString();
            }
            catch(error) {
                console.error(error);
                air = { value: -1 };
                document.getElementById('aq_value').textContent = "No Air Quality Reading";
            }
            
            button.addEventListener('click', async event => {
                const mood = document.getElementById('mood').value;
                video.loadPixels();
                const image64 = video.canvas.toDataURL();
                const db_data = {lat, lon, weather, air, mood, image64}
                
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(db_data)
                };
                const db_response = await fetch('/api', options);
                const db_json = await db_response.json();
            });
        });
    }
    else {
        console.log('geolocation not available');
    }
}
