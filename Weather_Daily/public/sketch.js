function setup() {
    noCanvas();
    const button = document.getElementById('checkin');
    let lat, lon;

    if('geolocation' in navigator) {
        console.log('geolocation available')
        
        navigator.geolocation.getCurrentPosition(async position => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;

            const api_url = `/weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const data = await response.json();
            
            const weather = data.weather.currently;
            const air = data.air_quality.results[0].measurements[0] || null;

            const temperatureCelcius = (data.weather.currently.temperature - 32) * 5/9;

            // Weather DATA
            document.getElementById('latitude').textContent = lat.toFixed(2) ;
            document.getElementById('longitude').textContent = lon.toFixed(2);
            document.getElementById('summary').textContent = weather.summary;
            document.getElementById('temperatureFahrenheit').textContent = weather.temperature;
            document.getElementById('temperatureCelcius').textContent = temperatureCelcius.toFixed(1);  
            
            // AIR DATA
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = air.value;
            document.getElementById('aq_units').textContent = air.unit;
            document.getElementById('aq_date').textContent = air.lastUpdated;
            
            const db_data = {lat, lon, weather, air}

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
    }
    else {
        console.log('geolocation not available');
    }
}