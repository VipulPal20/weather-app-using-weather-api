const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b45e96323fmshf5e4bc50d3b8a90p1e091djsnfb21cde4eb87',
		'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
	}
};
// Helper function to convert timestamp to readable time
const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

// Helper function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
}

// Helper function to get temperature display based on current unit
const formatTemperature = (tempCelsius, includeUnit = true) => {
    const isFahrenheit = document.getElementById('fahrenheit').checked;
    if (isFahrenheit) {
        const tempF = celsiusToFahrenheit(tempCelsius);
        return includeUnit ? `${tempF}°F` : tempF;
    }
    return includeUnit ? `${tempCelsius}°C` : tempCelsius;
}

// Store weather data for unit conversion
let currentWeatherData = null;

// Helper function to get weather icon based on conditions
const getWeatherIcon = (temp, humidity, windSpeed) => {
    if (temp > 30) return '☀️'; // Hot
    if (temp < 0) return '❄️'; // Freezing
    if (humidity > 80) return '🌧️'; // Rainy/Humid
    if (windSpeed > 20) return '🌪️'; // Windy
    if (temp < 10) return '🌨️'; // Cold
    return '⛅'; // Default cloudy
}

// Function to update temperature display based on selected unit
const updateTemperatureDisplay = () => {
    if (!currentWeatherData) return;
    
    const data = currentWeatherData;
    temp.innerHTML = formatTemperature(data.temp)
    temp2.innerHTML = formatTemperature(data.temp, false)
    feels_like.innerHTML = formatTemperature(data.feels_like)
    min_temp.innerHTML = formatTemperature(data.min_temp)
    max_temp.innerHTML = formatTemperature(data.max_temp)
}

const getWeather = (city) =>{
	cityName.innerHTML = city
fetch('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city='+ city, options)
	.then(response => {
        if (!response.ok) {
            throw new Error(`Weather data not found for ${city}`);
        }
        return response.json();
    })
	.then(response => {
        // Check if response has valid data
        if (!response || typeof response.temp === 'undefined') {
            throw new Error(`No weather data available for ${city}`);
        }

		console.log(response) 
		
        // Store current weather data for unit conversion
        currentWeatherData = response;
        
        // Add weather icon to city name
        const weatherIcon = getWeatherIcon(response.temp, response.humidity, response.wind_speed);
        cityName.innerHTML = `${weatherIcon} ${city}`;
        
		// Update temperature displays
        updateTemperatureDisplay();
        
		humidity.innerHTML = `${response.humidity}%`
		humidity2.innerHTML = response.humidity
		wind_speed.innerHTML = `${response.wind_speed} km/h`
		wind_speed2.innerHTML = response.wind_speed
		wind_degrees.innerHTML = `${response.wind_degrees}°`
		
        // Convert timestamps to readable format
		sunrise.innerHTML = response.sunrise ? formatTime(response.sunrise) : 'N/A'
		sunset.innerHTML = response.sunset ? formatTime(response.sunset) : 'N/A'
        
        // Clear search box after successful search
        document.getElementById('city').value = '';
	})
	.catch(err => {
        console.error(err);
        cityName.innerHTML = `❌ Error loading weather for ${city}`;
        
        // Show error message to user
        alert(`Sorry, we couldn't find weather data for "${city}". Please check the spelling and try again.`);
        
        // Reset to previous city (Delhi) if there was an error
        setTimeout(() => {
            if (cityName.innerHTML.includes('Error')) {
                getWeather('Delhi');
            }
        }, 2000);
    });
}

// Add loading state management
const showLoading = () => {
    document.getElementById('cityName').innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Loading...';
    document.querySelectorAll('.card-body h1 span').forEach(span => {
        span.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
    });
}

const hideLoading = () => {
    // Loading will be hidden when weather data is populated
}

// Store current city for refresh functionality
let currentCity = 'Delhi';

// Enhanced getWeather function with error handling
const getWeatherEnhanced = (city) => {
    if (!city || city.trim() === '') {
        alert('Please enter a valid city name');
        return;
    }
    
    showLoading();
    currentCity = city.trim();
    getWeather(city.trim());
}

