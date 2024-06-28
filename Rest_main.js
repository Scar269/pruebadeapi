const Container = document.querySelector("#Container");
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let allCountries = [];
let displayedCountriesCount = 0;
const countriesPerPage = 20; // Número de países a mostrar por página

const url = "https://restcountries.com/v3.1/all";

// Función para cargar los países en partes
function loadMoreCountries() {
    const nextCountries = allCountries.slice(displayedCountriesCount, displayedCountriesCount + countriesPerPage);
    nextCountries.forEach(country => {
        addCountryCard(country);
    });
    displayedCountriesCount += countriesPerPage;

    // Ocultar el botón si no hay más países para cargar
    if (displayedCountriesCount >= allCountries.length) {
        loadMoreBtn.style.display = 'none';
    }
}

// Función para agregar una tarjeta de país al contenedor
function addCountryCard(country) {
    const countryTemplate = `
        <div class="country">
            <img src="${country.flags.png}" alt="Bandera de ${country.name.common}">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Región:</strong> ${country.region}</p>
            <p><strong>Subregión:</strong> ${country.subregion}</p>
            <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
        </div>
    `;
    Container.innerHTML += countryTemplate;
}

// Función para buscar países por nombre común
function searchCountry() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    // Limpiar el contenedor antes de hacer una nueva búsqueda
    Container.innerHTML = '';
    loadMoreBtn.style.display = 'none';

    if (!searchTerm) {
        loadCountries();
        return;
    }

    // Filtrar países que coincidan con el término de búsqueda
    fetch(`https://restcountries.com/v3.1/name/${searchTerm}`)
        .then(response => response.json())
        .then(countries => {
            if (countries.length > 0) {
                countries.forEach(country => {
                    addCountryCard(country);
                });
            } else {
                Container.innerHTML = '<p>No se encontraron países.</p>';
            }
        })
        .catch(error => {
            console.error('Error al buscar países:', error);
            Container.innerHTML = '<p>No se encontraron países.</p>';
        });
}

// Función para cargar todos los países
function loadCountries() {
    fetch(url)
        .then(response => response.json())
        .then(countries => {
            allCountries = countries;
            displayedCountriesCount = 0;
            loadMoreBtn.style.display = 'block';
            loadMoreCountries(); // Cargar los primeros países
        })
        .catch(error => {
            console.error('Error al cargar los países:', error);
        });
}

// Cargar todos los países al inicio
document.addEventListener('DOMContentLoaded', () => {
    loadCountries();
});
