import { useState } from "react";
import Box from "./components/Box";

const App = () => {
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const [xPlaying, setXPlaying] = useState(true);
  const [comTurn, setComTurn] = useState(false);
  const [board, setBoard] = useState(Array(9).fill("X"));
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (board: string[]) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x, y, z] = WIN_CONDITIONS[i];

      // Iterate through win conditions and check if either player satisfies them
      if (board[x] && board[x] === board[y] && board[y] === board[z]) {
        setGameOver(true);
        return board[x];
      }
    }
  };

  const handleBoxClick = (boxIdx: number) => {
    // Step 1: Update the board
    const updatedBoard = board.map((value, idx) => {
      if (idx === boxIdx) {
        return xPlaying ? "X" : "O";
      } else {
        return value;
      }
    });

    setBoard(updatedBoard);

    // Step 2: Check if either player has won the game
    const winner = checkWinner(updatedBoard);

    if (winner) {
      if (winner === "O") {
        let { oScore } = scores;
        oScore += 1;
        setScores({ ...scores, oScore });
      } else {
        let { xScore } = scores;
        xScore += 1;
        setScores({ ...scores, xScore });
      }
    }

    // Step 3: Change active player
    setXPlaying(!xPlaying);
  };

  const resetBoard = () => {
    setGameOver(false);
    setBoard(Array(9).fill(null));
  };

  return (
    <div className="container flex flex-col gap-y-10 items-center justify-center h-screen">
      <h1 className="flex justify-center text-white gap-x-2 text-3xl font-semibold">
        XO is <p className="text-green-300">Unbeatable</p>
      </h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((type, idx) => (
          <Box key={idx} type={type} highlighted={idx % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

export default App;
