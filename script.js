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

// Carica punteggio da localStorage
function loadScore() {
  player1 = parseInt(localStorage.getItem("player1")) || 0;
  player2 = parseInt(localStorage.getItem("player2")) || 0;
}

// Salva punteggio su localStorage
function saveScore() {
  localStorage.setItem("player1", player1);
  localStorage.setItem("player2", player2);
}

// Aggiorna punteggio a schermo e salva
function updateScore() {
  document.querySelector("#win").textContent = `TU [ ${player1} -- ${player2} ] CPU`;
  saveScore();
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

// Giocata della CPU usando Minimax
function playCPUMove() {
  if (isGameOver) return;

  const bestMove = findBestMove();
  if (bestMove !== -1) {
    boxes[bestMove].textContent = turn;
    checkWin();
    checkDraw();
    changeTurn();
  }
}

// Algoritmo Minimax
function minimax(depth, isMaximizing) {
  const winner = getWinner();
  if (winner !== null) {
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    boxes.forEach((box) => {
      if (box.textContent === "") {
        box.textContent = "O";
        const score = minimax(depth + 1, false);
        box.textContent = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    boxes.forEach((box) => {
      if (box.textContent === "") {
        box.textContent = "X";
        const score = minimax(depth + 1, true);
        box.textContent = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

// Trova la miglior mossa possibile
function findBestMove() {
  let bestScore = -Infinity;
  let move = -1;
  boxes.forEach((box, index) => {
    if (box.textContent === "") {
      box.textContent = "O";
      const score = minimax(0, false);
      box.textContent = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  return move;
}

// Ritorna "X", "O", "Draw" o null
function getWinner() {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    const v0 = boxes[a].textContent;
    const v1 = boxes[b].textContent;
    const v2 = boxes[c].textContent;

    if (v0 && v0 === v1 && v0 === v2) {
      return v0;
    }
  }
  if ([...boxes].every((b) => b.textContent !== "")) {
    return "Draw";
  }
  return null;
}

// Inizializzazione
loadScore();
updateScore();

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
      }, 300); // CPU gioca dopo piccolo delay
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
