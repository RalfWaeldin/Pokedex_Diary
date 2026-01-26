//=============================================
// Zentrale Pokamon Klasse
//=============================================
export class PokamonUtilities {
  //===========================================================
  // PRIVATE FIELDS
  //===========================================================

  //internal result of fetching the pokamon index
  #fetch;

  //definition pokamon generations
  #generations = [
    {
      generationName: "Kanto",
      generationIndex: 1,
      start: 0,
      end: 151,
    },
    {
      generationName: "Johto",
      generationIndex: 2,
      start: 152,
      end: 251,
    },
    {
      generationName: "Hoenn",
      generationIndex: 3,
      start: 252,
      end: 386,
    },
    {
      generationName: "Sinnoh",
      generationIndex: 4,
      start: 387,
      end: 493,
    },
    {
      generationName: "Einall",
      generationIndex: 5,
      start: 494,
      end: 649,
    },
    {
      generationName: "Unova",
      generationIndex: 5,
      start: 494,
      end: 649,
    },
    {
      generationName: "Kalos",
      generationIndex: 6,
      start: 650,
      end: 721,
    },
    {
      generationName: "Alola",
      generationIndex: 7,
      start: 722,
      end: 809,
    },
    {
      generationName: "Galar",
      generationIndex: 8,
      start: 810,
      end: 905,
    },
    {
      generationName: "Hisui",
      generationIndex: 8,
      start: 810,
      end: 905,
    },
    {
      generationName: "Paldea",
      generationIndex: 9,
      start: 906,
      end: 1025,
    },
    {
      generationName: "after Karmesin & Purpur",
      generationIndex: 10,
      start: 1026,
      end: 1350,
    },
  ];

  //===========================================================
  // PRIVATE METHODS
  //===========================================================

  // Inintialisierung der Such indexe
  // #fetch: alle
  async #initializeIndexes() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0",
      );

      if (!response.ok)
        throw new Error('"Response Failure Index!"', { details: "http error" });

      const data = await response.json();

      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  #getIndexFromUrl(url) {
    const lastCharacter = String(url).substring(String(url).length - 1);

    if (lastCharacter == "/") {
      const removedEndSlash = String(url).substring(0, String(url).length - 1);
      const lastSlashPos = String(removedEndSlash).lastIndexOf("/");
      const indexString = String(removedEndSlash).substring(lastSlashPos + 1);
      return Number(indexString);
    } else {
      const lastSlashPos = String(url).lastIndexOf("/");
      const indexString = String(url).substring(lastSlashPos + 1);
      return Number(indexString);
    }
  }

  // enhanced the fetched index by additional properties
  #enhanceIndex(fetchedIndex) {
    return fetchedIndex.map((item, index) => {
      const generationObject = this.getGenerationfromPokemon(index);
      const pokemonIndex = this.#getIndexFromUrl(item.url);
      return new PokemonSearchResult(
        //index + 1,
        pokemonIndex,
        item.name,
        item.url,
        generationObject.generationIndex,
        generationObject.generationName,
        [],
      );
    });
  }

  // Kapselung des fetch für Pokemon Details
  async #getPokemonDetail(id) {
    const query = `https://pokeapi.co/api/v2/pokemon/${id}`;
    try {
      const response = await fetch(query);

      if (!response.ok)
        throw new Error(
          `"[Status: ${response.status}] Response Failure Pokemon Detail [id: ${id}] Fetch!"`,
          {
            details: "http error",
          },
        );

      const data = await response.json();

      return data;
    } catch (err) {
      console.log(err, `[id: ${id}]`);
    }
  }

  async #getPokemonDetailsByUrl(apiUrl) {
    const response = await fetch(apiUrl);

    if (!response.ok)
      throw new Error(
        `"[Status: ${response.status}] Response Failure Pokemon Typen Fetch!"`,
        {
          details: "http error",
        },
      );

    const data = await response.json();

    return data;
  }

  #cardTemplate(internalresult) {
    const ptype = internalresult.types.map((t) => new PokemonType(t.type.name));
    const card = document.createElement("div");
    card.name = "card";
    card.className =
      "bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative border border-gray-100";

    const cardheader = document.createElement("div");
    cardheader.name = "card-header";
    cardheader.className =
      "h-24 opacity-80 relative flex justify-center items-center";
    cardheader.classList.add(ptype[0].tailWindColor || "bg-gray-400");

    const cardheadercontent = document.createElement("span");
    cardheadercontent.name = "card-header-content";
    cardheadercontent.className =
      "absolute top-2 right-3 text-white/60 font-bold text-4xl opacity-50 z-0";
    cardheadercontent.textContent =
      "#" + internalresult.id.toString().padStart(3, "0");
    cardheader.appendChild(cardheadercontent);
    card.appendChild(cardheader);

    const cardpokemon = document.createElement("div");
    cardpokemon.name = "card-content-pokemon";
    cardpokemon.className = "relative -mt-16 flex justify-center z-10";

    const cardpokemonimage = document.createElement("img");
    //cardpokemonimage.name = "card-content-pokemon-image";
    cardpokemonimage.className =
      "w-32 h-32 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300";
    cardpokemonimage.src =
      internalresult.sprites.other["official-artwork"].front_default ||
      internalresult.sprites.front_default;
    cardpokemonimage.alt = internalresult.name;
    cardpokemon.appendChild(cardpokemonimage);
    card.appendChild(cardpokemon);

    const cardinfo1 = document.createElement("div");
    cardinfo1.name = "card-info-1";
    cardinfo1.className = "p-5 pt-2 text-center";

    const cardinfoheader = document.createElement("h2");
    cardinfoheader.name = "card-info-title";
    cardinfoheader.className =
      "capitalize font-bold text-2xl text-slate-800 mb-2";
    cardinfoheader.textContent = internalresult.name;
    cardinfo1.appendChild(cardinfoheader);

    ptype.map((pokemontype) => {
      const cardinfotype = document.createElement("span");
      cardinfotype.name = "card-info-pokemon-type";
      cardinfotype.className =
        "text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase";
      cardinfotype.classList.add(pokemontype.tailWindColor || "bg-gray-400");
      cardinfotype.textContent = pokemontype.name;
      cardinfo1.appendChild(cardinfotype);
    });

    card.appendChild(cardinfo1);

    const cardinfo2 = document.createElement("div");
    cardinfo2.name = "card-info-2";
    cardinfo2.className = "p-5 pt-2 text-center";

    const cardbutton = document.createElement("button");
    cardbutton.name = "card-button-fangen";
    cardbutton.className =
      "catch-btn w-full bg-slate-800 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all";

    const svgns = "http://www.w3.org/2000/svg";

    const cardbuttonsvg = document.createElementNS(svgns, "svg");
    cardbuttonsvg.name = "card-button-fangen-image";
    cardbuttonsvg.setAttributeNS(null, "class", "w-5 h-5");
    cardbuttonsvg.setAttributeNS(null, "viewBox", "0 0 24 24");
    cardbuttonsvg.setAttributeNS(null, "fill", "none");
    cardbuttonsvg.setAttributeNS(null, "stroke", "currentColor");
    cardbuttonsvg.setAttributeNS(null, "stroke-width", "2");

    const cardbuttoncircle = document.createElementNS(svgns, "circle");
    cardbuttoncircle.setAttributeNS(null, "cx", 12);
    cardbuttoncircle.setAttributeNS(null, "cy", 12);
    cardbuttoncircle.setAttributeNS(null, "r", 10);
    cardbuttonsvg.appendChild(cardbuttoncircle);

    const svgpath = document.createElementNS(svgns, "path");
    svgpath.setAttributeNS(
      null,
      "d",
      "M2 12h20M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    );
    svgpath.setAttributeNS(null, "fill", "currentColor");

    cardbuttonsvg.appendChild(svgpath);
    //<path d="M2 12h20M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor"></path>
    cardbutton.appendChild(cardbuttonsvg);

    const cardbuttontext = document.createElement("span");
    cardbuttontext.innerText = "Fangen";

    cardbutton.appendChild(cardbuttontext);
    cardinfo2.appendChild(cardbutton);
    card.appendChild(cardinfo2);

    return card;
  }

  #resultItemTemplate(result) {
    const resultTemplate = document.createElement("div");
    resultTemplate.name = "result-item";
    resultTemplate.className =
      "bg-white h-24 border border-gray-100 rounded-2xl shadow-md flex place-content-between";

    const resultItemHeader = document.createElement("div");
    resultItemHeader.name = "result-item-header";
    resultItemHeader.className =
      "h-24 w-120 rounded-l-2xl flex place-content-between";
    //DYNAMIC when Types availaible!!!
    resultItemHeader.classList.add(
      //result.pokemonTypen.then((value) => value[0].tailWindColor),
      "bg-green-500",
    );
    //(result.pokemonTypen[0].tailWindColor);

    const resultItemHeaderId = document.createElement("div");
    resultItemHeaderId.name = "result-item-header-id";
    resultItemHeaderId.className = "ml-4 mr-4 flex items-center";

    const pokemonid = document.createElement("p");
    pokemonid.name = "pokemon-id";
    pokemonid.className = "font-bold text-4xl text-white opacity-50";
    pokemonid.textContent = "#" + result.formattedId;
    resultItemHeaderId.appendChild(pokemonid);
    resultItemHeader.appendChild(resultItemHeaderId);

    const resultItemHeaderImage = document.createElement("div");
    resultItemHeaderImage.name = "result-item-header-image";
    resultItemHeaderImage.className =
      "w-24 h-24 flex items-center align-center";

    const pokemonImage = document.createElement("img");
    pokemonImage.name = "pokemon-image";
    pokemonImage.className = "w-20 h-20";
    //DYNAMIC when imageSrc is available!!!
    pokemonImage.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
      result.id +
      ".png";
    pokemonImage.alt = result.name;
    resultItemHeaderImage.appendChild(pokemonImage);
    resultItemHeader.appendChild(resultItemHeaderImage);

    resultTemplate.appendChild(resultItemHeader);

    const resultItemContent = document.createElement("div");
    resultItemContent.name = "result-item-content";
    resultItemContent.className = "w-full flex place-content-around";

    const pokemonDetails = document.createElement("div");
    pokemonDetails.name = "pokemon-details";
    pokemonDetails.className = "w-fit h-24 ml-5 mr-5 text-center";

    const pokemonName = document.createElement("p");
    pokemonName.name = "pokemon-name";
    pokemonName.className = "capitalize font-bold text-2xl text-slate-800 mb-2";
    pokemonName.textContent = result.name;
    pokemonDetails.appendChild(pokemonName);
    resultItemContent.appendChild(pokemonDetails);

    const pokemonTypes = document.createElement("div");
    pokemonTypes.name = "pokemon-types";

    //DYNAMIC LOOP when pokemonTypes available!!!
    const pokemonType = document.createElement("p");
    pokemonType.name = "pokemon-type";
    pokemonType.className =
      "text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase";
    // DYMANIC when pokemonTypes available!!!
    pokemonType.classList.add("bg-green-500");
    // DYMANIC  when pokemonTypes available!!!
    pokemonType.textContent = "grass";
    pokemonTypes.appendChild(pokemonType);
    // End DYNAMIC LOOP

    resultItemContent.appendChild(pokemonTypes);

    const pokemonGenerationInfo = document.createElement("div");
    pokemonGenerationInfo.name = "pokemon-generation-info";
    pokemonGenerationInfo.className = "w-fit h-24 ml-5 mr-5 text-center";

    const pokemonGenerationName = document.createElement("p");
    pokemonGenerationName.name = "pokemon-generation-name";
    pokemonGenerationName.className =
      "capitalize font-bold text-2xl text-slate-800 mb-2";
    pokemonGenerationName.textContent = result.generationName;
    pokemonGenerationInfo.appendChild(pokemonGenerationName);

    const pokemonGeneration = document.createElement("p");
    pokemonGeneration.name = "pokemon-generation";
    pokemonGeneration.className = "font-semibold text-sm text-slate-800";
    pokemonGeneration.textContent = "Generation " + result.generationId;
    pokemonGenerationInfo.appendChild(pokemonGeneration);

    resultItemContent.appendChild(pokemonGenerationInfo);

    resultTemplate.appendChild(resultItemContent);

    const resultItemButton = document.createElement("div");
    resultItemButton.name = "result-item-button";

    const buttonFangen = document.createElement("button");
    buttonFangen.name = "button-fangen";
    buttonFangen.className =
      "bg-slate-800 h-24 w-36 rounded-r-2xl text-white flex";

    const buttonFangenIcon = document.createElement("div");
    buttonFangenIcon.name = "button-fangen-icon";
    buttonFangenIcon.className = "h-24 w-16 flex items-center justify-center";

    const svgns = "http://www.w3.org/2000/svg";

    const cardbuttonsvg = document.createElementNS(svgns, "svg");
    cardbuttonsvg.name = "card-button-fangen-image";
    cardbuttonsvg.setAttributeNS(null, "class", "w-10 h-10");
    cardbuttonsvg.setAttributeNS(null, "viewBox", "0 0 24 24");
    cardbuttonsvg.setAttributeNS(null, "fill", "none");
    cardbuttonsvg.setAttributeNS(null, "stroke", "currentColor");
    cardbuttonsvg.setAttributeNS(null, "stroke-width", "2");

    const cardbuttoncircle = document.createElementNS(svgns, "circle");
    cardbuttoncircle.setAttributeNS(null, "cx", 12);
    cardbuttoncircle.setAttributeNS(null, "cy", 12);
    cardbuttoncircle.setAttributeNS(null, "r", 10);
    cardbuttonsvg.appendChild(cardbuttoncircle);

    const svgpath = document.createElementNS(svgns, "path");
    svgpath.setAttributeNS(
      null,
      "d",
      "M2 12h20M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    );
    svgpath.setAttributeNS(null, "fill", "currentColor");

    cardbuttonsvg.appendChild(svgpath);
    //<path d="M2 12h20M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="currentColor"></path>
    buttonFangenIcon.appendChild(cardbuttonsvg);

    buttonFangen.appendChild(buttonFangenIcon);

    const buttonFangenLabel = document.createElement("div");
    buttonFangenLabel.name = "button-fangen-label";
    buttonFangenLabel.className =
      "h-24 font-bold text-md text-white flex items-center";

    const buttonFangenText = document.createElement("p");
    buttonFangenText.name = "button-fangen-text";
    buttonFangenText.className = "";
    buttonFangenText.textContent = "Fangen";
    buttonFangenLabel.appendChild(buttonFangenText);

    buttonFangen.appendChild(buttonFangenLabel);

    resultItemButton.appendChild(buttonFangen);
    resultTemplate.appendChild(resultItemButton);

    return resultTemplate;
  }

  // Forward search to either complete (generationId=0) search
  // or filtered by generation search
  async #searchPokemonts(searchtext, generationId = 0) {
    return generationId == 0
      ? await this.#searchAllPokemonts(searchtext)
      : await this.#searchGenerationPokemonts(searchtext, generationId);
  }

  // complete search
  async #searchAllPokemonts(searchtext) {
    const results = this.#fetch.filter((item) =>
      String(item.name).toUpperCase().includes(searchtext.toUpperCase()),
    );
    return results;
  }

  // filtered by generation(Id) search
  async #searchGenerationPokemonts(searchtext, generationId) {
    const generationObject = this.getGenerationById(generationId);

    const results = this.#fetch.filter((item, index) => {
      if (
        generationObject[0].start <= index &&
        generationObject[0].end >= index &&
        String(item.name).toUpperCase().includes(searchtext.toUpperCase())
      ) {
        return new PokemonSearchResult(
          index,
          item.name,
          item.url,
          generationId,
          generationObject.name,
          [],
        );
      }
    });

    return results;
  }

  async #sortPokemontResults(searchtext, unsortedPokemonts) {
    const enhancedResults = this.#enhancePokemon(searchtext, unsortedPokemonts);
    return enhancedResults.sort((first, second) =>
      this.#comparePokemon(first, second),
    );
  }

  // adds search weight as property to array pokemonts
  #enhancePokemon(searchtext, pokemonts) {
    const enhandedPokemonts = pokemonts.map((pokemon) => {
      //weight searchresult
      let searchweight = searchtext.length / pokemon.name.length;

      if (searchweight < 1) {
        searchweight = String(pokemon.name)
          .toUpperCase()
          .startsWith(searchtext.toUpperCase())
          ? searchweight + 0.2
          : searchweight;
      }

      pokemon.searchWeight = searchweight;
      return pokemon;
    });

    return enhandedPokemonts;
  }

  // sort function by searchWeight compare
  #comparePokemon(first, second) {
    return first.searchWeight > second.searchWeight ? 0 : 1;
  }

  //===========================================================
  // CONSTRUCTOR
  //===========================================================

  constructor() {
    this.#initializeIndexes().then(
      (value) => (this.#fetch = this.#enhanceIndex(value.results)),
    );
    this.Index = this.#fetch;
  }

  //===========================================================
  // PUBLIC METHODS
  //===========================================================

  // Eingabe name einer Generation,
  // Rückgabe eines Genarationsobjectes (#generations)
  getGenerationByName(name) {
    return this.#generations.filter((obj) => {
      return obj.generationName === name;
    });
  }

  // Eingabe name einer Generations-Kennziffer (1-10),
  // Rückgabe eines Generationsobjectes (#generations)
  getGenerationById(id) {
    const result = this.#generations.filter((obj) => {
      return obj.generationIndex == id;
    });
    return result;
  }

  getGenerationfromPokemon(pokemonid) {
    return this.#generations.find(
      (item) => item.start <= pokemonid && item.end >= pokemonid,
    );
  }

  // Eingabe name einer Pokemon-Kennziffer (1-10),
  // Rückgabe eines Promise (card DOM object)
  async getPokamonCardById(id) {
    const internalresult = await this.#getPokemonDetail(id);
    const card = this.#cardTemplate(internalresult);

    return card;
  }

  async getPokemonTypen(url) {
    const pokemonDetails = await this.#getPokemonDetailsByUrl(url);

    const arr = [];
    for (let index = 0; index < pokemonDetails.types.length; index++) {
      const typeName = pokemonDetails.types[index].type.name;
      arr.push(new PokemonType(typeName));
    }
    return arr;
  }

  async getPokamonResultCards(searchresult) {
    let cards = [];
    searchresult.forEach((result) => {
      const receivedTypes = this.getPokemonTypen(result.apiUrl).then(
        (value) => value,
      );
      result.pokemonTypen = receivedTypes.then((x) => x);
      cards.push(this.#resultItemTemplate(result));
    });
    return cards;
  }

  // Eingabe name einer Pokemon-Id,
  // Rückgabe Promise des fetches
  async getPokamonById(id) {
    const internalresult = await this.#getPokemonDetail(id);
    const ptype = internalresult.types.map((t) => new PokemonType(t.type.name));
    const result = {
      id: internalresult.id,
      name: internalresult.name,
      //mainType: ptype[0],
      //secondaryType: ptype.length > 1 ? ptype[1] : "",
      types: ptype,
      formattedId: internalresult.id.toString().padStart(4, "0"),
      imageSrc:
        internalresult.sprites.other["official-artwork"].front_default ||
        internalresult.sprites.front_default,
    };
    return result;
  }

  // Sucht Pokemons nach eingegebenen Suchkriterien
  // searchtext: literal das in pokemonnamen vorkommt
  // listcount: maximale anzahl der pokemon suchresultate
  // generationsId: Limitierung der Suche auf pokemons einer generation
  //    - 0: generationsunabhängige suche
  //    - andere: Kennziffer der Generation
  async searchPokemonts(searchtext, listCount = 10, generationId = 0) {
    const unsortedPokemonts = await this.#searchPokemonts(
      searchtext,
      generationId,
    );

    const sortedPokemonts = await this.#sortPokemontResults(
      searchtext,
      unsortedPokemonts,
    );
    if (sortedPokemonts.length > listCount) {
      return sortedPokemonts.slice(0, listCount);
    } else {
      return sortedPokemonts;
    }
  }
}

