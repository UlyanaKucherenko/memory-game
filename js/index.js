import { renderLeaderboardDialog, openLeaderboardDialog } from "./leaderboard.js";
import { renderWinDialog, openWinDialog } from "./win-dialog.js";

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let foundPairs = 0;
let moves = 0;
let flipTimer = null;

function startGame() {
    resetBoard();
    resetCounters();
    generateCards();
};

renderLayout();
renderWinDialog(startGame);
renderLeaderboardDialog();

startGame();

function resetBoard() {
    clearTimeout(flipTimer);
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function resetCounters() {
    foundPairs = 0;
    moves = 0;
    const scoreValues = document.querySelectorAll(".game-score__item-value");
    scoreValues[0].textContent = moves;
    scoreValues[1].textContent = foundPairs;
}

function saveGameResult() {
    let leaderboardList = [];
    const saveData = localStorage.getItem("leaderboardList");

    if (saveData) {
        leaderboardList = JSON.parse(saveData);
    }
    const date = new Date();
    const fullDate = date.toLocaleDateString("ru-RU");
    const scoreItem = {
        date: fullDate,
        moves: moves,
    }

    leaderboardList.push(scoreItem);
    localStorage.setItem("leaderboardList", JSON.stringify(leaderboardList));

}

function openCard(e) {
    if (lockBoard) return;

    const card = e.target.closest(".game-board__item");

    if (!card) return;
    if (card === firstCard || card.classList.contains("open")) return;

    card.classList.add("open");

    if (!firstCard) {
        firstCard = card;
        return;
    }
    secondCard = card;

    checkMatchingCards(firstCard, secondCard);
}

function checkMatchingCards(firstCard, secondCard) {
    const isMatch = firstCard.dataset.title === secondCard.dataset.title;
    const scoreValues = document.querySelectorAll(".game-score__item-value");

    if (isMatch) {
        firstCard.removeEventListener("click", openCard);
        secondCard.removeEventListener("click", openCard);
        foundPairs++;
        scoreValues[1].textContent = foundPairs;
        resetBoard();
    } else {
        lockBoard = true;
        flipTimer = setTimeout(closePairCards, 1200);
    }

    moves++;
    scoreValues[0].textContent = moves;

    if (foundPairs === 8) {
        const dialogScore = document.querySelector(".dialog__score-value");
        dialogScore.textContent = moves;
        saveGameResult()
        openWinDialog();
    }
}

function closePairCards() {
    firstCard.classList.remove("open");
    secondCard.classList.remove("open");
    resetBoard();
}

async function fetchCardsData() {
    try {
        const response = await fetch('./json/cards.json');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        return data.cards;
    }
    catch (error) {
        console.log('Error load cards list', error);
        return [];
    }

}

async function generateCards() {
    let duplicatedCards = [];
    const cardsData = await fetchCardsData();
    cardsData.forEach((item) => {
        duplicatedCards.push(item, item)
    })
    duplicatedCards.sort(() => Math.random() - 0.5);
    renderCards(duplicatedCards);
}

function renderLayout() {
    const body = document.body;
    const container = document.createElement("div");
    container.className = "container";
    const header = document.createElement("header");
    header.className = "header";
    const headerBtns = document.createElement("div");
    headerBtns.className = "header__btns";
    const headerBtn1 = document.createElement("button");
    headerBtn1.classList.add("header__btn", "primary-btn");
    headerBtn1.textContent = "New Game";
    const headerBtn2 = document.createElement("button");
    headerBtn2.classList.add("header__btn", "secondary-btn");
    headerBtn2.textContent = "Leaderboard";
    const main = document.createElement("main");
    const gameScore = document.createElement("div");
    gameScore.className = "game-score";
    const gameScoreItem1 = document.createElement("div");
    gameScoreItem1.className = "game-score__item";
    const gameScoreItem1Label = document.createElement("span");
    gameScoreItem1Label.className = "game-score__item-label";
    gameScoreItem1Label.textContent = "Moves:";
    const gameScoreItem1Value = document.createElement("span");
    gameScoreItem1Value.className = "game-score__item-value";
    gameScoreItem1Value.textContent = "0";
    const gameScoreItem2 = document.createElement("div");
    gameScoreItem2.className = "game-score__item";
    const gameScoreItem2Label = document.createElement("span");
    gameScoreItem2Label.className = "game-score__item-label";
    gameScoreItem2Label.textContent = "Found pairs:";
    const gameScoreItem2Value = document.createElement("span");
    gameScoreItem2Value.className = "game-score__item-value";
    gameScoreItem2Value.textContent = "0";
    const gameBoard = document.createElement("div");
    gameBoard.className = "game-board";
    const gameBoardList = document.createElement("ul");
    gameBoardList.className = "game-board__list";


    headerBtns.append(headerBtn1, headerBtn2);
    header.appendChild(headerBtns);
    gameScoreItem1.append(gameScoreItem1Label, gameScoreItem1Value);
    gameScoreItem2.append(gameScoreItem2Label, gameScoreItem2Value);
    gameScore.append(gameScoreItem1, gameScoreItem2);
    gameBoard.appendChild(gameBoardList);
    main.append(gameScore, gameBoard);
    container.append(header, main);
    body.appendChild(container);

    headerBtn1.addEventListener("click", startGame);
    headerBtn2.addEventListener('click', openLeaderboardDialog);

}

function renderCards(cards) {
    const listCards = document.querySelector(".game-board__list");
    listCards.replaceChildren();

    cards.forEach((card) => {
        const cardWrap = document.createElement("li");
        cardWrap.className = "game-board__item";
        cardWrap.dataset.title = card.title;

        const cardFront = document.createElement("div");
        cardFront.className = "game-board__item-card-front";
        const cardFrontImg = document.createElement("img");
        cardFrontImg.src = card.image;
        cardFrontImg.alt = card.title;

        const cardBack = document.createElement("div");
        cardBack.className = "game-board__item-card-back";
        const cardBackImg = document.createElement("img");
        cardBackImg.src = "./images/card-back.png";
        cardBackImg.alt = "card-back";



       cardFront.appendChild(cardFrontImg);
       cardBack.appendChild(cardBackImg);
       cardWrap.append(cardFront, cardBack);
       listCards.appendChild(cardWrap);

       cardWrap.addEventListener("click", openCard);
    });
}