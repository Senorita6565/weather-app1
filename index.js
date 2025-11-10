const axios = require('axios');

// API configuration
const BASE_URL = 'https://wttr.in';

async function getWeather(city) {
    try {
        // Make sure we have a city name
        if (!city) {
            throw new Error('Please provide a city name');
        }

        // Make the API request
        const response = await axios.get(`${BASE_URL}/${city}`, {
            params: {
                format: 'j1' // Get JSON format
            }
        });

        // Extract relevant weather information
        const weather = response.data;
        return {
            temperature: weather.current_condition[0].temp_C,
            description: weather.current_condition[0].weatherDesc[0].value,
            city: weather.nearest_area[0].areaName[0].value
        };
    } catch (error) {
        if (error.response) {
            // Handle API-specific errors
            if (error.response.status === 404) {
                throw new Error('City not found');
            }
            throw new Error(`API Error: Unable to fetch weather data`);
        }
        // Re-throw other errors
        throw error;
    }
}

// Get the city name from command line arguments
const cityArg = process.argv[2];

// Run the main program
getWeather(cityArg)
    .then(data => {
        console.log(`Weather in ${data.city}: ${data.temperature}°C, ${data.description}`);
    })
    .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
    });