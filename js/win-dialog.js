export function renderWinDialog(startGame) {
    const dialogBox = document.createElement("div");
    dialogBox.classList.add("dialog-box-shadow");
    const dialog = document.createElement("div");
    dialog.classList.add("dialog");
    dialogBox.id = "win-dialog";

    const dialogHeader = document.createElement("div");
    dialogHeader.classList.add("dialog__header");
    const dialogHeaderTitle = document.createElement("h2");
    dialogHeaderTitle.classList.add("dialog__header-title");
    dialogHeaderTitle.textContent = "You won!";

    const dialogBody = document.createElement("div");
    dialogBody.classList.add("dialog__body");
    const dialogScore = document.createElement("div");
    dialogScore.classList.add("dialog__score");
    const dialogScoreLabel = document.createElement("span");
    dialogScoreLabel.classList.add("dialog__score-label");
    dialogScoreLabel.textContent = "Number of moves:";
    const dialogScoreValue = document.createElement("span");
    dialogScoreValue.classList.add("dialog__score-value");
    dialogScoreValue.textContent = "0";

    const dialogFooter = document.createElement("div");
    dialogFooter.classList.add("dialog__footer");
    const dialogBtnNew = document.createElement("button");
    dialogBtnNew.classList.add("dialog__btn", "primary-btn");
    dialogBtnNew.textContent = "New Game";
    const dialogBtnClose = document.createElement("button");
    dialogBtnClose.classList.add("dialog__btn", "secondary-btn");
    dialogBtnClose.textContent = "Close";

    dialogHeader.appendChild(dialogHeaderTitle);
    dialogScore.append(dialogScoreLabel, dialogScoreValue);
    dialogBody.appendChild(dialogScore);
    dialogFooter.append(dialogBtnNew, dialogBtnClose);
    dialog.append(dialogHeader, dialogBody, dialogFooter);
    dialogBox.appendChild(dialog);
    document.body.appendChild(dialogBox);

    const closeDialog = () => dialogBox.classList.remove("open");

    dialogBtnNew.addEventListener("click", () => {
        closeDialog();
        startGame();
    });

    dialogBtnClose.addEventListener("click", () => {
        closeDialog();
    });

    dialogBox.addEventListener("click", (e) => {
        if (e.target === dialogBox) {
            closeDialog();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === 'Escape') {
            closeDialog();
        }
    });
}

export function openWinDialog() {
    const dialogBox = document.getElementById("win-dialog");
    dialogBox.classList.add("open");
}