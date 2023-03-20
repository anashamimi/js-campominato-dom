/*
Consegna
Copiamo la griglia fatta ieri nella nuova repo e aggiungiamo la logica del gioco (attenzione: non bisogna copiare tutta la cartella dell'esercizio ma solo l'index.html, e le cartelle js/ css/ con i relativi script e fogli di stile, per evitare problemi con l'inizializzazione di git).
Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe. Attenzione: nella stessa cella può essere posizionata al massimo una bomba, perciò nell’array delle bombe non potranno esserci due numeri uguali.
In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina. Altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
La partita termina quando il giocatore clicca su una bomba o quando raggiunge il numero massimo possibile di numeri consentiti (ovvero quando ha rivelato tutte le celle che non sono bombe).
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba.
BONUS:
Aggiungere una select accanto al bottone di generazione, che fornisca una scelta tra tre diversi livelli di difficoltà:
- difficoltà 1 ⇒ 100 caselle, con un numero compreso tra 1 e 100, divise in 10 caselle per 10 righe;
- difficoltà 2 ⇒ 81 caselle, con un numero compreso tra 1 e 81, divise in 9 caselle per 9 righe;
- difficoltà 3 ⇒ 49 caselle, con un numero compreso tra 1 e 49, divise in 7 caselle per 7 righe;
Superbonus 1
Quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle.
Superbonus 2
Quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste.
*/

const levelForm = document.getElementById('levelForm');
levelForm.addEventListener('submit', play);

const bombSound = document.getElementById('bombSound');
const playSound = document.getElementById('playSound');

//Funzione per disegnare la cella
function drawSquare(index, numSquares) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.width = `calc(100% / ${numSquares})`;
    square.style.height = square.style.width;
    square.innerHTML = `<span>${index}</span>`;
    return square;
}


//Funzione per generare l'array delle bombe
function generateBombs(bombnum, numsquares) {
    const bombs = [];
    while (bombs.length < 16) {
        const bomb = getRndNumber(1, numsquares);  
        if(!bombs.includes(bomb)) {
            bombs.push(bomb); 
        }          
    }
    return bombs;
}


//Funzione per mostrare tutte le mine dopo che si perde
function showMines(bombs) {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
      if (bombs.includes(parseInt(square.innerText))) {
        square.classList.add('mine');
      }
    });
  }

function play(e) {
    e.preventDefault();
    playSound.play();
    playSound.loop = true; // imposta la riproduzione in loop

    const playground = document.getElementById('playground');
    playground.classList.remove('d-none');
    playground.innerHTML = '';
    const NUM_BOMBS = 16;
    const score = document.getElementById('score');
    let risultato = 0;
    let gameOver = false;

    //Prendo il livello
    const level = document.getElementById('level').value;
    console.log(level);
    
    //Imposto il numero di celle a seconda del livello
    let squareNumbers;

    switch (level) {
        case 'easy':
            squareNumbers = 100;
            break;
        case 'medium':
            squareNumbers = 81;
            break;
        case 'hard':
            squareNumbers = 49;
            break;
    };
    console.log(squareNumbers);

    //determino il numero di celle per lato
    let squareperRow = Math.sqrt(squareNumbers);
    console.log(squareperRow);

    const bombs = generateBombs(NUM_BOMBS, squareNumbers);
    console.log(bombs);

    //ciclo per il numero di celle genero cella
    for (let i = 1; i <= squareNumbers; i++) {
        const square = drawSquare(i, squareperRow);
        let maxScore = risultato - NUM_BOMBS;

        square.addEventListener('click', function clickHandler() {

            if (gameOver) return; // blocca il gioco se gameOver è true
            
            if (bombs.includes(i)) {
                square.classList.add('mine');
                
                // blocca il gioco
                const block = document.querySelectorAll('.square');
                block.forEach(square => square.removeEventListener('click', clickHandler));
                
                gameOver = true;        

                // mostra tutte le mine
                showMines(bombs); 
                score.innerHTML = `BOOOM!! Hai totalizzato ${risultato} punti`;  

                // riproduci il suono della bomba
                bombSound.play(); 

                // ferma la riproduzione del file audio e lo imposta a 0
                playSound.pause(); 
                playSound.currentTime = 0;                    
            
            } else {
                square.classList.add('safe');                 
                risultato ++;

                if (risultato === maxScore) {
                    score.innerHTML = `Congratulazione hai ottenuto il punteggio massimo. Come hai fatto :O`;
                } else{
                    score.innerHTML = `<br>Il tuo punteggio è ${risultato}`;
                }
            }

            
        
            // non permette di selezionare più di una volta lo stesso quadrato
            square.removeEventListener('click', clickHandler);
        });

        playground.appendChild(square);
    }
    
}
