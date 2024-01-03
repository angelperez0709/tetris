var canvas = document.querySelector("#tetris");
var ctx = canvas.getContext("2d");
const BLOCK_SIZE = window.screen.width <= 643 ? 20 : 30;
const COLS = 10;
const ROWS = 20;
const WIDTH = BLOCK_SIZE * COLS;
const HEIGHT = BLOCK_SIZE * ROWS;
canvas.width = WIDTH;
canvas.height = HEIGHT;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
var points = 0;
var wait = false;
// board
var board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const shapes = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 0],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 0],
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
];
//piece
const piece = {
  position: { x: 4, y: 0 },
  shape: shapes[2],
};
var inverse = true;
//game loop
let dropCounter = 0;
let lastTime = 0;
var requestId = 0;
function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > 300) {
    if (checkCollision({ x: 0, y: 1 })) {
      solidifyPiece();
    } else {
      piece.position.y++;
      dropCounter = 0;
    }
  }
  document.querySelector("#points").innerHTML = points;
  draw();
  valor = false;
  window.requestAnimationFrame(update);
}
//pintar board y piezas
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value == 1) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
  if (checkLoose()) {
    window.cancelAnimationFrame(requestId);
    showModal();
    return;
  }
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillStyle = "red";
        ctx.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });
}

//comprobar colisiones
function checkCollision({ x, y }) {
  return piece.shape.find((row, yPos) => {
    return row.find((value, xPos) => {
      return (
        value !== 0 &&
        board[yPos + piece.position.y + y]?.[xPos + piece.position.x + x] != 0
      );
    });
  });
}

//fijar piezas
function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell == 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });
  piece.position.x = 4;
  piece.position.y = 0;
  piece.shape = shapes[Math.floor(Math.random() * 4)];
  removeRows();
}

//eliminar row
function removeRows() {
  const rowsToRemove = [];
  board.forEach((row, y) => {
    if (row.every((value) => value == 1)) {
      points += 100;
      rowsToRemove.push(y);
    }
  });
  rowsToRemove.forEach((y) => {
    board.splice(y, 1);
    const newRow = Array(COLS).fill(0);
    board.unshift(newRow);
  });
  document.querySelector("#points").innerHTML = points;
}
var currentX = 4;
var currentY = 0;
var numberPiece = Math.floor(Math.random() * 4);

function rotatePiece() {
  var longitud = piece.shape[0].length; //longitud arrays
  var newPosition = Array(longitud);
  newPosition.fill([]);

  for (i = 0; i < longitud; i++) {
    aux = [];
    piece.shape.forEach((row, y) => {
      row.forEach((col, x) => {
        if (i == x) {
          if (inverse) {
            aux.unshift(col);
          } else {
            aux.push(col);
          }
        }
      });
    });
    if (inverse) {
      newPosition[longitud - 1 - i] = aux;
    } else {
      newPosition[i] = aux;
    }
  }
  piece.shape = newPosition;
  inverse = !inverse;
}

function showModal() {
  document.querySelector("#finish-points").innerHTML = points;
  document.querySelector("#modal").style.visibility = "visible";
}

// Definir las formas de las piezas
//var currentPiece = pieces[numberPiece][currentPosition];
const PIECE_COLORS = [
  "cyan", // I
  "blue", // J
  "orange", // L
  "yellow", // O
  "green", // S
  "purple", // T
  "red", // Z
];

//detectar teclas
document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") {
    if (!checkCollision({ x: -1, y: 0 })) {
      piece.position.x--;
    }
  }
  if (event.key == "ArrowRight") {
    if (!checkCollision({ x: 1, y: 0 })) {
      piece.position.x++;
    }
  }
  if (event.key == "ArrowDown") {
    event.preventDefault();
    if (!checkCollision({ x: 0, y: 1 })) {
      piece.position.y++;
      points++;
    } else {
      solidifyPiece();
    }
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    rotatePiece();
    if (checkCollision({ x: 0, y: 0 })) {
      inverse = !inverse;
      rotatePiece();
    }
  }
  if (event.key == "Enter") {
    requestId = window.requestAnimationFrame(update);
  }
});

function checkLoose() {
  let loose = false;
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        if (
          board[y + piece.position.y][x + piece.position.x] != 0 &&
          board[y + piece.position.y][x + piece.position.x] != 0 &&
          y + piece.position.y < 2
        ) {
          loose = true;
          return false;
        }
      }
    });
  });
  return loose;
}

if (window.screen.width <= 643) {
  setTimeout(() => {
     requestId = window.requestAnimationFrame(update);
  }, 500);
}

var tecla1 = document.querySelector("#tecla1");
var tecla2 = document.querySelector("#tecla2");
var tecla3 = document.querySelector("#tecla3");
var tecla4 = document.querySelector("#tecla4");
tecla1.addEventListener("touchstart", () => {
  rotatePiece();
  if (checkCollision({ x: 0, y: 0 })) {
    inverse = !inverse;
    rotatePiece();
  }
});
tecla2.addEventListener("touchstart", () => {
  if (!checkCollision({ x: -1, y: 0 })) {
    piece.position.x--;
  }
});
tecla3.addEventListener("touchstart", () => {
  if (!checkCollision({ x: 0, y: 1 })) {
    piece.position.y++;
    points++;
  } else {
    solidifyPiece();
  }
});
tecla4.addEventListener("touchstart", () => {
  if (!checkCollision({ x: 1, y: 0 })) {
    piece.position.x++;
  }
});
