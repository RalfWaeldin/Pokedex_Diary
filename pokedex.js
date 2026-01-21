function attachNoteField(element, id) {
// Textfeld erstellen
const textarea = document.createElement("textarea");
textarea.placeholder = "Deine persönliche Notiz...";

// Styling gerne abändern :D
textarea.style.width = "100%";
textarea.style.height = "60px";
textarea.style.marginTop = "5px";

// Beim Erstellen gespeicherte Notiz laden
const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
textarea.value = savedNotes[id] || "";

// Bei jeder Eingabe speichern
textarea.addEventListener("input", () => {
    // Immer die aktuelle Version aus localStorage holen
    const currentNotes = JSON.parse(localStorage.getItem("notes") || "{}");
    currentNotes[id] = textarea.value; // nur diese ID updaten
    localStorage.setItem("notes", JSON.stringify(currentNotes));
});

// Textfeld zum Ziel-Element hinzufügen
element.appendChild(textarea);
}


// BEISPIEL kann auskommentiert werden oder gelöscht
// Beispiel-Karten (beliebig)
const card1 = document.createElement("div");
card1.textContent = "Karte 1";
document.body.appendChild(card1);


const card2 = document.createElement("div");
card2.textContent = "Karte 2";
document.body.appendChild(card2);


const card3 = document.createElement("div");
card3.textContent = "Karte 3";
document.body.appendChild(card3);
//BEISPIEL ENDE

// notefields anhängen
attachNoteField(card1, "karte1");
attachNoteField(card2, "karte2");
attachNoteField(card3, "karte3");
