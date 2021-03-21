//declare pokemon
let pokemons = [
    {name:"pikachu",source:"pokemon/pikachu.png"},
    {name:"magikarp",source:"pokemon/magikarp1.png"},
    {name:"charmander",source:"pokemon/charmander.png"},
    {name:"banana man",source:"pokemon/bananaman1.png"},
]
$.getJSON("https://pokeapi.co/api/v2/pokemon",data=>{
    console.log(data)
})
//pick random pokemon 
let current_pokemon
let last_current_pokemon
let score = 0
let button_name_placeholder = "Pokemon name"

function randomizePokemon(){
    current_pokemon = Math.floor(Math.random()*pokemons.length)
    if(last_current_pokemon == current_pokemon){
        randomizePokemon()
    }else{
        last_current_pokemon = current_pokemon
        update()
    }
}
//setup
function setup(){
    randomizePokemon()
    
}

//if skip is clicked
function Skip(){
    randomizePokemon()
    document.getElementById("button_name").value = null;
}
//if guess is clickedS
function Guess(){
    let user_guess = document.getElementById("button_name").value
    if(user_guess.toUpperCase() == pokemons[current_pokemon].name.toUpperCase()){
        document.getElementById("button_name").style.backgroundColor="#6bf682"
        document.getElementById("button_name").placeholder = ""
        score++
        setTimeout(() => {
            randomizePokemon();
            document.getElementById("button_name").value = null;
            document.getElementById("button_name").style.backgroundColor ="#c4c4c4"
            document.getElementById("button_name").placeholder = button_name_placeholder
        }, 300);
    }else{
        document.getElementById("button_name").style.backgroundColor="#fba4a4"
        document.getElementById("button_name").placeholder = ""
        document.getElementById("button_name").value = null;
        setTimeout(() => {
            document.getElementById("button_name").style.backgroundColor ="#c4c4c4"
            document.getElementById("button_name").placeholder = button_name_placeholder
        }, 300);
    }

}

//update it to the page
function update(){
    document.getElementById("pokemon_pic").src = pokemons[current_pokemon].source
    document.getElementById("head_score").innerHTML = score;
    document.getElementById("scrboard_input_score").innerHTML = score;
}

//shortcut
shortcut.add("enter",()=>{
    Guess();
})

















//-----------------------------------------------------------------------------------------------











function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
    }

    const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
        comparison = 1;
    } else if (varA < varB) {
        comparison = -1;
    }
    return (
        (order === 'desc') ? (comparison * -1) : comparison
    );
    };
}

var config = {
    apiKey: "AIzaSyD9y3h3XULIoYMY635fm_2twylToIYvL6Y",
    authDomain: "pokemon-guesser-a28b9.firebaseapp.com",
    databaseURL: "https://pokemon-guesser-a28b9-default-rtdb.firebaseio.com",
    storageBucket: "pokemon-guesser-a28b9.appspot.com",
};

// Initialize Firebase
firebase.initializeApp(config);

database = firebase.database()

let name = "lars"

let firebase_scores = []

function set_scores_database(nm,scr){
    let firebase_length
    let firebase_got_length
    let ref = database.ref("score-board")
    ref.once("value",data=>{
        if(!data.val()){
            ref = database.ref("score-board/"+0)
            ref.set({name:nm,score:scr})  
            return
        }
        firebase_length = Object.keys(data.val()).length

        ref = database.ref("score-board/"+firebase_length)
        ref.set({name:nm,score:scr})  
        firebase_got_length = true
    })
    
    
}

function get_scores_database(){
    let ref = database.ref("score-board")
    let firebase_score_length
    ref.once("value",data=>{
        firebase_scores.push(data.val())
        console.log(firebase_scores[0])
        

        console.log(firebase_scores[0].sort(compareValues('score',"desc")))

        for(let s in firebase_scores[0]){
            let text_name = document.createTextNode(firebase_scores[0][s].name)
            let text_score = document.createTextNode(firebase_scores[0][s].score)

            let br = document.createElement("br")
            let div = document.createElement("div")
            div.id = "score_board_inner_element_name"
            div.appendChild(text_name)
            let name_element = document.getElementById("highscore_object_box").appendChild(div)
           
            
            div = document.createElement("div")
            div.id = "score_board_inner_element_score"
            div.appendChild(text_score)
            let score_element = document.getElementById("highscore_object_box").appendChild(div)
            document.getElementById("highscore_object_box").appendChild(br)
        }
        
    })
    //document.getElementById("highscore_object_box")+= "<h1>hei</h1>"
    

}
function addScore(){
    let name = document.getElementById("scrboard_input_name").value
    if(name == null || name == ""){
        document.getElementById("highscore_object_box2").style.backgroundColor="#fba4a4"
        setTimeout(() => {
            document.getElementById("highscore_object_box2").style.backgroundColor ="#c4c4c4"
        }, 300);
        
    }else{
        document.getElementById("highscore_object_box2").style.backgroundColor="#6bf682"
        document.getElementById("highscore_object_box2").disabled = true
        setTimeout(() => {
            document.getElementById("highscore_object_box2").style.backgroundColor ="#c4c4c4";
        }, 300);
        setTimeout(() => {
            document.getElementById("highscore_object_box2").disabled = false
        }, 20000);
        set_scores_database(name,score)
    }
}

//set_scores_database("lars",9)
setTimeout(()=>{get_scores_database()},1000);
