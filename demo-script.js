// Demo version with mock data for interactive features demonstration

// Mock weather data for demonstration
const mockWeatherData = {
    'Delhi': {
        temp: 25,
        feels_like: 28,
        humidity: 65,
        min_temp: 20,
        max_temp: 30,
        wind_speed: 15,
        wind_degrees: 180,
        sunrise: 1691972371,
        sunset: 1692019953,
        cloud_pct: 40
    },
    'Seattle': {
        temp: 18,
        feels_like: 16,
        humidity: 80,
        min_temp: 12,
        max_temp: 22,
        wind_speed: 12,
        wind_degrees: 270,
        sunrise: 1691972571,
        sunset: 1692020053,
        cloud_pct: 75
    },
    'Bangalore': {
        temp: 22,
        feels_like: 24,
        humidity: 70,
        min_temp: 18,
        max_temp: 26,
        wind_speed: 8,
        wind_degrees: 90,
        sunrise: 1691972271,
        sunset: 1692019853,
        cloud_pct: 60
    },
    'New York': {
        temp: 20,
        feels_like: 22,
        humidity: 55,
        min_temp: 16,
        max_temp: 24,
        wind_speed: 18,
        wind_degrees: 225,
        sunrise: 1691972471,
        sunset: 1692019753,
        cloud_pct: 30
    },
    'Tokyo': {
        temp: 28,
        feels_like: 32,
        humidity: 85,
        min_temp: 24,
        max_temp: 32,
        wind_speed: 10,
        wind_degrees: 45,
        sunrise: 1691972171,
        sunset: 1692020153,
        cloud_pct: 65
    },
    'London': {
        temp: 15,
        feels_like: 13,
        humidity: 90,
        min_temp: 10,
        max_temp: 18,
        wind_speed: 22,
        wind_degrees: 315,
        sunrise: 1691972671,
        sunset: 1692019653,
        cloud_pct: 85
    },
    'Paris': {
        temp: 17,
        feels_like: 15,
        humidity: 75,
        min_temp: 12,
        max_temp: 21,
        wind_speed: 14,
        wind_degrees: 180,
        sunrise: 1691972571,
        sunset: 1692019753,
        cloud_pct: 55
    },
    'Shanghai': {
        temp: 30,
        feels_like: 35,
        humidity: 78,
        min_temp: 26,
        max_temp: 34,
        wind_speed: 16,
        wind_degrees: 135,
        sunrise: 1691972071,
        sunset: 1692020253,
        cloud_pct: 50
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

// Store current city for refresh functionality
let currentCity = 'Delhi';

// Helper function to get weather icon based on conditions
const getWeatherIcon = (temp, humidity, windSpeed) => {
    if (temp > 30) return '☀️'; // Hot
    if (temp < 0) return '❄️'; // Freezing
    if (humidity > 80) return '🌧️'; // Rainy/Humid
    if (windSpeed > 20) return '🌪️'; // Windy
    if (temp < 10) return '🌨️'; // Cold
    return '⛅'; // Default cloudy
}

// Add loading state management
const showLoading = () => {
    document.getElementById('cityName').innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Loading...';
    document.querySelectorAll('.card-body h1 span').forEach(span => {
        span.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';
    });
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

// Enhanced getWeather function with mock data
const getWeather = (city) => {
    cityName.innerHTML = city;
    
    // Simulate loading
    showLoading();
    
    setTimeout(() => {
        const response = mockWeatherData[city] || mockWeatherData['Delhi'];
        
        console.log('Demo weather data:', response);
        
        // Store current weather data for unit conversion
        currentWeatherData = response;
        
        // Add weather icon to city name
        const weatherIcon = getWeatherIcon(response.temp, response.humidity, response.wind_speed);
        cityName.innerHTML = `${weatherIcon} ${city}`;
        
        // Update temperature displays
        updateTemperatureDisplay();
        
        humidity.innerHTML = `${response.humidity}%`;
        humidity2.innerHTML = response.humidity;
        wind_speed.innerHTML = `${response.wind_speed} km/h`;
        wind_speed2.innerHTML = response.wind_speed;
        
        // Convert timestamps to readable format
        sunrise.innerHTML = response.sunrise ? formatTime(response.sunrise) : 'N/A';
        sunset.innerHTML = response.sunset ? formatTime(response.sunset) : 'N/A';
        
        // Clear search box after successful search
        document.getElementById('city').value = '';
    }, 1000); // Simulate network delay
}

// Enhanced getWeather function with error handling
const getWeatherEnhanced = (city) => {
    if (!city || city.trim() === '') {
        alert('Please enter a valid city name');
        return;
    }
    
    currentCity = city.trim();
    
    // Check if city exists in mock data
    if (!mockWeatherData[city.trim()]) {
        alert(`Sorry, demo data is not available for "${city}". Available cities: ${Object.keys(mockWeatherData).join(', ')}`);
        return;
    }
    
    getWeather(city.trim());
}

// Geolocation functionality (simplified for demo)
const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }
    
    document.getElementById('locationBtn').innerHTML = '⏳';
    document.getElementById('locationBtn').disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // For demo purposes, just use Delhi
            alert('Demo: Using Delhi as your location');
            getWeatherEnhanced('Delhi');
            document.getElementById('locationBtn').innerHTML = '📍';
            document.getElementById('locationBtn').disabled = false;
        },
        (error) => {
            console.error('Geolocation error:', error);
            alert('Unable to access your location. Using Delhi as default.');
            getWeatherEnhanced('Delhi');
            document.getElementById('locationBtn').innerHTML = '📍';
            document.getElementById('locationBtn').disabled = false;
        }
    );
}

