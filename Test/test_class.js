import { PokamonUtilities } from "../modules/pokamon_utilities.js";

const utilities = new PokamonUtilities();

const input1 = document.getElementById("input1");
const button1 = document.getElementById("button1");
const output1 = document.getElementById("output1");
button1.addEventListener("click", () => button1_click());

function button1_click() {
  const input = input1.value;

  const generationObj = isNaN(input)
    ? utilities.getGenerationByName(input)[0]
    : utilities.getGenerationById(input)[0];

  if (generationObj != undefined) {
    const output = `Name=${generationObj.generationName}
  Id=${generationObj.generationIndex}
  start=${generationObj.start}
  end=${generationObj.end}`;
    output1.textContent = output;
  } else {
    output1.textContent = "";
  }
}

const input2 = document.getElementById("input2");
const button2 = document.getElementById("button2");
const output2 = document.getElementById("output2");
button2.addEventListener("click", () => button2_click());

function button2_click() {
  const input = input2.value;
  if (!isNaN(input)) {
    const pokamondetails = utilities.getPokamonById(input).then((value) => {
      const ausgabe = `
        Name:           ${value.name}
        Id:             ${value.id}
        FormattedId:    ${value.formattedId}
        Types:          ${value.types.length}
        Image Source:   ${value.imageSrc}
      `;
      output2.textContent = ausgabe;
    });
  }
}

const input3 = document.getElementById("input3");
const button3 = document.getElementById("button3");
const cardContainer = document.getElementById("card3");
button3.addEventListener("click", () => button3_click());

function button3_click() {
  const input = input3.value;
  if (!isNaN(input)) {
    const pokamondetails = utilities.getPokamonCardById(input).then((value) => {
      console.log(value);
      const lastcard = cardContainer.lastChild;
      if (lastcard != null) {
        cardContainer.removeChild(lastcard);
      }

      cardContainer.appendChild(value);
    });
  }
}

const input4 = document.getElementById("input4");
const startseek4 = document.getElementById("startseek4");
const listlength4 = document.getElementById("listlength4");
const generationchoice4 = document.getElementById("generationchoice4");
const output4 = document.getElementById("output4");

input4.addEventListener("input", () => search_pokemonts());
startseek4.addEventListener("change", () => search_pokemonts());
listlength4.addEventListener("change", () => search_pokemonts());
generationchoice4.addEventListener("change", () => search_pokemonts());

function search_pokemonts() {
  const input = input4.value;
  const mincharactercount = startseek4.value;
  const maxlistitems = listlength4.value;
  const generationselectionid = generationchoice4.value;

  //start search only, if searchtext has mor characters than defined with mincharactercount
  output4.textContent = "";
  if (input.length >= mincharactercount) {
    const result = utilities
      .searchPokemonts(input, maxlistitems, generationselectionid)
      .then((value) => {
        console.log("Value:", value);
        value.forEach((item) => {
          const outputtext = `${item.id}: ${item.name} - generation ${item.generationId}: ${item.generationsName}`;
          console.log("Item:", item);
          const itemline = document.createElement("p");
          itemline.textContent = outputtext;
          output4.appendChild(itemline);
        });
      });
  }
}
