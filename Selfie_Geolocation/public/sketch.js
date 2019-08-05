function setup() {
    const video = createCapture(VIDEO);
    const button = document.getElementById('submit');
    let latitude, longitude;

    noCanvas();
    video.size(160, 120);

    if('geolocation' in navigator) {
        console.log('geolocation available')
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            document.getElementById('latitude').textContent = lat;
            document.getElementById('longitude').textContent = lon;

            latitude = lat;
            longitude = lon;            
        });
    }
    else {
        console.log('geolocation not available');
    }

    button.addEventListener('click', async event => {
        const mood = document.getElementById('mood').value;
        video.loadPixels();
        const image64 = video.canvas.toDataURL();
        const data = { latitude, longitude, mood, image64 };
        
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