const apiKey = '72edc84786d5354a472ddb6111e602dc'; // Replace with your OpenWeather API key
const getWeatherButton = document.getElementById('get-weather');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');
const themeToggle = document.getElementById('theme-toggle');

getWeatherButton.addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    loading.style.display = 'block'; // Show loading indicator

    // Step 1: Get the coordinates from the Geocoding API
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Get latitude and longitude
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            // Step 2: Use the coordinates to get the weather data
            return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const { current } = data;

            // Update the weather info display
            weatherInfo.classList.add('active'); // Show the weather card
            weatherInfo.style.display = 'block'; // Show the weather info
            loading.style.display = 'none'; // Hide loading indicator
            weatherInfo.innerHTML = `
                <h2>${city}</h2>
                <p>Temperature: <span>${current.temp} °C 🌡️</span></p>
                <p>Weather: <span>${current.weather[0].description} ☁️</span></p>
                <p>Humidity: <span>${current.humidity}% 💧</span></p>
                <p>Wind Speed: <span>${current.wind_speed} m/s 💨</span></p>
                <p>Sunrise: <span>${new Date(current.sunrise * 1000).toLocaleTimeString()} 🌅</span></p>
                <p>Sunset: <span>${new Date(current.sunset * 1000).toLocaleTimeString()} 🌇</span></p>
                <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
            `;
            // Change background based on weather condition
            const weatherCondition = current.weather[0].main.toLowerCase();
            document.body.style.backgroundImage = `url('images/${weatherCondition}.jpg')`; // Add your own images based on conditions
        })
        .catch(error => {
            loading.style.display = 'none'; // Hide loading indicator on error
            weatherInfo.innerHTML = `<p>${error.message}</p>`;
            weatherInfo.style.display = 'block'; // Show the error message
        });
});

// Geolocation feature
document.getElementById('get-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        }, () => {
            weatherInfo.innerHTML = `<p>Unable to retrieve your location.</p>`;
            weatherInfo.style.display = 'block';
        });
    } else {
        weatherInfo.innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
        weatherInfo.style.display = 'block';
    }
});

function fetchWeatherByCoords(lat, lon) {
    loading.style.display = 'block'; // Show loading indicator
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const { current } = data;
            weatherInfo.innerHTML = `
                <h2>Your Location</h2>
                <p>Temperature: <span>${current.temp} °C 🌡️</span></p>
                <p>Weather: <span>${current.weather[0].description} ☁️</span></p>
                <p>Humidity: <span>${current.humidity}% 💧</span></p>
                <p>Wind Speed: <span>${current.wind_speed} m/s 💨</span></p>
                <p>Sunrise: <span>${new Date(current.sunrise * 1000).toLocaleTimeString()} 🌅</span></p>
                <p>Sunset: <span>${new Date(current.sunset * 1000).toLocaleTimeString()} 🌇</span></p>
                <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
            `;
            loading.style.display = 'none'; // Hide loading indicator
        })
        .catch(error => {
            loading.style.display = 'none'; // Hide loading indicator on error
            weatherInfo.innerHTML = `<p>${error.message}</p>`;
            weatherInfo.style.display = 'block'; // Show the error message
        });
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});
