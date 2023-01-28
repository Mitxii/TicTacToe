/* Variables */
let c = [9];                                                        // Array per guardar cada una de les caselles del taulell
let restartButton = document.getElementById("restart");             // Variable del botó que reinicia el joc
let player = 1;                                                     // Variable que indica el torn del jugador (1-->player1 ; 2-->player2)
let winnerMessage = document.getElementById("victory");             // Variable que indicarà el guanyador
let pointsPlayer1 = document.getElementById("pointsP1");            // Variable que mostra per pantalla els punts del player1
let pointsPlayer2 = document.getElementById("pointsP2");            // Variable que mostra per pantalla els punts del player2
let pointsP1 = parseInt(pointsPlayer1.innerHTML);                   // Variable que indica els punts del player1
let pointsP2 = parseInt(pointsPlayer2.innerHTML);                   // Variable que indica els punts del player2
let displayNewGame = document.getElementById("display-newgame");    // Variable que mostra per pantalla el botó de nova de partida
let newGame = document.getElementById("newgame");                   // variable del botó que reinicia la partida peró no el joc
let count = 0;                                                      // Variable per controlar el empat
let click = true;                                                   // Variable que indica el permís de click sobre les caselles
let statsP1 = document.getElementById("player1");                   // Variable que fa referència a les estadístiques per pantalla del player1
let statsP2 = document.getElementById("player2");                   // Variable que fa referència a les estadístiques per pantalla del player1

/* Cargar cada una de les caselles del taulell */
for (let i = 0; i < 9; i++) {
    c[i] = document.getElementById(i+1);
}

/* Controlador principal del joc (main) */
for (let key in c) {
    c[key].addEventListener("click", () => {
        if (!c[key].style.backgroundImage.includes("url") && click) {           // Si la casella està buida...
            switch (player) {
                case 1:                                                             // Si es torn player1...              
                    c[key].style.backgroundImage = "url(media/creu.png)";               // Poso una creu
                    count++;                                                            // Incremento el contador
                    break;
                case 2:                                                             // Si es torn player2...
                    c[key].style.backgroundImage = "url(media/cercle.webp)";            // Poso un cercle
                    count++;                                                            // Incremento el contador
            }
            if (hasWon(key)) {                  // Si ha guanyat algú...
                gameFinished(false, key);               // S'acaba la partida indicant el guanyador
            } else if (count == 9) {            // Si han empatat...
                gameFinished(true, key);                // S'acaba la partida indicant empat
            } else {                            // Si no...
                switch (player) {                   
                    case 1:                         // Si era player1...
                        player = 2;                     // Dono torn al player2
                        break;      
                    case 2:                         // Si era player2...
                        player = 1;                     // Dono torn al player1
                }
            }
        }
    })
}

/* Reiniciar la partida */
newGame.addEventListener("click", () => {
    updatePanel();          //Reinicio el taulell
    updateCrown();          // Actualitzo la corona
});

/* Reiniciar el joc */
restartButton.addEventListener("click", () => {
    updatePanel();          // Reinicio el taulell
    pointsP1 = 0;           // Punts del player1 = 0
    pointsP2 = 0;           // Punts del player2 = 0
    updatePoints();         // Reinicio puntuacions de pantalla
    updateCrown();          // Elimino la corona
})

/**
 * Funció que acaba la partida. Si s'empata mostra missatge de 'DRAW', si no, mostra el guanyador
 */
function gameFinished(draw, pos) {
    if (draw) {                                     // Si han empatat...
        winnerMessage.innerHTML = "Draw!";
    } else {                                        // Si no han empatat...
        switch (player) {
            case 1:                                     // Si ha guanyat el player1...
                pointsP1++;                                 // Incremento la seva puntuació
                break;
            case 2:                                     // Si ha guanyat el player2...               
                pointsP2++;                                 // Incremento la seva puntuació
        }
        winnerMessage.innerHTML = `Player ${player} won!`;
        updatePoints();                             // Actualitzo el punts per pantalla
    }
    player = 0;                                     // Reinicio el torn
    winnerMessage.style.display = "block";          // Mostro el missatge de guanyador o empat
    displayNewGame.style.display = "block";         // Mostro el botó per començar una nova partida
    click = false;                                  // Denego el permis de click
}

