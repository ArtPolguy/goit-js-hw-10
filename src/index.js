import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputSearch: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputSearch.addEventListener(
  'input',
  debounce(onInputValue, DEBOUNCE_DELAY)
);

function onInputValue(e) {
  e.preventDefault();
  const searchValue = e.target.value.trim();
  if (searchValue === '') {
    clearRender();
    return;
  }
  fetchCountries(searchValue).then(countries => {
    handleFetch(countries);
  });
}

function handleFetch(countries) {
  if (countries.length === 1) {
    clearRender();
    renderCountryListMarkup(countries);
    renderCountryInfoMarkup(countries);
  } else if (countries.length > 2 && countries.length < 10) {
    clearRender();
    renderCountryListMarkup(countries);
  } else if (countries.length > 10) {
    clearRender();
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function renderCountryListMarkup(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-item">
      <img class='country-img' src="${country.flags.svg}" alt="flag">
      <p class="country-name">${country.name.official}</p>
    </li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfoMarkup(countries) {
  const markup = countries
    .map(country => {
      return `<p class="info-text">Capital: <span class="value">${
        country.capital
      }</span></p>
      <p class="info-text">Population: <span class="value">${
        country.population
      }</span></p>
      <p class="info-text">languages: <span class="value">${Object.values(
        country.languages
      )}</span></p>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clearRender() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
