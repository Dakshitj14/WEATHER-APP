let cityInput = document.getElementById('city_input'),
    searchbtn = document.getElementById('searchbtn'),
    locationbtn = document.getElementById('locationbtn'),
    api_key = 'c5983768b473af81175ab5138e5fa16b',
    currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
    sevenDaysForecastCard = document.querySelector('.day-forecast'),
    aqiCard = document.querySelectorAll('.highlights .card')[0],
    sunriseCard = document.querySelectorAll('.highlights .card')[1],
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'],
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('PressureVal'),
    visibilityVal = document.getElementById('VisibilityVal'),
    windspeedVal = document.getElementById('WindSpeedVal'),
    hourlyForecastCard = document.querySelector('.hourlyweather'),
    feelsVal = document.getElementById('FeelsLikeVal');

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
        aqiCard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x "><img src="wind.png" alt="" width="35px" height="35px"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
            </div>`;
    }).catch(error => {
        console.error('Failed to fetch current Air quality index:', error);
        alert(`Failed to fetch current Air quality index`);
    });

    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(currentData => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(currentData.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${currentData.weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="calendar"><img src="calendar (1).png" alt="" width="30px" height="30px"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="location"><img src="map.png" alt="" width="30px" height="30px"></i>${name}, ${country}</p>
            </div>`;

            let { sunrise, sunset } = currentData.sys;
            let { timezone, visibility } = currentData;
            let { humidity, pressure, feels_like } = currentData.main;
            let { speed } = currentData.wind;

            let sRiseTime = new Date(sunrise * 1000);
            let sSetTime = new Date(sunset * 1000);

            let sRiseTimeString = sRiseTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            let sSetTimeString = sSetTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

            sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i><img src="sunrise.png" alt="" width="45px" height="45px"></i>
                    </div>
                    <div>
                        <p> Sunrise</p>
                        <h2>${sRiseTimeString}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i><img src="sunset.png" alt="" width="45px" height="45px"></i>
                    </div>
                    <div>
                        <p> Sunset</p>
                        <h2>${sSetTimeString}</h2>
                    </div>
                </div>         
            </div>`;
            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure} hPa`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
            windspeedVal.innerHTML = `${speed} m/s`;
            visibilityVal.innerHTML = `${(visibility / 1000).toFixed(2)} km`;
        })
        .catch(error => {
            console.error('Failed to fetch current weather:', error);
            alert(`Failed to fetch current weather`);
        });

    fetch(FORECAST_API_URL).then(res => res.json()).then(forecastData => {
        let hourlyForecast = forecastData.list.slice(0, 8); // Get next 8 hourly forecasts
        hourlyForecastCard.innerHTML = ``;
        hourlyForecast.forEach(forecast => {
            let hrForecastDate = new Date(forecast.dt_txt);
            let hr = hrForecastDate.getHours();
            let a = hr >= 12 ? 'PM' : 'AM';
            if (hr > 12) hr -= 12;
            if (hr === 0) hr = 12;

            hourlyForecastCard.innerHTML += `
            <div class="card">
                <p>${hr} ${a}</p>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="">
                <p>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</p>
            </div>`;
        });

        let uniqueForecastDays = new Set();
        let sevenDaysForecast = forecastData.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.has(forecastDate)) {
                uniqueForecastDays.add(forecastDate);
                return true;
            }
            return false;
        }).slice(1, 6); // Get next 5 unique days excluding the current day

        sevenDaysForecastCard.innerHTML = '';

        sevenDaysForecast.forEach(forecast => {
            let date = new Date(forecast.dt_txt);
            sevenDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="">
                        <span>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p>${days[date.getDay()]}</p>
                </div>`;
        });
    }).catch(error => {
        console.error('Failed to fetch weather forecast:', error);
        alert(`Failed to fetch weather forecast`);
    });
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (data.length === 0) {
            alert(`No coordinates found for ${cityName}`);
            return;
        }
        let { name, lat, lon, country, state } = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(error => {
        console.error(`Failed to fetch coordinates of ${cityName}:`, error);
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            if (data.length === 0) {
                alert('Failed to fetch user location details');
                return;
            }
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        }).catch(() => {
            alert('Failed to fetch user coordinates');
        });
    });
}

searchbtn.addEventListener('click', getCityCoordinates);
locationbtn.addEventListener('click', getUserCoordinates);
