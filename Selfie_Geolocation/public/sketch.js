function setup() {
    let latitude, longitude;
    const video = createCapture(VIDEO);
    const button = document.getElementById('submit');

    noCanvas();
    video.size(160, 120);
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

     if('geolocation' in navigator) {
            console.log('geolocation available')
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                document.getElementById('latitude').textContent = lat;
                document.getElementById('longitude').textContent = lon;
                
                console.log(position);
            });
        }
        else {
            console.log('geolocation not available');
        }
}