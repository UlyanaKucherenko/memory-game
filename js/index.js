let firstCard = null;
let secondCard = null;
let lockBoard = false;
let foundPairs = 0;
let moves = 0;


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
        setTimeout(closePairCards, 800);
    }

    moves++;
    scoreValues[0].textContent = moves;

}

function closePairCards() {
    firstCard.classList.remove("open");
    secondCard.classList.remove("open");
    resetBoard();
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
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

generateCards();

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


    body.appendChild(container);
    container.appendChild(header);
    header.appendChild(headerBtns);
    headerBtns.appendChild(headerBtn1);
    headerBtns.appendChild(headerBtn2);
    container.appendChild(main);
    main.appendChild(gameScore);
    gameScore.appendChild(gameScoreItem1);
    gameScoreItem1.appendChild(gameScoreItem1Label);
    gameScoreItem1.appendChild(gameScoreItem1Value);
    gameScore.appendChild(gameScoreItem2);
    gameScoreItem2.appendChild(gameScoreItem2Label);
    gameScoreItem2.appendChild(gameScoreItem2Value);
    main.appendChild(gameBoard);
    gameBoard.appendChild(gameBoardList);

}

renderLayout();

function renderCards(cards) {
    const listCards = document.querySelector(".game-board__list");
    listCards.replaceChildren();

    cards.map((card) => {
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

        listCards.appendChild(cardWrap);
        cardWrap.appendChild(cardFront);
        cardWrap.appendChild(cardBack);
        cardFront.appendChild(cardFrontImg);
        cardBack.appendChild(cardBackImg);

        cardWrap.addEventListener("click", openCard);
    });
}