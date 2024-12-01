var verbs = [
    ["Base form", "Past tense", "Past participle", "Translation", ""],
    ["abide", "abode", "abode", "demeurer"],
    ["awake", "awoke", "awoken", "(se) réveiller, aussi awake/awoke/awoke"],
    ["be", "was/were", "been", "être"],
    ["bear", "bore", "borne", "porter/supporter/soutenir"],
    ["beat", "beat", "beaten", "battre"],
    ["become", "became", "become", "become"],
    ["beget", "begat", "begotten", "engendrer, aussi beget/begot/begotten"],
    ["begin", "began", "begun", "commencer"],
    ["bend", "bent", "bent", "se courber, etc."],
    ["bereave", "bereft", "bereft", "déposséder/priver"],
    ["bring", "brought", "brought", "apporter"],
    ["build", "built", "built", "construire"],
    ["burn", "burnt", "burnt", "brûler"],
    ["burst", "burst", "burst", "éclater"],
    ["buy", "bought", "", "acheter"],
    ["cast", "cast", "cast", "jeter, etc."],
    ["catch", "caught", "caught", "attraper"],
    ["chide", "chid", "chidden", "gronder/réprimander, aussi chide/chid/chid"],
    ["choose", "chose", "chosen", "choisir"],
    ["cleave", "cleft", "cleft", "fendre/coller, aussi cleave/clove/clove"],
    ["cling", "clung", "clung", "se cramponner"],
    ["come", "came", "come", "venir"],
    ["cost", "cost", "cost", "coûter"],
    ["creep", "crept", "crept", "ramper/se glisser/se hérisser"],
    ["crow", "crew", "crowed", "chanter (un coq)/jubiler"],
    ["cut", "cut", "cut", "couper"],
    ["deal", "dealt", "dealt", "distribuer/traiter"],
    ["dig", "dug", "dug", "bêcher"],
    ["do", "did", "", "faire"],
    ["draw", "drew", "drawn", "tirer/dessiner"],
    ["dream", "dreamt", "dreamt", "rêver"],
    ["drink", "drank", "drunk", "boire"],
    ["drive", "drove", "driven", "conduire"],
    ["dwell", "dwelt", "dwelt", "habiter/rester"],
    ["eat", "ate", "eaten", "manger"],
    ["fall", "fell", "fallen", "tomber"],
    ["feed", "fed", "fed", "nourrir"],
    ["feel", "felt", "felt", "(se) sentir"],
    ["fight", "fought", "fought", "combattre"],
    ["find", "found", "found", "trouver"]
];

const table = document.getElementById("TableVerbs");
const thead = table.querySelector("thead");
const tbody = table.querySelector("tbody");


function loadTable(){
    const headerRow = document.createElement("tr");
    
    thead.innerHTML="";
    tbody.innerHTML="";

    verbs[0].forEach(function(header){
        const th= document.createElement("th");
        th.textContent=header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    verbs.slice(1).forEach(function(row){
        const tr=document.createElement("tr");

        row.forEach(function(cell){
            const td=document.createElement("td");
            td.textContent=cell;
            tr.appendChild(td);
        });
        //Adding buttons to the last column of the row
        const td= document.createElement("td");
        td.innerHTML=`<button onclick=editRow(this)>Edit</button>
            <button onclick=updateRow(this)>Update</button>
            <button onclick=deleteBtn(this)>delete</button>`;
        tr.appendChild(td);
       
        tbody.appendChild(tr);
    })
    // Color alternate rows
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index % 2 === 1) { // Even indices (0-based) get colored
            row.style.backgroundColor = '#ffe4c4';
        }
    });
    updateStat();
}

function fetchImages(query) {
    const apiKey = 'Qt76vsYduwc1Cie-BqoSrkQgwjLAwttMxBgSYHK6Y5A'; // Replace with your actual Unsplash API key
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const images = data.results.map(photo => photo.urls.small).slice(0, 4); // Limit to 3 images

            const imagesContainer = document.getElementById('modalImages');
            imagesContainer.innerHTML = images.map(img => `<img src="${img}" alt="${query}" style="width:200px;height:auto;">`).join('');

            // Show the modal
            document.getElementById('verbModal').style.display = "block";
        })
        .catch(error => console.error('Error:', error));
}




