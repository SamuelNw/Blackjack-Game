//game resource objects

let BlackjackGameRes = {
    "User": {
        "div": "user-div",
        "score-span": "user-score",
        "score": 0
    },
    "Dealer": {
        "div": "dealer-div",
        "score-span": "dealer-score",
        "score": 0
    },
    "Cards": ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"],
    "CardsMap": {
        "A": [1, 11], 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, "J": 10, "Q": 10, "K": 10
    },
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "standButtonStatus": false,
    "turnsOverStatus": false
};

let USER = BlackjackGameRes["User"];
let DEALER = BlackjackGameRes["Dealer"];

let hitSound = new Audio("./blackjack-sounds/swish.m4a");
let lossSound = new Audio("./blackjack-sounds/aww.mp3");
let winSound = new Audio("./blackjack-sounds/cash.mp3");


//grab the button ids and assign functions to them
//hit button:
document.getElementById("blackjack-hit-button").addEventListener("click", blackjackHit);
//stand button
document.getElementById("blackjack-stand-button").addEventListener("click", blackjackStand);
//deal button
document.getElementById("blackjack-deal-button").addEventListener("click", blackjackDeal);


function blackjackHit() {
    if(BlackjackGameRes["standButtonStatus"] === false) {
        let card = randomCard();
        //showCard function
        showCard(card, USER);
        //updateScore function
        updateScore(card, USER);
    }
}

function randomCard() {
    let cardList = BlackjackGameRes["Cards"];

    return (
        cardList[Math.floor(Math.random() * 13)]
    );
};

function showCard(card, activePlayer) {
    if (activePlayer["score"] < 21) {           //ensuring that once the score is past 21, no more cards are displayed
        let playerDiv = document.getElementById(`${activePlayer["div"]}`);
        let cardImg = document.createElement("img");
        cardImg.src = `./card-images/${card}.jpg`;

        playerDiv.appendChild(cardImg);
        hitSound.play();
    };
};

function updateScore(card, activePlayer) {
    let scoreSpan = document.getElementById(`${activePlayer["score-span"]}`)

    if (card === "A") {
        if (activePlayer["score"] + BlackjackGameRes["CardsMap"][card][1] > 21) {
            activePlayer["score"] += BlackjackGameRes["CardsMap"][card][0];
        } else {
            activePlayer["score"] += BlackjackGameRes["CardsMap"][card][1];
        }
    } else {
        activePlayer["score"] += BlackjackGameRes["CardsMap"][card];
    };
        
    if (activePlayer["score"] <= 21) {
        scoreSpan.textContent = activePlayer["score"];
    } else {
        document.getElementById(`${activePlayer["score-span"]}`).textContent = "BUST!";
        document.getElementById(`${activePlayer["score-span"]}`).style = "color: red;";
    }
};

function computeWinner () {
    let winner;

    if (USER["score"] > 21) {
        if (DEALER["score"] <= 21) {
            winner = DEALER;
            lossSound.play();
        } else {
            winner = null;
        }
    } else if (USER["score"] <= 21) {
        if (DEALER["score"] > 21) {
            winner = USER;
            winSound.play();
        } else if (DEALER["score"] < 21 && DEALER["score"] > USER["score"]) {
            winner=DEALER;
            lossSound.play();
        } else if (USER["score"] === DEALER["score"]){
            winner = null;
        } else {
            winner = USER;
            winSound.play();
        }
    }

    return winner;
};

function showResult(gameWinner) {
    if (gameWinner === USER) {
        document.getElementById("game-status").textContent = "You won!✨✨";
        document.getElementById("game-status").style = "color: green;";
        //update the game resource database
        BlackjackGameRes["wins"] += 1;
        //update the table
        document.getElementById("blackjack-wins").textContent = BlackjackGameRes["wins"];

    } else if (gameWinner === DEALER) {
        document.getElementById("game-status").textContent = "You Lost!😥😥";
        document.getElementById("game-status").style = "color: red;";
        //update the game resource database
        BlackjackGameRes["losses"] += 1;
        document.getElementById("blackjack-losses").textContent = BlackjackGameRes["losses"];

    } else if (gameWinner === null) {
        document.getElementById("game-status").textContent = "You Drew.😐";
        document.getElementById("game-status").style = "color: yellow;";
        //update the game database
        BlackjackGameRes["draws"] += 1;
        document.getElementById("blackjack-draws").textContent = BlackjackGameRes["draws"];
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

async function blackjackStand() {
    //change the standButtonStatus to true before anything else
    BlackjackGameRes["standButtonStatus"] = true;

    while(DEALER["score"] < 15) {           //suggested a 15 for the bot, if its score hits 15 it shouldnt hit again
        let card = randomCard();
        //showCard function
        showCard(card, DEALER);
        //updateScore function
        updateScore(card, DEALER);
        await sleep(1000);
    }
        //set the turns over status to true
        BlackjackGameRes["turnsOverStatus"] = true;

        let winner = computeWinner();
        showResult(winner);
        
};

function blackjackDeal() {
    //only runs if all players turns are over
    if(BlackjackGameRes["turnsOverStatus"] === true) {
        //grab all images into arrays respectively
        let userDivImages = document.getElementById("user-div").querySelectorAll("img")
        let dealerDivImages = document.getElementById("dealer-div").querySelectorAll("img");

        //loop through while removing the images
        for (let i=0; i < userDivImages.length; i++) {
            userDivImages[i].remove();
        }

        for (let i=0; i < dealerDivImages.length; i++) {
            dealerDivImages[i].remove();
        };

        //reset the score-span to 0 and the color to white
        USER["score"] = 0;
        DEALER["score"] = 0;

        document.getElementById("user-score").textContent = USER["score"];
        document.getElementById("user-score").style = "color: white;";

        document.getElementById("dealer-score").textContent = DEALER["score"];
        document.getElementById("dealer-score").style = "color: white;";

        //restore game status back to original
        document.getElementById("game-status").textContent = "Let's Play";
        document.getElementById("game-status").style = "color: black;";

        //reset the statecontrols
        BlackjackGameRes["standButtonStatus"] = false;
        BlackjackGameRes["turnsOverStatus"] = false;
    }

};
