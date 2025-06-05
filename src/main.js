const api_key = '2dc189d1166a4e44bc5103522250506';
const fetchWeatherApi = async ()=> {
    try{
        // const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${api_key}&q=London&aqi=no`); 
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=Delhi&aqi=no`); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const weather = {
            location: data.location.name,
            region: data.location.region,
            country: data.location.country,
            temperature: data.current.temp_c,
            condition: data.current.condition.text,
            icon: data.current.condition.icon
        };
        console.log(weather);
    }
    catch(error){
        console.error("Error fetching weather data:", error);
    }
}

fetchWeatherApi();