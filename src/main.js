const API_KEY = 'd05211ffe0dc336edcee960c14192f99';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

// DOM elements for interaction and display
const elements = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    recentSearches: document.getElementById('recentSearches'),
    forecastContainer: document.getElementById('forecast'),
    weatherUI: {
        cityDate: document.getElementById('city-date'),
        temperature: document.getElementById('temperature'),
        wind: document.getElementById('wind'),
        humidity: document.getElementById('humidity'),
        description: document.getElementById('weather-description'),
        icon: document.getElementById('weather-icon')
    }
};

// Initialization and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
    initializeEventListeners();
});

function initializeEventListeners() {
    elements.searchBtn.addEventListener('click', searchWeather);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    elements.locationBtn.addEventListener('click', getCurrentLocation);
    elements.cityInput.addEventListener('input', showRecentSearches);
}

// Main Actions and Functions

// Search for weather data based on city input
async function searchWeather() {
    const city = elements.cityInput.value.trim();
    if (!city) return showError('Please enter a city name');

    try {
        const [weather, forecast] = await Promise.all([
            fetchWeather(`/weather?q=${city}`),
            fetchWeather(`/forecast?q=${city}`)
        ]);

        updateWeatherUI(weather);
        updateForecastUI(forecast);
        addToRecentSearches(city);
    } catch (err) {
        showError('City not found or error fetching weather data');
    }
}

// Get current location and fetch weather data
async function getCurrentLocation() {
    if (!navigator.geolocation) return showError('Geolocation not supported');

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;

        const [weather, forecast] = await Promise.all([
            fetchWeather(`/weather?lat=${latitude}&lon=${longitude}`),
            fetchWeather(`/forecast?lat=${latitude}&lon=${longitude}`)
        ]);

        updateWeatherUI(weather);
        updateForecastUI(forecast);
    } catch (err) {
        showError('Error getting location or weather data');
    }
}

// Fetch Utility 

// Fetch weather data from OpenWeatherMap API
async function fetchWeather(endpoint) {
    const url = `${WEATHER_API_BASE}${endpoint}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API Error');
    return response.json();
}

// UI Updates 

// Update the weather UI with fetched data
function updateWeatherUI(data) {
    const { cityDate, temperature, wind, humidity, description, icon } = elements.weatherUI;

    cityDate.textContent = `${data.name} (${new Date().toLocaleDateString()})`;
    temperature.textContent = Math.round(data.main.temp);
    wind.textContent = data.wind.speed;
    humidity.textContent = data.main.humidity;
    description.textContent = data.weather[0].description;
    icon.textContent = getWeatherEmoji(data.weather[0].main);
}

// Update the forecast UI with grouped daily forecasts
function updateForecastUI(data) {
    const dailyForecasts = groupForecastsByDay(data.list);
    elements.forecastContainer.innerHTML = dailyForecasts
        .map(createForecastCard)
        .join('');
}

// Create a forecast card for each day's weather
function createForecastCard(forecast) {
    return `
        <div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <h3 class="font-bold mb-2">${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
            <div class="text-4xl mb-2">${getWeatherEmoji(forecast.weather[0].main)}</div>
            <p class="mb-1">Temp: ${Math.round(forecast.main.temp)}°C</p>
            <p class="mb-1">Wind: ${forecast.wind.speed} M/S</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        </div>
    `;
}

// Recent Searches
function addToRecentSearches(city) {
    let searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    searches = [city, ...searches.filter(c => c !== city)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    updateRecentSearchesDropdown(searches);
}

// Load recent searches from localStorage and update the dropdown
function loadRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    if (searches.length > 0) updateRecentSearchesDropdown(searches);
}

// Update the recent searches dropdown with the latest searches
// and add click listeners to each item
function updateRecentSearchesDropdown(searches) {
    const list = elements.recentSearches.querySelector('ul');
    list.innerHTML = searches.map(city => `
        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">${city}</li>
    `).join('');

    list.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            elements.cityInput.value = item.textContent;
            searchWeather();
            elements.recentSearches.classList.add('hidden');
        });
    });
}

// Show recent searches dropdown when the input is focused or has text
function showRecentSearches() {
    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    if (searches.length > 0) {
        elements.recentSearches.classList.remove('hidden');
        updateRecentSearchesDropdown(searches);
    }
}

// Helpers
// Show an error message to the user
function showError(msg) {
    alert(msg); // Consider replacing this with custom toast for better UX
}

// Get weather emoji based on the weather condition
function getWeatherEmoji(weatherMain) {
    const emojiMap = {
        Clear: '☀️',
        Clouds: '☁️',
        Rain: '🌧️',
        Snow: '❄️',
        Thunderstorm: '⛈️',
        Drizzle: '🌦️',
        Mist: '🌫️'
    };
    return emojiMap[weatherMain] || '🌤️';
}

// Group forecasts by day, returning only the first forecast for each day 
// to avoid duplicates and limit to 5 days
function groupForecastsByDay(list) {
    const daily = [];
    const seenDates = new Set();
    list.forEach(f => {
        const date = new Date(f.dt * 1000).toLocaleDateString();
        if (!seenDates.has(date)) {
            seenDates.add(date);
            daily.push(f);
        }
    });
    return daily.slice(0, 5);
}
