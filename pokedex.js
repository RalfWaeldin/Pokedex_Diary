
function attachNoteField(pNotes, id) {
//  Lade gespeicherte Notizen
const notes = JSON.parse(localStorage.getItem("notes") || "{}");

// Textarea erstellen
const textarea = document.createElement("textarea");
textarea.placeholder = "Was macht dieses Pokémon besonders für dich...";
textarea.value = notes[id] || "";

// Styling kann gerne abgeändert werden :D
textarea.style.width = "100%";
textarea.style.height = "60px";
textarea.style.marginTop = "5px";

// Eingaben bei jeder Änderung speichern
textarea.addEventListener("input", () => {
    notes[id] = textarea.value;
    localStorage.setItem("notes", JSON.stringify(notes));
});

// Textarea zum Element hinzufügen
pNotes.appendChild(textarea);
}



// BEISPIEL kann auskommentiert werden oder gelöscht
// Beispiel-Karten (beliebig)
const card1 = document.createElement("div");
card1.textContent = "Karte 1";
document.body.appendChild(card1);

const card2 = document.createElement("div");
card2.textContent = "Karte 2";
document.body.appendChild(card2);
//BEISPIEL ENDE

// Das muss an jede Karte gehängt werden
// Textfeld an beide Karten anhängen
attachNoteField(card1, "karte1");
attachNoteField(card2, "karte2");