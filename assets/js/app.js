import { initI18n } from './i18n.js';
import { initWeatherCheck } from './weather.js';
import { initAutocomplete } from './autocomplete.js';
import { initThemeToggle } from './theme-toggle.js';
import { initCarousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initI18n();         // Carga traducciones e idioma
    initWeatherCheck();       // Botón comprobar clima
    initAutocomplete();       // Autocompletado de ciudades
    initThemeToggle();        // Modo oscuro/claro
    initCarousel();           // Carrusel de sudaderas
});