function fetchSynonymsAndAntonyms(verb, API_KEY) {
    return fetch(`https://api.api-ninjas.com/v1/thesaurus?word=${verb}`, {
        headers: { 'X-Api-Key': API_KEY }
    })
    .then(response => response.json())
    .then(data => {
        // Populate modal with verb details
        document.getElementById('modalVerbTitle').textContent = `Détails sur le verbe: ${verb}`;
        
        // Synonyms
        const synonymsList = document.getElementById('modalSynonyms');
        const synonyms = data.synonyms.slice(0, 4);
        synonymsList.innerHTML = synonyms.map(item => `<li>${item}</li>`).join('');

        // Antonyms
        const antonymsList = document.getElementById('modalAntonyms');
        const antonyms = data.antonyms.slice(0, 2); 
        antonymsList.innerHTML = antonyms.map(item => `<li>${item}</li>`).join('');
    })
    .catch(error => console.error('Erreur lors de la récupération des synonymes et antonymes:', error));
}

function fetchDefinitions(verb, API_KEY) {
    return fetch(`https://api.api-ninjas.com/v1/dictionary?word=${verb}`, {
        headers: { 'X-Api-Key': API_KEY } 
    })
    .then(response => response.json())
    .then(definitionData => {
        console.log('Definition Data:', definitionData); // Log the response for debugging
        const definitionsList = document.getElementById('modalDefinitions');
        if (definitionData.definition) {
            // Format the definition with line breaks and separators
            const formattedDefinition = definitionData.definition
                .replace(/--/g, '<br>--')
                .replace(/([1-5])\./g, '<br>$1.') // Only add line breaks for numbers 1 to 5
                .replace(/(\([a-z]\))/g, '<br>$1')
                .replace(/([A-Za-z]+\.\s*[a-z]+\.\s*\d+|[A-Za-z]+\s*[a-z]+\s*\d+)/g, '<br>$1'); // Add line breaks before references

            definitionsList.innerHTML = `<li>${formattedDefinition}</li>`;
        } else {
            definitionsList.innerHTML = '<li>No definitions found.</li>';
        }
    })
    .catch(error => console.error('Erreur lors de la récupération des définitions:', error));
}

function editRow(button) {
    let API_KEY = "nKCWS+FrMejm7ikBV2I87g==maR6MgpGhSeEl7M1";
    const row = button.closest("tr");
    const verb = row.cells[0].textContent;

    fetchSynonymsAndAntonyms(verb, API_KEY);
    fetchDefinitions(verb, API_KEY);
    fetchImages(verb);

    // Show the modal
    document.getElementById('verbModal').style.display = "block";
}

// Fonction pour fermer la boîte de dialogue
function closeDialog() {
    document.getElementById('verbModal').style.display = "none";
}

// Update Row
function updateRow(button) {
    const row = button.closest("tr");
    const cells = row.querySelectorAll("td"); // we are working with an array of 4 elements from here
    const rowIndex = Array.from(tbody.children).indexOf(row) + 1; // +1 because verbs[0] is header
    const newValues = [];

    cells.forEach(function(cell, index){
        if (index < cells.length - 1) { // Skip buttons column
            const input = cell.querySelector("input");
            if (input) {
                cell.textContent = input.value;
                newValues.push(input.value); 
            }
            else{
                const input = document.createElement("input");
                input.style.width="110px";
                input.style.height="10px";
                input.style.padding="3px";
                input.type = "text";
                input.value = cell.textContent;
                cell.innerHTML = "";
                cell.appendChild(input);
            }
        }
    });
    verbs[rowIndex] = newValues;
    updateStat();
}