/**
 * Funció que reinicia el tauller posant totes les caselles en blanc, indicant torn del player1 i eliminant tant missatge de victoria com botó de reinici de partida
 */
function updatePanel() {
    let child;
    player = 1;                                             // Torn del player1
    for (let i = 0; i < c.length; i++) {                    // Per cada casella...
        child = document.getElementById("winning-cell");
        c[i].style.backgroundImage = "";                        // Elimino la creu o el cercle
        if(!c[i].childElementCount < 1) {                       // Si està pintada...
            c[i].removeChild(child);                                // La poso blanca de nou
        }
    }
    winnerMessage.style.display = "none";       // Esborro el missatge del guanyador
    displayNewGame.style.display = "none";      // Esborro el botó de reinici de partida
    count = 0;                                  // Inicialitzo el contador
    click = true;                               // Permeto el click
}

/**
 * Funció que actualitza els punts (partides guanyades) de cada jugador
 */
function updatePoints() {
    pointsPlayer1.innerHTML = `${pointsP1}`;        // Actualitzo punts player1
    pointsPlayer2.innerHTML = `${pointsP2}`;        // Actualitzo punts plater2
}

/**
 * Funció que comprova si amb el últim moviment ha guanyat algú
 * @param {*} key última casella jugada
 */
function hasWon(key) {
    key = parseInt(key);

    if (key == 0 || key == 4 || key == 8) {                 // Comprovo diagonal 1
        if (isCombination(0, 4, 8)) return true;
    }
    
    if (key == 2 || key == 4 || key == 6) {                 // Comprovo diagonal 2
        if (isCombination(2, 4, 6)) return true;
    }
    
    if (key >= 0 && key <= 2) {                             // Comprovo files
        if (isCombination(0, 1, 2)) return true;
    } else if (key >= 3 && key <= 5) {
        if (isCombination(3, 4, 5)) return true;
    } else if (key >= 6 && key <= 8) {
        if (isCombination(6, 7, 8)) return true;
    }
    
    if (key == 0 || key == 3 || key == 6) {                 // Comprovo columnes
        if (isCombination(0, 3, 6)) return true;
    } else if (key == 1 || key == 4 || key == 7) {
        if (isCombination(1, 4, 7)) return true;
    } else if (key == 2 || key == 5 || key == 8) {
        if (isCombination(2, 5, 8)) return true;
    }

    return false;
}

/**
 * Funció que comprova si hi ha combinació en 3 caselles, i si n'hi ha, les pinte
 * @param {*} vars Les tres caselles que volem comprovar (es guarden en un array, vars[])
 * @returns boolean
 */
function isCombination(...vars) {
    if(c[vars[0]].style.backgroundImage.includes("url") && c[vars[1]].style.backgroundImage.includes("url") && c[vars[2]].style.backgroundImage.includes("url")) {
        if (c[vars[0]].style.backgroundImage == c[vars[1]].style.backgroundImage && c[vars[1]].style.backgroundImage == c[vars[2]].style.backgroundImage) {
            for(let i in vars) {
                let win = document.createElement("div");        // Creo un nou 'div'
                win.setAttribute("id", "winning-cell");         // Li afegeixo el id 'winning-cell'
                c[vars[i]].appendChild(win);                    // Afegeixo el 'div' a la casella pertinent
            }
            return true;
        } else return false;
    }
}

/**
 * Funció que actualitza el estat de la corona en funció del guanyador
 */
function updateCrown() {
    statsP1.classList.remove("corona");                                 // Si el player1 té corona la elimino
    statsP2.classList.remove("corona");                                 // Si el player2 té corona la elimino
    if (pointsP1 > pointsP2) statsP1.classList.add("corona");           // Si el player1 té més punts li poso la corona
    else if (pointsP2 > pointsP1) statsP2.classList.add("corona");      // Si el player2 té més punts li poso la corona
}