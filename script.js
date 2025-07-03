const image = document.getElementById("pokemon_sprite");
const card = document.getElementById("card_container");
const gender = document.getElementById("gender_container");
const Alert = document.getElementById("alert_container"); 
const type = document.getElementById("type_text");
const height = document.getElementById("height_text");
const weight = document.getElementById("weight_text");
const ability = document.getElementById("ability_text");
const hiddenability = document.getElementById("hidden_ability_text");
const speed = document.getElementById("speed_value");
const total = document.getElementById("total_value");
const total_bar = document.getElementById("total_bar");
const pokemondetails = document.getElementById("pokemon_details");
const error_message = document.getElementById("error_div");

let fetchedData = null;
let audio = null;
let shinyMode = false;
let imageClickCount = 0;
let showingFront = true;
let displayFemale = false;

async function displayPokemonDetails (pokemonattribute) {  
    document.getElementById("loader_div").style.display = "block";
    document.getElementById("content_container").style.height = "auto";
    document.body.style.overflowY = "scroll";   
    card.style.display = "none";
    error_message.style.display = "none";
    document.getElementById("av_container").style.display = "flex";
    document.getElementById("info_container").style.display = "flex";
    document.getElementById("stats_div").style.display = "none";

    
    if(pokemonattribute == "") {
        error_message.style.display = "block";        
        error_message.innerText = "Enter a Pokémon name or ID!";
        document.body.style.overflowY = "scroll";   
        card.style.display = "none";
        document.getElementById("loader_div").style.display = "none";
        return;
    }
    
    try {
        const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${pokemonattribute}`);
        if(!response.ok ) {
            throw new Error("Couldn't find a Pokémon with this name! :(");
            
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
        
        let hiddenabilityraw = "None";
        let abilityarray = [];
        data.abilities.forEach (t => {
            if (t.is_hidden) {
                hiddenabilityraw = t.ability.name;
            }
            else {
                let abilityraw = t.ability.name;
                let abilityval = abilityraw.charAt(0).toUpperCase() + abilityraw.slice(1);
                abilityarray.push(abilityval);
            }     
        });
        let hiddenabilityval = hiddenabilityraw.charAt(0).toUpperCase() + hiddenabilityraw.slice(1);
        ability.innerText = abilityarray.join(", ");
        hiddenability.innerText = hiddenabilityval;
        
        if(data.sprites.front_female == null) {
            gender.style.display = "none";
        }
        else {
            gender.style.display = "block";
        }
        
        function updateStatBar(statIndex, statId, maxValue) {
            const statValue = data.stats[statIndex].base_stat;
            const percent = (statValue / maxValue) * 100;
            
            document.getElementById(`${statId}_value`).innerText = statValue;
            document.getElementById(`${statId}_bar`).style.width = `${percent}%`;
        }      
        updateStatBar(0, "hp", 255);
        updateStatBar(1, "attack", 190);  
        updateStatBar(2, "defense", 230);
        updateStatBar(3, "sp_attack", 194);
        updateStatBar(4, "sp_defense", 230);
        updateStatBar(5, "speed", 200);
        
        totalvalue = data.stats[0].base_stat +data.stats[1].base_stat + data.stats[2].base_stat + data.stats[3].base_stat + data.stats[4].base_stat + data.stats[5].base_stat;
        total.innerText = totalvalue;
        totalpercent = (totalvalue / 720) * 100;
        total_bar.style.width = `${totalpercent}%`;
    }
    catch(error) {
        error_message.style.display = "block";
        error_message.innerText = error.message;
        card.style.display = "none";
    }
    finally {
        document.getElementById("loader_div").style.display = "none";
    }
        
}

function fetchRandomPokemon() {
    let randomId = Math.floor(Math.random() * 1025);
    displayPokemonDetails(randomId);
}

function fetchData() {
    const pokemonNameInput = document.getElementById("pokemon_name").value;
    displayPokemonDetails(pokemonNameInput);
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

function switchPages(value) {
    if(!value) {
        document.getElementById("av_container").style.display = "none";
        document.getElementById("info_container").style.display = "none";
        document.getElementById("stats_div").style.display = "flex";
    }
    else {
        document.getElementById("av_container").style.display = "flex";
        document.getElementById("info_container").style.display = "flex";
        document.getElementById("stats_div").style.display = "none";
    }
}

document.getElementById("pokemon_name").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                fetchData();
            }
});

window.addEventListener("load", () => {
    setTimeout( () => {
        window.scrollTo(0,0);
    }, 10)     
    
});