// Delete Row
function deleteRow(button) {
    const row = button.closest("tr");
    tbody.removeChild(row);
}
const letterLinks = document.querySelector('.letter-links');
const rightPanel= document.querySelector('.right-panel');
const verbMenu = document.querySelector('.verb-menu');
const tableContainer = document.querySelector('.table-container');
const arrowButton = document.querySelector('.arrow');
const barcol = document.querySelector('.barcol');
const container = document.querySelector('.container');
const arrows = document.querySelector(".arrows");

let interchangeP=0

let reductV=0;

function interchangePanel(){
    const rightPanel = document.querySelector('.right-panel');
    if (!interchangeP) {
        container.style.flexDirection = "row-reverse";
        rightPanel.style.flexDirection = "row-reverse";
        letterLinks.style.left="15px";
        verbMenu.style.left="40px"
        if(!reductV)
            arrowButton.innerHTML = "&#9664;"; // Change arrow to "◀"
        else
            arrowButton.innerHTML = "&#9654;"; // Change arrow to "◀"
        arrowButton.style.marginLeft="-8px";
        interchangeP=1
    } else {
        container.style.flexDirection = "row";
        rightPanel.style.flexDirection = "row";
        letterLinks.style.left="55px";
        verbMenu.style.left="70px";
        if(!reductV)
            arrowButton.innerHTML = "&#9654;"; // Change arrow to "◀"
        else
            arrowButton.innerHTML = "&#9664;"; // Change arrow to "◀"
        arrowButton.style.marginLeft="-18px"; 
        interchangeP=0;
    }
}

function ReduireVolet() {


    if (!reductV) {
        //Collapse
        letterLinks.style.display = "none";
        verbMenu.style.display='none';
        rightPanel.style.width='2.5%'
        barcol.style.width="100%";
        tableContainer.style.width = "97%";
        if(!interchangeP){
            arrowButton.innerHTML = "&#9664;"; }//Change arrow to "◀"
        else{
            arrowButton.innerHTML = "&#9654;";} //Change arrow back to "▶"
        arrowButton.style.marginLeft="-8px";
        reductV=1;
    } else {
        //Expand
        letterLinks.style.display = "block";
        verbMenu.style.display='block';
        rightPanel.style.width='38.6%'
        barcol.style.width="6%";
        tableContainer.style.width = "60.6%";
        
        if(!interchangeP){
            arrowButton.innerHTML = "&#9654;";} //Change arrow back to "▶"
        else{
            arrowButton.innerHTML = "&#9664;";} //Change arrow to "◀"
        arrowButton.style.marginLeft="-18px";
        reductV=0;
    }
}

let recentSelect = 'a';
function resetRowColors() {
    const rows = document.querySelectorAll('#TableVerbs tbody tr');
    rows.forEach(row => {
        row.querySelectorAll('td').forEach((cell, index) => {
            if (index < 4) {
                cell.style.color = "black"; // Reset color to black
            }
        });
    });
}