// Geolocation functionality
const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }
    
    document.getElementById('locationBtn').innerHTML = '⏳';
    document.getElementById('locationBtn').disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                // Use reverse geocoding to get city name from coordinates
                const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=YOUR_OPENWEATHER_API_KEY`);
                
                if (response.ok) {
                    const data = await response.json();
                    const cityName = data[0]?.name || 'Current Location';
                    getWeatherEnhanced(cityName);
                } else {
                    // Fallback: use coordinates in API call if available
                    showLoading();
                    cityName.innerHTML = '📍 Your Location';
                    currentCity = 'Current Location';
                    
                    // You could implement coordinate-based weather API call here
                    alert('Unable to get city name from your location. Please search manually.');
                }
            } catch (error) {
                console.error('Error getting location name:', error);
                alert('Unable to get weather for your location. Please search manually.');
            } finally {
                document.getElementById('locationBtn').innerHTML = '📍';
                document.getElementById('locationBtn').disabled = false;
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            alert('Unable to access your location. Please enable location services and try again.');
            document.getElementById('locationBtn').innerHTML = '📍';
            document.getElementById('locationBtn').disabled = false;
        }
    );
}

submit.addEventListener("click", (e)=>{
	e.preventDefault()
	getWeatherEnhanced(city.value)
})

// Add Enter key support for search
city.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        getWeatherEnhanced(city.value);
    }
})

// Add refresh button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Refresh button
    document.getElementById('refresh').addEventListener('click', () => {
        getWeatherEnhanced(currentCity);
    });
    
    // Location button
    document.getElementById('locationBtn').addEventListener('click', getCurrentLocationWeather);
    
    // Unit conversion event listeners
    document.getElementById('celsius').addEventListener('change', updateTemperatureDisplay);
    document.getElementById('fahrenheit').addEventListener('change', updateTemperatureDisplay);
    
    // Add click handlers for dropdown cities
    document.querySelectorAll('.dropdown-item').forEach(item => {
        const cityText = item.textContent.trim();
        if (cityText && ['Delhi', 'Seattle', 'Bangalore', 'New York', 'Tokyo', 'London'].includes(cityText)) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('city').value = cityText;
                getWeatherEnhanced(cityText);
            });
        }
    });
});

getWeather("Delhi")

const cities = ["Delhi", "Shanghai", "New York", "Tokyo", "London", "Paris"];

        const updateWeatherTable = (city) => {
            fetch('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=' + city, options)
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    const weatherTable = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
                    const tableRow = document.createElement('tr');
                    
                    // Add click functionality to table rows
                    tableRow.style.cursor = 'pointer';
                    tableRow.className = 'table-row-hover';
                    tableRow.title = `Click to view weather for ${city}`;
                    
                    tableRow.innerHTML = `
                        <td><strong>${city}</strong></td>
                        <td>${response.cloud_pct || 'N/A'}%</td>
                        <td>${response.feels_like || 'N/A'}°C</td>
                        <td>${response.humidity || 'N/A'}%</td>
                        <td>${response.max_temp || 'N/A'}°C</td>
                        <td>${response.min_temp || 'N/A'}°C</td>
                        <td>${response.sunrise ? formatTime(response.sunrise) : 'N/A'}</td>
                        <td>${response.sunset ? formatTime(response.sunset) : 'N/A'}</td>
                        <td>${response.temp || 'N/A'}°C</td>
                        <td>${response.wind_degrees || 'N/A'}°</td>
                        <td>${response.wind_speed || 'N/A'} km/h</td>
                    `;
                    
                    // Add click event to row
                    tableRow.addEventListener('click', () => {
                        getWeatherEnhanced(city);
                        // Smooth scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                    
                    weatherTable.appendChild(tableRow);
                })
                .catch(err => {
                    console.error(`Error fetching weather for ${city}:`, err);
                    const weatherTable = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
                    const tableRow = document.createElement('tr');
                    tableRow.innerHTML = `
                        <td><strong>${city}</strong></td>
                        <td colspan="10" class="text-muted">Error loading data</td>
                    `;
                    weatherTable.appendChild(tableRow);
                });
        }

        // Fetch and update weather details for predefined cities
        cities.forEach(city => {
            updateWeatherTable(city);
        });
