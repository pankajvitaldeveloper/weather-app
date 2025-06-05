# Weather Dashboard

A modern weather dashboard application that shows current weather and 5-day forecast for any city.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pankajvitaldeveloper/weather-app.git
   ```

2. Open the project folder:
   ```bash
   cd weather-app
   npm i
   ```

## Features

- Search weather by city name
- Get weather for current location
- 5-day weather forecast
- Recent searches history
- Responsive design
- Error handling
- Weather condition icons

## Setup Instructions

1. Clone this repository
2. Get an API key from [OpenWeather](https://openweathermap.org/api)
3. API use `OPENWEATHER_API_KEY` in `main.js` with your actual API key
4. Open `index.html` in a web browser

## Usage

- Enter a city name and press Enter or click Search
- Click "Use Current Location" to get weather for your current location
- Recent searches appear in a dropdown below the search input
- Weather information updates automatically when a city is selected

## Technologies Used

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- OpenWeather API

## Error Handling

The application handles various error cases:
- Invalid city names
- Network errors
- Geolocation errors
- Empty search queries
