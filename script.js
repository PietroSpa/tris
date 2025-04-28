const boxes = document.querySelectorAll(".box");
let turn = "X";
let isGameOver = false;
let round = 0;
let player1 = 0;
let player2 = 0;

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function updateScore() {
  document.querySelector(
    "#win"
  ).textContent = `TU [ ${player1} -- ${player2} ] CPU`;
}

function checkWin() {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    const v0 = boxes[a].textContent;
    const v1 = boxes[b].textContent;
    const v2 = boxes[c].textContent;

    if (v0 && v0 === v1 && v0 === v2) {
      isGameOver = true;
      boxes[a].style.backgroundColor =
        boxes[b].style.backgroundColor =
        boxes[c].style.backgroundColor =
          "#08D9D6";
      boxes[a].style.color =
        boxes[b].style.color =
        boxes[c].style.color =
          "#000";

      const result = turn === "X" ? "Hai vinto!!!" : "Hai perso!!!";
      document.querySelector("#results").textContent = result;

      if (turn === "X") player1++;
      else player2++;

      updateScore();
      document.querySelector("#play-again").style.display = "inline";
      return;
    }
  }
}

function checkDraw() {
  if (!isGameOver && [...boxes].every((b) => b.textContent !== "")) {
    isGameOver = true;
    document.querySelector("#results").textContent = "Pareggio";
    document.querySelector("#play-again").style.display = "inline";
  }
}

function changeTurn() {
  turn = turn === "X" ? "O" : "X";
  document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";
}

function playCPUMove() {
  if (isGameOver) return;

  const available = [...boxes].filter((b) => b.textContent === "");
  if (available.length === 0) return;

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    const line = [boxes[a], boxes[b], boxes[c]];
    const values = line.map((box) => box.textContent);
    const emptyIndices = [a, b, c].filter((i) => boxes[i].textContent === "");

    const scoreMap = { X: 5, O: 3, "": 1 };
    const product = values.reduce((acc, val) => acc * scoreMap[val], 1);

    if (
      (product === 9 || product === 25 || product === 3) &&
      emptyIndices.length > 0
    ) {
      boxes[emptyIndices[0]].textContent = turn;
      checkWin();
      checkDraw();
      changeTurn();
      return;
    }
  }

  const randomBox = available[Math.floor(Math.random() * available.length)];
  randomBox.textContent = turn;
  checkWin();
  checkDraw();
  changeTurn();
}

boxes.forEach((box) => {
  box.textContent = "";
  box.addEventListener("click", () => {
    if (!isGameOver && box.textContent === "") {
      box.textContent = turn;
      checkWin();
      checkDraw();
      changeTurn();
      setTimeout(() => {
        if (!isGameOver) playCPUMove();
      }, 500);
    }
  });
});

document.querySelector("#play-again").addEventListener("click", () => {
  isGameOver = false;
  turn = round % 2 === 0 ? "X" : "O";
  document.querySelector(".bg").style.left = turn === "X" ? "0" : "85px";
  document.querySelector("#results").textContent = "";
  document.querySelector("#play-again").style.display = "none";

  boxes.forEach((box) => {
    box.textContent = "";
    box.style.removeProperty("background-color");
    box.style.color = "#fff";
  });

  round++;
  if (turn === "O") setTimeout(playCPUMove, 500);
});
