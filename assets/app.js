document.addEventListener('DOMContentLoaded', function () {
    const cityInput = document.getElementById('cityInput');

    // Codigo para API
    const checkButton = document.getElementById('checkButton');
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');

    const apiKey = '2700c9141a4c4716957175706251104';

    let cachedCountry = null;

    // Obtener país al cargar la página
    getUserCountry().then(c => cachedCountry = c).catch(() => cachedCountry = null);

    checkButton.addEventListener('click', async function () {
        const city = cityInput.value.trim().toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (city) {
            const query = cachedCountry ? `${city} ${cachedCountry}` : city;

            // Llamar a la API de WeatherAPI
            fetchWeatherData(query)
                .then(weatherData => {
                    let resultHTML = '';

                    if (weatherData.canWearSweatshirt) {
                        resultHTML = `
                            <div class="bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 w-full text-center shadow-sm">
                                <h2 class="text-xl font-semibold mb-1">✅ ¡Sí, adelante!</h2>
                                <p class="text-sm text-green-700 mb-2">Hoy es un buen día para salir en sudadera en <strong>${weatherData.city}</strong>.</p>
                                <div class="grid grid-cols-2 gap-3 text-sm text-left text-green-900 bg-white rounded-lg p-3 shadow-inner">
                                    <div>📈 <strong>Temperatura:</strong> ${weatherData.temperature}°C</div>
                                    <div>🌤️ <strong>Nubes:</strong> ${weatherData.condition}</div>
                                    <div>💨 <strong>Viento:</strong> ${weatherData.wind}</div>
                                    <div>🌧️ <strong>Lluvia:</strong> ${weatherData.rain}</div>
                                </div>
                            </div>
                        `;
                    } else {
                        resultHTML = `
                            <div class="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 w-full text-center shadow-sm">
                                <h2 class="text-xl font-semibold mb-1">❌ Mejor no...</h2>
                                <p class="text-sm text-red-700 mb-2">No parece buen clima para sudadera en <strong>${weatherData.city}</strong>.</p>
                                <div class="grid grid-cols-2 gap-3 text-sm text-left text-red-900 bg-white rounded-lg p-3 shadow-inner">
                                    <div>📈 <strong>Temperatura:</strong> ${weatherData.temperature}°C</div>
                                    <div>🌤️ <strong>Nubes:</strong> ${weatherData.condition}</div>
                                    <div>💨 <strong>Viento:</strong> ${weatherData.wind}</div>
                                    <div>🌧️ <strong>Lluvia:</strong> ${weatherData.rain}</div>
                                </div>
                            </div>
                        `;
                    }
                    resultContent.innerHTML = resultHTML;
                    resultCard.classList.add('show');
                    resultCard.scrollIntoView({ behavior: 'smooth' });
                })
                .catch(error => {
                    resultContent.innerHTML = `
                        <div class="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
                            ⚠️ No se pudo encontrar la ciudad. ¿Está bien escrita?
                        </div>`;
                    resultCard.classList.add('show');
                });
        } else {
            alert('Debes introducir una ciudad o un pueblo');
        }
    });

    async function fetchWeatherData(city) {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const temp = data.current.temp_c;
        const cloud = data.current.cloud;
        const wind = data.current.wind_kph;
        const rain = data.current.precip_mm;

        let canWearSweatshirt = decideSweatshirt(temp, cloud, wind, rain);

        const weatherData = {
            city: data.location.name,
            temperature: temp,
            condition: `${cloud}% nubes`,
            wind: `${wind} km/h`,
            rain: `${rain} mm`,
            canWearSweatshirt
        };

        return weatherData;
    }

    async function getUserCountry() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return data.country_name;
        } catch (e) {
            return null;
        }
    }

    function decideSweatshirt(temp, cloud, wind, rain) {
        if (temp >= 20 && temp <= 25) return true;
        if (temp >= 17 && temp < 20 && cloud <= 30 && wind <= 15) return true;
        if (temp > 25 && temp <= 28 && rain > 0 && wind >= 15) return true;
        return false;
    }

    // Codigo para autocompletado
    const inputContainer = cityInput.parentElement;
    const citiesData = 'assets/poblaciones.json';

    let allCities = [];

    // Cargar las poblaciones de España desde el archivo JSON
    fetch(citiesData)
        .then(response => response.json())
        .then(data => {
            allCities = data;
        })
        .catch(error => console.error('Error fetching city data:', error));

    // Event listener para autocompletado
    cityInput.addEventListener('input', function () {
        const query = cityInput.value.trim().toLowerCase();
        if (query.length >= 3) { // Solo buscar cuando el usuario haya escrito más de 2 caracteres
            const matchingCities = searchCities(query);
            showAutocompleteSuggestions(matchingCities);
        } else {
            // Si no hay texto o es menor de 3 caracteres, no mostrar sugerencias
            hideAutocompleteSuggestions();
        }
    });

    // Buscar las ciudades que coincidan con el texto ingresado
    function searchCities(query) {
        return allCities.filter(city => city.label.toLowerCase().includes(query));
    }

    // Mostrar las sugerencias de autocompletado
    function showAutocompleteSuggestions(suggestions) {
        // Si ya hay un desplegable, eliminarlo antes de agregar las nuevas sugerencias
        hideAutocompleteSuggestions();

        if (suggestions.length === 0) return;

        const suggestionList = document.createElement('ul');
        suggestionList.classList.add('suggestions-list', 'bg-white', 'border', 'border-gray-300', 'mt-1');
        suggestionList.innerHTML = ''; // Limpiar las sugerencias anteriores

        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion.label; // Mostrar el nombre de la ciudad
            listItem.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100');
            listItem.addEventListener('click', function () {
                cityInput.value = suggestion.label; // Establece la ciudad seleccionada en el input
                hideAutocompleteSuggestions(); // Elimina las sugerencias después de seleccionar
            });
            suggestionList.appendChild(listItem);
        });

        // Agregar la lista de sugerencias al contenedor del input
        inputContainer.appendChild(suggestionList);
    }

    // Ocultar las sugerencias cuando el usuario haga clic fuera del input
    function hideAutocompleteSuggestions() {
        const suggestionList = inputContainer.querySelector('.suggestions-list');
        if (suggestionList) {
            suggestionList.remove();
        }
    }

    // Cerrar las sugerencias si el usuario hace clic fuera del input
    document.addEventListener('click', function (e) {
        if (!inputContainer.contains(e.target)) {
            hideAutocompleteSuggestions();
        }
    });
});
