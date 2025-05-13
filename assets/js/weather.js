
import { getTranslation } from './i18n.js';

// ********* Codigo para API *********
export function initWeatherCheck() {
    const cityInput = document.getElementById('cityInput');
    const checkButton = document.getElementById('checkButton');
    const resultCard = document.getElementById('resultCard');
    const resultContent = document.getElementById('resultContent');

    let cachedCountry = null;

    // Obtener país al cargar la página
    getUserCountry().then(c => cachedCountry = c).catch(() => cachedCountry = null);

    checkButton.addEventListener('click', async function () {
        const city = cityInput.value.trim().toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (city) {
            showLoading();

            const query = cachedCountry ? `${city} ${cachedCountry}` : city;

            // Llamar a la API de WeatherAPI
            fetchWeatherData(query)
                .then(weatherData => {
                    let resultHTML = '';

                    if (weatherData.decision) {
                        resultHTML = `
                            <div class="not-dark bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 w-full text-center shadow-sm">
                                <h2 class="text-xl font-semibold mb-1">${getTranslation('yesGoAheadTitle')}</h2>
                                <p class="text-sm text-green-700 mb-2">${getTranslation('yesGoAheadMessage')} <strong>${weatherData.city}</strong>.</p>
                                <div class="grid grid-cols-2 gap-3 text-sm text-left text-green-900 bg-white rounded-lg p-3 shadow-inner">
                                    <div>📈 <strong>${getTranslation('temperature')}:</strong> ${weatherData.temperature}°C</div>
                                    <div>🌤️ <strong>${getTranslation('clouds')}:</strong> ${weatherData.condition}</div>
                                    <div>💨 <strong>${getTranslation('wind')}:</strong> ${weatherData.wind}</div>
                                    <div>🌧️ <strong>${getTranslation('rain')}:</strong> ${weatherData.rain}</div>
                                </div>
                            </div>
                        `;
                    } else {
                        resultHTML = `
                            <div class="not-dark bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 w-full text-center shadow-sm">
                                <h2 class="text-xl font-semibold mb-1">${getTranslation('noGoTitle')}</h2>
                                <p class="text-sm text-red-700 mb-2">${weatherData.reason} ${getTranslation('in')} <strong>${weatherData.city}</strong>.</p>
                                <div class="grid grid-cols-2 gap-3 text-sm text-left text-red-900 bg-white rounded-lg p-3 shadow-inner">
                                    <div>📈 <strong>${getTranslation('temperature')}:</strong> ${weatherData.temperature}°C</div>
                                    <div>🌤️ <strong>${getTranslation('clouds')}:</strong> ${weatherData.condition}</div>
                                    <div>💨 <strong>${getTranslation('wind')}:</strong> ${weatherData.wind}</div>
                                    <div>🌧️ <strong>${getTranslation('rain')}:</strong> ${weatherData.rain}</div>
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
                            ⚠️ ${getTranslation('cityNotFound')}
                        </div>`;
                    resultCard.classList.add('show');
                })
                .finally(() => {
                    hideLoading();
                });
                
        } else {
            alert(getTranslation('emptyCity'));
        }
    });

    async function fetchWeatherData(city) {
        const workerUrl = 'https://weather-proxy.mini-proyectos-antonio.workers.dev';
        const url = `${workerUrl}?city=${encodeURIComponent(city)}`
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
            condition: `${cloud} %`,
            wind: `${wind} km/h`,
            rain: `${rain} mm`,
            ...canWearSweatshirt
        };

        return weatherData;
    }

    function showLoading() {
        const button = document.getElementById('checkButton');
        const text = document.getElementById('buttonText');
        const spinner = document.getElementById('spinner');

        button.disabled = true;
        text.classList.add('hidden');
        spinner.classList.remove('hidden');
    }

    function hideLoading() {
        const button = document.getElementById('checkButton');
        const text = document.getElementById('buttonText');
        const spinner = document.getElementById('spinner');

        button.disabled = false;
        text.classList.remove('hidden');
        spinner.classList.add('hidden');
    }

    async function getUserCountry() {
        try {
            const response = await fetch('https://ip-api.mini-proyectos-antonio.workers.dev/');
            const data = await response.json();
            return data.country;
        } catch (e) {
            return null;
        }
    }

    function decideSweatshirt(temp, cloud, wind, rain) {
        if (temp >= 19 && temp <= 25) {
            return { decision: true };
        }
        if (temp >= 17 && temp < 19 && cloud <= 30 && wind <= 15) {
            return { decision: true };
        }
        if (temp > 25 && temp <= 27 && rain > 0 && wind >= 15) {
            return { decision: true };
        }
    
        // Si llegamos aquí, la decisión es false: buscamos el motivo
        let reason = "";
    
        if (temp < 17) {
            reason = getTranslation("tooCold");
        } else if (temp > 27) {
            reason = getTranslation("tooHot");
        } else if (temp >= 17 && temp < 19) {
            if (cloud > 30) reason = getTranslation("tooCold");
            else if (wind > 15) reason = getTranslation("tooCold");
        } else if (temp > 25 && temp <= 27) {
            if (rain === 0) reason = getTranslation("tooHot");
            else if (wind < 15) reason = getTranslation("tooHot");
        } else {
            reason = getTranslation("notIdeal");
        }
    
        return {
            decision: false,
            reason: reason
        };
    }
}