//=============================================
// Interne Pokamon Typ Klasse
//=============================================
class PokemonType {
  // Typfarben Zuordnung
  #getTypeColor(typeName) {
    switch (typeName) {
      case "grass":
        return "bg-green-500";
      case "poison":
        return "bg-purple-500";
      case "fire":
        return "bg-orange-500";
      case "water":
        return "bg-blue-500";
      case "electric":
        return "bg-yellow-400";
      case "bug:":
        return "bg-lime-600";
      case "flying":
        return "bg-indigo-400";
      case "ground":
        return "bg-yellow-700";
      case "rock":
        return "bg-yellow-800";
      case "psychic":
        return "bg-pink-500";
      case "ice":
        return "bg-cyan-400";
      case "dragon":
        return "bg-indigo-600";
      case "fairy":
        return "bg-pink-300";
      case "ghost":
        return "bg-purple-700";
      case "steel":
        return "bg-gray-500";
      case "fighting":
        return "bg-orange-700";
      case "dark":
        return "bg-gray-800";
      case "normal":
        return "bg-gray-400";
    }
  }

  constructor(typeName) {
    this.name = typeName;
    this.tailWindColor = this.#getTypeColor(typeName);
  }
}

//=============================================
// Pokamon Search Result Klasse
//=============================================
class PokemonSearchResult {
  constructor(id, name, apiUrl, generationsId, generationsName, pokemonTypen) {
    this.id = id;
    this.name = name;
    this.apiUrl = apiUrl;
    this.generationId = generationsId;
    this.formattedId = String(id).padStart(4, "0");
    this.generationsName = generationsName;
    this.pokemonTypen = pokemonTypen;
  }
}
