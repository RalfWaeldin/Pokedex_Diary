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

// Pokedex
function getPokedex() {
  return JSON.parse(localStorage.getItem("pokedex")) || [];
}

function updatePokedexCount() {
  const countEl = document.getElementById("pokedex-count");
  if (!countEl) return;
  countEl.textContent = getPokedex().length;
}

// function attachNoteField(element, pokemonId) {
//   const textarea = document.createElement("textarea");
//   textarea.placeholder = "Deine persönliche Notiz...";
//   textarea.className =
//     "w-full mt-3 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-400 outline-none";

//   // Initiale Notiz aus pokedex laden
//   const pokedex = JSON.parse(localStorage.getItem("pokedex")) || [];
//   const entry = pokedex.find((p) => p.id === pokemonId);
//   textarea.value = entry?.note || "";

//   // Bei Eingabe speichern
//   textarea.addEventListener("input", () => {
//     const updated = pokedex.map((p) =>
//       p.id === pokemonId ? { ...p, note: textarea.value } : p
//     );
//     localStorage.setItem("pokedex", JSON.stringify(updated));
//   });

//   element.appendChild(textarea);
// }

function attachNoteField(element, pokemonId) {
  const textarea = document.createElement("textarea");
  textarea.placeholder = "Deine persönliche Notiz...";
  textarea.className =
    "w-full mt-3 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-400 outline-none";

  // Initiale Notiz laden
  const pokedex = JSON.parse(localStorage.getItem("pokedex")) || [];
  const entry = pokedex.find((p) => p.id === pokemonId);
  textarea.value = entry?.note || "";

  // Bei Eingabe speichern (Pokedex jedes Mal neu laden)
  textarea.addEventListener("input", () => {
    const currentPokedex = JSON.parse(localStorage.getItem("pokedex")) || [];

    const updated = currentPokedex.map((p) =>
      p.id === pokemonId ? { ...p, note: textarea.value } : p
    );

    localStorage.setItem("pokedex", JSON.stringify(updated));
  });

  element.appendChild(textarea);
}

function renderPokedexPage() {
  const container = document.getElementById("pokemon-container");
  if (!container) return;

  container.innerHTML = "";
  const pokedex = getPokedex();

  if (pokedex.length === 0) {
    container.innerHTML = `
      <p class="col-span-full text-center text-gray-500">
        Noch keine Pokémon gefangen 🥲
      </p>
    `;
    return;
  }

  pokedex.forEach((pokemon) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100";

    const mainType = pokemon.types[0];
    const headerColor = typeColors[mainType] || "bg-gray-400";

    card.innerHTML = `
      <div class="h-24 ${headerColor} opacity-80 relative flex justify-center items-center">
        <span class="absolute top-2 right-3 text-white/60 font-bold text-3xl">
          #${pokemon.id.toString().padStart(3, "0")}
        </span>
      </div>

      <div class="-mt-16 flex justify-center">
        <img src="${
          pokemon.image
        }" class="w-32 h-32 object-contain drop-shadow-lg" />
      </div>

      <div class="p-5 text-center">
        <h2 class="capitalize font-bold text-2xl mb-2">${pokemon.name}</h2>
          <div class="flex justify-center items-center gap-[5px] mb-3">
            ${pokemon.types
              .map(
                (t) =>
                  `<span class="text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase ${
                    typeColors[t] || "bg-gray-400"
                  }">${t}</span>`
              )
              .join("")}
          </div>
      </div>
    `;

    // Freilassen-Button
    const releaseBtn = document.createElement("button");
    releaseBtn.textContent = "Freilassen";
    releaseBtn.className =
      "m-5 w-[calc(100%-2.5rem)] bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold transition";

    // Notiz-Wrapper
    const noteWrapper = document.createElement("div");
    noteWrapper.className = "px-5 pb-5";

    // Notizfeld anhängen
    attachNoteField(noteWrapper, pokemon.id);

    releaseBtn.addEventListener("click", () => {
      const updated = getPokedex().filter((p) => p.id !== pokemon.id);
      localStorage.setItem("pokedex", JSON.stringify(updated));
      updatePokedexCount();
      renderPokedexPage();
    });

    card.appendChild(releaseBtn);
    card.appendChild(noteWrapper);
    container.appendChild(card);
  });
}

renderPokedexPage();
updatePokedexCount();
