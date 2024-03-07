const optimalMove = () => {
  let bestScore = -Infinity;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
        board[i][j] = "";
      }
    }
  }

  let move = random(available);
  board[move.i][move.j] = ai;
  currentPlayer = human;
};

const minimax = (board) => {
  return 1;
};
