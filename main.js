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
        grass: "bg-green-500",
        poison: "bg-purple-500",
        fire: "bg-orange-500",
        water: "bg-blue-500",
        electric: "bg-yellow-400",
        bug: "bg-lime-600",
        flying: "bg-indigo-400",
        ground: "bg-yellow-700",
        rock: "bg-yellow-800",
        psychic: "bg-pink-500",
        ice: "bg-cyan-400",
        dragon: "bg-indigo-600",
        fairy: "bg-pink-300",
        ghost: "bg-purple-700",
        steel: "bg-gray-500",
        fighting: "bg-orange-700",
        dark: "bg-gray-800",
        normal: "bg-gray-400",
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

      const mainType = pokemon.types[0].type.name;
      const colorClass = typeColors[mainType] || "bg-gray-400";
      const formattedId = `#${pokemon.id.toString().padStart(3, "0")}`;

      // Karteninhalt
      card.className =
        "bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative border border-gray-100";
      card.innerHTML = `
        <div class="h-24 ${colorClass} opacity-80 relative flex justify-center items-center">
           <span class="absolute top-2 right-3 text-white/60 font-bold text-4xl opacity-50 z-0">${formattedId}</span>
        </div>
        <div class="relative -mt-16 flex justify-center z-10">
            <img src="${
              pokemon.sprites.other["official-artwork"].front_default ||
              pokemon.sprites.front_default
            }"  alt="${pokemon.name}"
                 class="w-32 h-32 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
        </div>
        <div class="p-5 pt-2 text-center">
            <h2 class="capitalize font-bold text-2xl text-slate-800 mb-2">
                ${pokemon.name}
            </h2>
                ${pokemon.types
                  .map(
                    (t) =>
                      `<span class="text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase ${
                        typeColors[t.type.name] || "bg-gray-400"
                      }">${t.type.name}</span>`
                  )
                  .join("")}
        </div>
        <div class="p-5 pt-2 text-center">
            <button class="catch-btn w-full bg-slate-800 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor"/></svg>
                <span>Fangen</span>
            </button>
        </div>
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
