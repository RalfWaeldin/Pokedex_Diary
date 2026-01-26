import { PokamonUtilities } from "../modules/pokamon_utilities.js";

// Variablen setzen für Tagesempfehlung und DOM Element abgreifen

const container = document.getElementById("pokemon-container");
const MAX_POKEMON_ID = 1025;
const TEAM_SIZE = 6;
// initialize PokemonUtilities
const utilities = new PokamonUtilities();

// Hilfsfunktion: Zufällige Zahl
function getRandomId() {
  return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
}

// 6 eindeutige IDs generieren
function getUniqueRandomIds(count) {
  const ids = new Set();

  while (ids.size < count) {
    ids.add(getRandomId());
  }

  return [...ids];
}

// Pokémon fetchen & anzeigen
async function loadTeamOfTheDay() {
  const pokemonIds = getUniqueRandomIds(TEAM_SIZE);

  for (const id of pokemonIds) {
    utilities
      .getPokamonCardById(id)
      .then((value) => container.appendChild(value));
  }
}

// ===================================================
// Page loading
// ===================================================

loadTeamOfTheDay();

// ===================================================
// Suche
// ===================================================

const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const heroViewer = document.getElementById("hero");
const searchResultViewer = document.getElementById("search-result-viewer");
const searchResultContainer = document.getElementById(
  "search-result-container",
);

const GENERATIONID = 0;
const MINIMUMSTARTSEARCHARS = 2;
const MAXIMUMSEARCHRESULTS = 9;

searchInput.addEventListener("input", () => search_pokemons());
searchClear.addEventListener("click", () => clear_pokemons());

function searchvisibility(showSearch) {
  if (showSearch) {
    heroViewer.classList.add("hidden");
    searchResultViewer.classList.remove("hidden");
  } else {
    searchResultViewer.classList.add("hidden");
    heroViewer.classList.remove("hidden");
  }
}

function search_pokemons() {
  const searchText = searchInput.value;

  const showSearch = searchText.length > 0;
  searchvisibility(showSearch);

  if (searchText.length >= MINIMUMSTARTSEARCHARS) {
    searchResultContainer.textContent = "";
    utilities
      .searchPokemonts(searchText, MAXIMUMSEARCHRESULTS, GENERATIONID)
      .then((results) => {
        const cards = utilities.getPokamonResultCards(results);
        cards.then((value) =>
          value.forEach((card) => searchResultContainer.appendChild(card)),
        );
      });
  }
}

function clear_pokemons() {
  searchInput.value = "";
  searchvisibility(false);
}
