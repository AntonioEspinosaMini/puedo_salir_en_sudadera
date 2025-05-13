// ********** Codigo para autocompletado *********
export function initAutocomplete() {
    const cityInput = document.getElementById('cityInput');
    if (!cityInput) return;

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
        suggestionList.classList.add('suggestions-list', 'bg-white', 'dark:bg-[#2a2a2a]', 'border', 'border-gray-300', 'dark:border-gray-600', 'mt-1');
        suggestionList.innerHTML = ''; // Limpiar las sugerencias anteriores

        suggestions.forEach(suggestion => {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion.label; // Mostrar el nombre de la ciudad
            listItem.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-gray-100', 'dark:hover:bg-gray-700', 'text-gray-800', 'dark:text-gray-100');
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
}