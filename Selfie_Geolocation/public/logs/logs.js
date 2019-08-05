getData();

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data)
    
    for (item of data) {
        const root = document.createElement('p');
        const mood = document.createElement('div');
        const geo = document.createElement('div');
        const date = document.createElement('div');
        const image = document.createElement('img');
    
        mood.textContent = `mood: ${item.mood}`
        geo.textContent = `lat: ${item.latitude}º, lon:${item.longitude}º`;
        const dateString = new Date(item.timestamp).toLocaleString();

        date.textContent = dateString;
        image.src = item.image64;
        image.alt = 'People making silly faces with random moods';

        root.append(mood, geo, date, image);
        document.body.append(root);
    }
    console.log(data);
}