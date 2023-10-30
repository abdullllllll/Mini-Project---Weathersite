const container = document.querySelector('.container');
const search_button = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const time = document.querySelector(".time");

document.title = "Weather Site"

let link = document.createElement('link')
link.type = 'image/x-icon'
link.rel = 'icon'
link.href = "/fav.png"
document.getElementsByTagName('head')[0].appendChild(link)

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
        let timeString = `${data.day_of_week}, ${data.hour}:${data.minute}\n${data.day}/${data.month}/${data.year}`
        return timeString;
    });   
}
const convertDateFormat = (inputDate) =>  {
    const dateComponents = inputDate.split('-');
  
    if (dateComponents.length !== 3) {
      return 'Invalid date format';
    }
    const year = dateComponents[0];
    const month = dateComponents[1];
    const day = dateComponents[2];
  
    const newDateFormat = `${day}/${month}`;
  
    return newDateFormat;
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
            forecastDay.innerHTML = `${convertDateFormat(perday.date)}<br>`
            icon.src = `https://${perday.day.condition.icon}`
            forecastDay.appendChild(icon)
            forecastDay.appendChild(document.createTextNode(`${Math.round(perday.day.avgtemp_c)}°C`))
            forecast.appendChild(forecastDay)
        }
    })
}

const fetchWeather = () => {
    const TimeAPIKEY = '2a64c91406b046f795bd957dd5b5e902';
    const city = document.querySelector('.search-box input').value;

    if (city === '')
        return;
        fetch(`http://api.weatherapi.com/v1/current.json?key=${ForecastAPIKEY}&q=${city}&aqi=no`)
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

            lat = json.location.lat
            lon = json.location.lon

            getTime(lat, lon)
            .then((timeString) => {
                document.querySelector(".date").innerText = timeString;
            });

            forecast(city)
            image.src = `https://${json.current.condition.icon}`;
            link.href = `https://${json.current.condition.icon}`
            document.getElementsByTagName('head')[0].appendChild(link)
            document.body.style.backgroundImage = `url('https://source.unsplash.com/1200x700/?${json.location.name}')`;

            temperature.innerHTML = `${parseInt(json.current.temp_c)}<span>°C</span>`;
            description.innerHTML = json.current.condition.text;
            humidity.innerHTML = `${json.current.humidity}%`;
            wind.innerHTML = `${parseInt(json.current.wind_kph)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });
    }

    search_button.addEventListener('click', fetchWeather);
    
    document.querySelector(".search-input").addEventListener("keyup", (event) => {
        if (event.key == "Enter" || event.key == 'Shift') {
            fetchWeather();
        }
    })