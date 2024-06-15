//weather application script.js
document.addEventListener("DOMContentLoaded", () => {
    const apiKey = '02567d80e61285e6f1c58a0f13f70755';
    const searchBtn = document.querySelector(".search-btn");
    const locationBtn = document.querySelector(".location-btn");
    const locationBox = document.querySelector(".location-box");
    const errorPopup = document.getElementById("error-popup");
    const weatherBody = document.querySelector(".weather-body");
    const locationError = document.querySelector(".location-error");
    const arrowBacks = document.querySelectorAll(".arrow-back");

    searchBtn.addEventListener("click", () => {
        const location = locationBox.value.trim();
        if (location) {
            fetchWeatherByLocation(location);
        } else {
            showError("Please enter the location!");
        }
    });

    locationBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            }, () => {
                showError("Unable to retrieve your location.");
            });
        } else {
            showError("Geolocation is not supported by this browser.");
        }
    });

    arrowBacks.forEach(arrowBack => {
        arrowBack.addEventListener("click", () => {
            weatherBody.classList.remove("show");
            weatherBody.classList.remove("fade-in");
            locationError.classList.remove("show");
            locationError.classList.remove("fade-in");
        });
    });

    function fetchWeatherByLocation(location) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const { coord } = data;
                    fetchWeatherByCoords(coord.lat, coord.lon);
                } else {
                    showError("Location not found!");
                }
            })
            .catch((error) => {
                console.error("Error fetching location data:", error);
                showError("Failed to fetch location data.");
            });
    }

    function fetchWeatherByCoords(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                updateWeather(data);
            })
            .catch((error) => {
                console.error("Error fetching weather data:", error);
                showError("Failed to fetch weather data.");
            });
    }

    function updateWeather(data) {
        const { main, weather, wind, visibility, sys } = data;
        const weatherIcon = document.querySelector(".weather-icon");
        const cityName = document.querySelector(".city-name");
        const temperature = document.querySelector(".temperature");
        const description = document.querySelector(".description");
        const feelsLike = document.getElementById("feels-like");
        const windSpeed = document.getElementById("wind-speed");
        const pressure = document.getElementById("pressure");
        const visibilityEl = document.getElementById("visibility");
        const sunrise = document.getElementById("sunrise");
        const sunset = document.getElementById("sunset");
        const humidity = document.getElementById("humidity");

        cityName.textContent = data.name;
        temperature.innerHTML = `${Math.round(main.temp)} <sup>°C</sup>`;
        description.textContent = weather[0].description;
        feelsLike.textContent = `Feels Like: ${Math.round(main.feels_like)}°C`;
        windSpeed.textContent = `${wind.speed} m/s`;
        pressure.textContent = `Pressure: ${main.pressure} hPa`;
        visibilityEl.textContent = `Visibility: ${(visibility / 1000).toFixed(1)} km`;
        sunrise.textContent = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        sunset.textContent = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        humidity.textContent = `${main.humidity}%`;

        weatherBody.classList.add("show");
        weatherBody.classList.add("fade-in");
        locationError.classList.remove("show");
        locationError.classList.remove("fade-in");
    }

    function showError(message) {
        errorPopup.querySelector("p").textContent = message;
        errorPopup.classList.add("show");
        setTimeout(() => {
            errorPopup.classList.remove("show");
        }, 3000);
    }
});
