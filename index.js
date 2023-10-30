const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const time = document.querySelector(".time");

let lat = 0
let lon = 0

const WeatherAPIKEY = '1d2b8d61e2e14e5b68b209624475cbd5';
const ForecastAPIKEY = '5d2d22910af84a128e3172912232910';

const getTime = (lat, lon) => {

    return fetch(
      `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'X-Api-Key': 'jt/+M9sWLnzvxioz1FbEoQ==zcVoxl9WMsXYLGF1',
          'Content-Type': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then((data) => {
        let timeString = data.day_of_week + ", " + data.hour + ":" + data.minute;
        return timeString;
    });   
}

const forecast = (city) => {
    const days = 5
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${ForecastAPIKEY}&q=${city}&days=${days}&aqi=no&alerts=no`)
    .then(response => response.json())
    .then(json => {
        const forecast = document.querySelector('.forecast');
        while (forecast.firstChild) {
            forecast.removeChild(forecast.firstChild);
        }
        for(let i=1; i<5; i++){
            let perday = json.forecast.forecastday[i]
            const icon = document.createElement("img")
            const forecastDay = document.createElement("div")
            forecastDay.classList.add("forecastItem")
            forecastDay.innerHTML = `${perday.date}<br>`
            icon.src = `https://${perday.day.condition.icon}`
            forecastDay.appendChild(icon)
            forecastDay.appendChild(document.createTextNode(`${Math.round(perday.day.avgtemp_c)}°C`))
            forecast.appendChild(forecastDay)
        }
    })
}

search.addEventListener('click', () => {
    const TimeAPIKEY = '2a64c91406b046f795bd957dd5b5e902';
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WeatherAPIKEY}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            lat = json.coord.lat
            lon = json.coord.lon

            getTime(lat, lon)
            .then((timeString) => {
                document.querySelector(".date").innerText = timeString;
            });

            forecast(city)
            
            image.src = `https://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png`;
            document.body.style.backgroundImage = `url('https://source.unsplash.com/800x600/?${json.name}')`;

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = json.weather[0].description;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });
});

document.querySelector(".search-input").addEventListener("keyup", (event) => {
    if (event.key == "Enter" || event.key == 'Shift') {
        const TimeAPIKEY = '2a64c91406b046f795bd957dd5b5e902';
        const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WeatherAPIKEY}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            lat = json.coord.lat
            lon = json.coord.lon

            getTime(lat, lon)
            .then((timeString) => {
                document.querySelector(".date").innerText = timeString;
            });

            forecast(city)
            
            image.src = `https://openweathermap.org/img/wn/${json.weather[0].icon}@4x.png`;
            document.body.style.backgroundImage = `url('https://source.unsplash.com/800x600/?${json.name}')`;

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = json.weather[0].description;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });
    }
})