function scrollToVerb(letter) {
    const rows = document.querySelectorAll('#TableVerbs tbody tr');
    let found = false;

    // Resetting the color of the recent selection
    if (recentSelect !== letter) {
        resetRowColors(); // Call the new function to reset colors

        rows.forEach(row => {
            const firstcell = row.cells[0].textContent;
            if (firstcell.toLowerCase().startsWith(letter) && !found) {
                row.scrollIntoView({ block: "start", inline: "nearest" });

                // Colors each cell in the selected row
                row.querySelectorAll('td').forEach((cell, index) => {
                    if (index < 4) {
                        cell.style.color = "red"; // Highlight the selected row
                    }
                });

                found = true; // Mark that we found a match
                recentSelect = letter; // Update recent selection
            }
        });
    }
}
function AddVerb(){
    const verbInput = document.getElementById("Nverb").value.trim().toLowerCase();
    
    // check if verb field is empty
    if (!verbInput) {
        alert("Le champ ne peut pas être vide !");
        return;
    }

    const newRow = document.createElement("tr");
    const cells = [];
    
    // create 4 cells for the verb forms
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement("td");
        cell.contentEditable = true;
        cells.push(cell);
    }
    
    // Set first cell to input verb
    cells[0].textContent = verbInput;
    
    // Add cells to row
    cells.forEach(cell => newRow.appendChild(cell));
    
    // Add buttons to the last cell
    const buttonCell = document.createElement("td");
    buttonCell.innerHTML = `
        <button onclick="editRow(this)">Edit</button>
        <button onclick="updateRow(this)">Update</button>
        <button onclick="deleteRow(this)">Delete</button>
    `;
    newRow.appendChild(buttonCell);

    // Get table body
    const tbody = document.querySelector("#TableVerbs tbody");
    const rows = tbody.getElementsByTagName("tr");
    
    // Find position to insert alphabetically
    let insertPosition = 0;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].textContent.toLowerCase() > verbInput) {
            break;
        }
        insertPosition++;
    }
    
    // Insert row at correct position
    if (insertPosition === rows.length) {
        tbody.appendChild(newRow);
    } else {
        tbody.insertBefore(newRow, rows[insertPosition]);
    }
    
    // Checks  first letter existance
    const firstLetter = verbInput.charAt(0);
    const existingLinks = document.querySelectorAll('.links li a');
    let linkExists = false;
    
    existingLinks.forEach(link => {
        if (link.onclick.toString().includes(`scrollToVerb('${firstLetter}')`)) {
            linkExists = true;
        }
    });
    
    // Add new letter link if it doesnt exist
    if (!linkExists) {
        const linksList = document.querySelector('.links');
        const newLink = document.createElement('li');
        newLink.innerHTML = `Here is a link to <a href="#" onclick="scrollToVerb('${firstLetter}')">verbs that start with the letter <span style="color:red;font-weight:bold;">${firstLetter}</span></a>`;
        linksList.appendChild(newLink);
    }
    
    // Add red border if any cell is empty
    const hasEmptyCell = Array.from(cells).some(cell => !cell.textContent.trim());
    if (hasEmptyCell) {
        newRow.style.border = "2px solid red";
    }
    
    // Clear input field
    document.getElementById("Nverb").value = "";

    const allRows = tbody.querySelectorAll('tr');
    allRows.forEach((row, index) => {
        row.style.backgroundColor = (index % 2 === 1) ? '#ffe4c4' : ''; // Apply color to odd index
    });
    updateStat();
}

function findVerb() {
    const searchInput = document.querySelector('.input_verb').value.trim().toLowerCase();
    const rows = document.querySelectorAll('#TableVerbs tbody tr');
    let found = false;

    rows.forEach(row => {
        const firstCell = row.cells[0].textContent.toLowerCase();
        if (firstCell === searchInput) {
            row.scrollIntoView({ block: "start", inline: "nearest" });

            // Highlight the found row
            row.querySelectorAll('td').forEach((cell, index) => {
                if (index < 4) {
                    cell.style.color = "blue"; // Highlight the found row
                }
            });

            found = true;
        } else {
            // Reset color for non-matching rows
            row.querySelectorAll('td').forEach((cell, index) => {
                if (index < 4) {
                    cell.style.color = "black";
                }
            });
        }
    });
    if (!found) {
        alert("Verb not found or does not correspond to the base form!");
    }
}
function updateStat() {
    const letterCounts = {};
    const rows = document.querySelectorAll('#TableVerbs tbody tr');

    rows.forEach(row => {
        const firstLetter = row.cells[0].textContent.charAt(0).toLowerCase();
        letterCounts[firstLetter] = (letterCounts[firstLetter] || 0) + 1;
    });

    const totalVerbs = rows.length;
    const average = (totalVerbs / 26).toFixed(2);

    let statsHTML = `${average} verbs on average per letter: `;
    for (const [letter, count] of Object.entries(letterCounts)) {
        statsHTML += `${letter} → ${count} `;
    }
    document.getElementById('statsContent').innerHTML = statsHTML;
}
loadTable(verbs);