submit.addEventListener("click", (e) => {
    e.preventDefault();
    getWeatherEnhanced(city.value);
});

// Add Enter key support for search
city.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        getWeatherEnhanced(city.value);
    }
});

// Update weather table with mock data
const cities = ["Delhi", "Shanghai", "New York", "Tokyo", "London", "Paris"];

const updateWeatherTable = (city) => {
    const response = mockWeatherData[city];
    
    setTimeout(() => {
        console.log('Demo table data:', response);
        const weatherTable = document.getElementById('weatherTable').getElementsByTagName('tbody')[0];
        const tableRow = document.createElement('tr');
        
        // Add click functionality to table rows
        tableRow.style.cursor = 'pointer';
        tableRow.className = 'table-row-hover';
        tableRow.title = `Click to view weather for ${city}`;
        
        tableRow.innerHTML = `
            <td><strong>${city}</strong></td>
            <td>${response.cloud_pct || 'N/A'}%</td>
            <td>${formatTemperature(response.feels_like)}</td>
            <td>${response.humidity || 'N/A'}%</td>
            <td>${formatTemperature(response.max_temp)}</td>
            <td>${formatTemperature(response.min_temp)}</td>
            <td>${response.sunrise ? formatTime(response.sunrise) : 'N/A'}</td>
            <td>${response.sunset ? formatTime(response.sunset) : 'N/A'}</td>
            <td>${formatTemperature(response.temp)}</td>
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
    }, Math.random() * 2000 + 500); // Simulate varying load times
}

// Add refresh button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Refresh button
    document.getElementById('refresh').addEventListener('click', () => {
        getWeatherEnhanced(currentCity);
    });
    
    // Location button
    document.getElementById('locationBtn').addEventListener('click', getCurrentLocationWeather);
    
    // Unit conversion event listeners
    document.getElementById('celsius').addEventListener('change', () => {
        updateTemperatureDisplay();
        // Also update table if needed
        updateTableTemperatures();
    });
    
    document.getElementById('fahrenheit').addEventListener('change', () => {
        updateTemperatureDisplay();
        // Also update table if needed
        updateTableTemperatures();
    });
    
    // Add click handlers for dropdown cities
    document.querySelectorAll('.dropdown-item').forEach(item => {
        const cityText = item.textContent.trim();
        if (cityText && Object.keys(mockWeatherData).includes(cityText)) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('city').value = cityText;
                getWeatherEnhanced(cityText);
            });
        }
    });
});

// Function to update table temperatures when unit changes
const updateTableTemperatures = () => {
    const tableRows = document.querySelectorAll('#weatherTable tbody tr');
    tableRows.forEach((row, index) => {
        const cityName = cities[index];
        const data = mockWeatherData[cityName];
        if (data) {
            const cells = row.children;
            cells[2].textContent = formatTemperature(data.feels_like); // Feels Like
            cells[4].textContent = formatTemperature(data.max_temp);   // Max Temp
            cells[5].textContent = formatTemperature(data.min_temp);   // Min Temp
            cells[8].textContent = formatTemperature(data.temp);       // Temp
        }
    });
}

// Initialize with Delhi
getWeather("Delhi");

// Fetch and update weather details for predefined cities
cities.forEach(city => {
    updateWeatherTable(city);
});