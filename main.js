// Variablen setzen für Tagesempfehlung und DOM Element abgreifen

const container = document.getElementById("pokemon-container");
const MAX_POKEMON_ID = 1025;
const TEAM_SIZE = 6;

// Typfarben Global
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

// Pokemon fangen / freilassen Pokedex
function getPokedex() {
  return JSON.parse(localStorage.getItem("pokedex")) || [];
}

function togglePokedex(pokemon, button) {
  let pokedex = getPokedex();
  const isCaught = pokedex.some((p) => p.id === pokemon.id);

  if (isCaught) {
    // Wenn schon da -> Entfernen (Freilassen)
    pokedex = pokedex.filter((p) => p.id !== pokemon.id);
    updateButtonState(button, false);
  } else {
    // Wenn nicht da -> Hinzufügen (Fangen)
    pokedex.push({
      id: pokemon.id,
      name: pokemon.name,
      image:
        pokemon.sprites.other["official-artwork"].front_default ||
        pokemon.sprites.front_default,
      types: pokemon.types.map((t) => t.type.name),
      note: "",
    });
    updateButtonState(button, true);
  }

  localStorage.setItem("pokedex", JSON.stringify(pokedex));
  updatePokedexCount();
}

// Update Button
function updateButtonState(button, isCaught) {
  const span = button.querySelector("span");
  if (isCaught) {
    button.classList.remove("bg-slate-800", "hover:bg-red-600");
    button.classList.add("bg-red-600", "hover:bg-red-700");
    span.textContent = "Freilassen";
  } else {
    button.classList.remove("bg-red-600", "hover:bg-red-700");
    button.classList.add("bg-slate-800", "hover:bg-red-600");
    span.textContent = "Fangen";
  }
}

// Gefangene Pokémon zählen
function updatePokedexCount() {
  const countEl = document.getElementById("pokedex-count");
  if (!countEl) return;
  countEl.textContent = getPokedex().length;
}

// Pokémon fetchen & anzeigen
async function loadTeamOfTheDay() {
  const pokemonIds = getUniqueRandomIds(TEAM_SIZE);

  for (const id of pokemonIds) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemon = await response.json();

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
            <div class="flex justify-center items-center gap-[5px] mb-3">
              ${pokemon.types
                .map(
                  (t) =>
                    `<span class="text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase ${
                      typeColors[t.type.name] || "bg-gray-400"
                    }">${t.type.name}</span>`
                )
                .join("")}
            </div>
        </div>
        <div class="p-5 pt-2 text-center">
            <button class="pokeball-spin catch-btn w-full bg-slate-800 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor"/></svg>
                <span>Fangen</span>
            </button>
        </div>
    `;

      const isCaughtInitial = getPokedex().some((p) => p.id === pokemon.id);

      // Button initialisieren
      const catchBtn = card.querySelector(".catch-btn");
      updateButtonState(catchBtn, isCaughtInitial); // Setzt Text und Farbe beim Laden

      // Notiz zuweisen
      if (isCaughtInitial) {
        attachNoteField(
          card.querySelector(".p-5.pt-2.text-center"),
          pokemon.id
        );
      }

      // Event Listener umschalten
      catchBtn.addEventListener("click", () => {
        togglePokedex(pokemon, catchBtn);

        const isNowCaught = getPokedex().some((p) => p.id === pokemon.id);
        const contentArea = card.querySelector(".p-5.pt-2.text-center");

        // Notizfeld sofort anzeigen, wenn gefangen
        if (isNowCaught && !contentArea.querySelector("textarea")) {
          attachNoteField(contentArea, pokemon.id);
        }

        // Notizfeld entfernen, wenn freigelassen
        if (!isNowCaught && contentArea.querySelector("textarea")) {
          contentArea.querySelector("textarea").remove();
        }
      });

      //append card
      container.appendChild(card);
    } catch (error) {
      console.error("Fehler beim Laden von Pokémon:", error);
    }
  }
}
// Start
loadTeamOfTheDay();
updatePokedexCount();
