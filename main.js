// Variablen setzen für Tagesempfehlung und DOM Element abgreifen

const container = document.getElementById("pokemon-container");
const MAX_POKEMON_ID = 1025;
const TEAM_SIZE = 6;

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
    try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();

    // Typfarben
    const typeColors = {
        grass: "green",
        poison: "purple",
        fire: "red",
        water: "blue",
        electric: "yellow",
        bug: "olive",
        flying: "skyblue",
        ground: "sandybrown",
        rock: "gray",
        psychic: "pink",
        ice: "lightblue",
        dragon: "darkblue",
        fairy: "hotpink",
        ghost: "indigo",
        steel: "silver",
        fighting: "brown",
        dark: "black",
        normal: "lightgray",
    };

    // Typen HTML
    const ptype = pokemon.types.map((t) => t.type.name);
    const typesHTML = ptype
        .map(
        (t) =>
            `<span style="color:${typeColors[t]}; font-weight:bold;">${t}</span>`
        )
        .join(", ");

    // Card design
    const card = document.createElement("div");
    card.className = `
        bg-stone-50
        border-2
        border-black
        rounded-lg
        p-4
        flex
        flex-col
        items-center
        text-center
        shadow-md
    `;
    

    // Karteninhalt
    card.innerHTML = `
        <img 
        src="${pokemon.sprites.front_default}" 
        alt="${pokemon.name}"
        class="w-24 h-24 object-contain"
        />
        <h2 class="mt-2 text-lg font-semibold capitalize">
        ${pokemon.name}
        </h2>
        <p class="text-sm text-gray-500">#${pokemon.id}</p>
        <p class="mt-1 text-sm">Typ: ${typesHTML}</p>
    `;
    
    //append card
    container.appendChild(card);
    } catch (error) {
    console.error("Fehler beim Laden von Pokémon:", error);
    }
}
}
// Start
loadTeamOfTheDay();