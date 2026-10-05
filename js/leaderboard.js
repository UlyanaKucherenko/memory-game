
function sortResults(data) {
    return data.sort((a, b) => a.moves - b.moves);
}

function renderLeaderboardList() {
    const dataResults = JSON.parse(localStorage.getItem("leaderboardList")) || [];
    const list = document.querySelector(".dialog__list");
    list.replaceChildren();

    const sortedData = sortResults(dataResults).slice(0, 10);

    sortedData.forEach((item, i) => {
        console.log(item.date);
        const li = document.createElement("li");
        li.classList.add("dialog__item");

        const position = document.createElement("span");
        position.classList.add("dialog__item-position");
        position.textContent = `${i + 1}.`;

        const date = document.createElement("span");
        date.classList.add("dialog__item-date");
        date.textContent = item.date;

        const moves = document.createElement("span");
        moves.classList.add("dialog__item-moves");
        moves.textContent = item.moves;

        li.append(position, date, moves);
        list.appendChild(li);
    })

}

export function renderLeaderboardDialog() {
    const dialogBox = document.createElement("div");
    dialogBox.classList.add("dialog-box-shadow");
    dialogBox.id = "leaderboard-dialog";
    const dialog = document.createElement("div");
    dialog.classList.add("dialog");

    const dialogHeader = document.createElement("div");
    dialogHeader.classList.add("dialog__header");
    const dialogHeaderTitle = document.createElement("h2");
    dialogHeaderTitle.classList.add("dialog__header-title");
    dialogHeaderTitle.textContent = "Leaderboard";

    const dialogBody = document.createElement("div");
    dialogBody.classList.add("dialog__body");
    const dialogList = document.createElement("ul");
    dialogList.classList.add("dialog__list");
    const dialogListItem = document.createElement("li");
    dialogListItem.classList.add("dialog__list-item");
    dialogListItem.textContent = "no records yet";


    const dialogFooter = document.createElement("div");
    dialogFooter.classList.add("dialog__footer");
    const dialogBtnClose = document.createElement("button");
    dialogBtnClose.classList.add("dialog__btn", "secondary-btn");
    dialogBtnClose.textContent = "Close";

    dialogHeader.appendChild(dialogHeaderTitle);
    dialogList.appendChild(dialogListItem)
    dialogBody.appendChild(dialogList);
    dialogFooter.appendChild(dialogBtnClose);
    dialog.append(dialogHeader, dialogBody, dialogFooter);
    dialogBox.appendChild(dialog);
    document.body.appendChild(dialogBox);

    const closeDialog = () => dialogBox.classList.remove("open");

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

export function openLeaderboardDialog() {
    const dialogBox = document.getElementById("leaderboard-dialog");
    renderLeaderboardList();
    dialogBox.classList.add("open");
}