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
            
            const temperatureCelcius = (data.weather.currently.temperature - 32) * 5/9;

            document.getElementById('latitude').textContent = lat.toFixed(2) ;
            document.getElementById('longitude').textContent = lon.toFixed(2);
            document.getElementById('summary').textContent = data.weather.currently.summary;
            document.getElementById('temperatureFahrenheit').textContent = data.weather.currently.temperature;
            document.getElementById('temperatureCelcius').textContent = temperatureCelcius.toFixed(1);  
        });
    }
    else {
        console.log('geolocation not available');
    }

    button.addEventListener('click', async event => {
        const temperature = document.getElementById('temperature').value;
        const data = { lat, lon, temperature};
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        };

        const response = await fetch('/api', options);
        const json = await response.json();

        console.log(json);
    });        
}