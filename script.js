const image = document.getElementById("pokemon_sprite");
const card = document.getElementById("card_container");
const gender = document.getElementById("gender_container");
const Alert = document.getElementById("alert_container"); 
const type = document.getElementById("type_text");
const height = document.getElementById("height_text");
const weight = document.getElementById("weight_text");
const ability = document.getElementById("ability_text");
const hiddenability = document.getElementById("hidden_ability_text");

let fetchedData = null;
let audio = null;
let shinyMode = false;
let imageClickCount = 0;
let showingFront = true;
let displayFemale = false;

async function fetchData() {
    try {
        const pokemonNameInput = document.getElementById("pokemon_name").value;
        const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${pokemonNameInput}`);
        const pokemondetails = document.getElementById("pokemon_details");

        if(!response.ok) {
            throw new Error("Couldn't find this Pokémon! :(");
        }

        const data = await response.json();
        fetchedData = data;
        card.style.display = "flex";

        const pokemonSprite = data.sprites.front_default;
        image.src = pokemonSprite;
        image.style.display = "block";
        pokemonNameraw = data.forms[0].name;
        pokemonName = pokemonNameraw.charAt(0).toUpperCase() + pokemonNameraw.slice(1);
        pokemondetails.innerText = `No. ${data.id} ${pokemonName}`;

        let typearray = data.types.map (t => {
            let typeraw = t.type.name;
            return typeraw.charAt(0).toUpperCase() + typeraw.slice(1);
        });
        type.innerText = typearray.join(", ");

        let heightval = data.height;
        let heightfeet = Math.floor( ((heightval * 10) / 2.54) / 12);
        let heightinches = Math.round( ((heightval * 10) / 2.54) % 12);
        heightinches = String(heightinches);
        heightinches = heightinches.padStart(2, "0");
        height.innerText = `${heightfeet}'${heightinches}''`;

        let weightval = data.weight;
        let weightkgraw = weightval * 0.1;
        let weightkg = weightkgraw.toFixed(1);
        let weightlbsraw = weightkg * 2.20462;
        let weightlbs = weightlbsraw.toFixed(1);
        weight.innerText = `${weightlbs} lbs (${weightkg} kg)`;

        let hiddenabilityraw = null;
        let abilityraw = null;
        data.abilities.forEach (t => {
            if (t.is_hidden) {
                hiddenabilityraw = t.ability.name;
            }
            else {
                abilityraw = t.ability.name;
            }     
        })
        let hiddenabilityval = hiddenabilityraw.charAt(0).toUpperCase() + hiddenabilityraw.slice(1);
        let abilityval = abilityraw.charAt(0).toUpperCase() + abilityraw.slice(1);
        ability.innerText = abilityval;
        hiddenability.innerText = hiddenabilityval;

        if(data.sprites.front_female == null) {
            gender.style.display = "none";
        }
        else {
            gender.style.display = "block";
        }


    }
    catch {
        console.error(Error);
    }
}

function playCry() {

    if(audio && !audio.paused) {
        return;
    }
    
    const cry = fetchedData.cries.latest;
    audio = new Audio(cry);
    audio.volume = 0.1;
    audio.play();
}

function updateSprite() {
    if (displayFemale) {
        if (shinyMode) {
            image.src = showingFront ? fetchedData.sprites.front_shiny_female : fetchedData.sprites.back_shiny_female;
        } else {
            image.src = showingFront ? fetchedData.sprites.front_female : fetchedData.sprites.back_female;
        }
    } else {
        if (shinyMode) {
            image.src = showingFront ? fetchedData.sprites.front_shiny : fetchedData.sprites.back_shiny;
        } else {
            image.src = showingFront ? fetchedData.sprites.front_default : fetchedData.sprites.back_default;
        }
    }
}

function showPrev() {
    if (fetchedData.sprites.back_default == null) {
        Alert.
        return;
    }
    showingFront = false;
    updateSprite();
}

function showNext() {
    showingFront = true;
    updateSprite();
   }


function displayMaleSprite() {
    displayFemale = false;
    updateSprite();
}


function displayFemaleSprite() {
    displayFemale = true;
    updateSprite();
}

function shinyClick() {
    imageClickCount++;
    let audioPlayed = false;

    if (imageClickCount % 3 == 0) {
        shinyMode = !shinyMode;

        if (shinyMode && !audioPlayed) {
            const audio = new Audio("media/shiny.mp3");
            audio.volume = 0.1;
            audio.play();
            audioPlayed = true;
        } 
        else {
            audioPlayed = false; 
        }
    }
    
    if (showingFront) {
        showNext();
    }
    else {
        showPrev();
    }
    
   if(shinyMode) {
    Alert.style.display = "inline-block";
    Alert.innerText = "✨SHINY!✨";
   }
   else {
    Alert.style.display = "none";
   }
}


document.querySelectorAll('.clickable_div').forEach (div => {
    const button = div.querySelector('.div_button');

    div.addEventListener('click' , (e) => {
    if (e.target!== button) {
        button.click();
    }
} )
})
