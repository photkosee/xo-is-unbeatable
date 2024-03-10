import { useEffect, useState } from "react";
import Box from "./components/Box";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Github, Info } from "lucide-react";

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
  const [playerIsX, setPlayerIsX] = useState<boolean>(true);
  const [aiStart, setAiStart] = useState<boolean>(false);
  const [board, setBoard] = useState<Array<"X" | "O" | "">>(Array(9).fill(""));
  const [winner, setWinner] = useState<"X" | "O" | "" | "T">("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    if (!playerIsX) {
      board[2] = "X";
      setBoard([...board]);
    }
  }, [aiStart]);

  const checkWinner = (currBoard: Array<"X" | "O" | "">, player: "X" | "O") => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x, y, z] = WIN_CONDITIONS[i];

      if (
        currBoard[x] === player &&
        currBoard[y] === player &&
        currBoard[z] === player
      ) {
        return true;
      }
    }

    return false;
  };

  const minimax = (
    newBoard: Array<"X" | "O" | "">,
    player: "X" | "O",
    depth: number
  ) => {
    const ai = playerIsX ? "O" : "X";
    const opponent = playerIsX ? "X" : "O";

    if (checkWinner(newBoard, opponent)) {
      return { index: 0, score: -100 - depth };
    } else if (checkWinner(newBoard, ai)) {
      return { index: 0, score: 100 + depth };
    } else if (newBoard.filter((spot) => spot === "").length === 0) {
      return { index: 0, score: 0 };
    }

    const moves: { index: number; score: number }[] = [];
    newBoard.forEach((box, idx) => {
      if (box === "") {
        const newMove: {
          index: number;
          score: number;
        } = {
          index: idx,
          score: 0,
        };

        const tmpBoard = [...newBoard];
        tmpBoard[idx] = player;

        if (player === ai) {
          const result = minimax(tmpBoard, opponent, depth + 1);
          newMove.score = result.score;
        } else {
          const result = minimax(tmpBoard, ai, depth + 1);
          newMove.score = result.score;
        }

        moves.push(newMove);
      }
    });

    let bestMove: number = 0;
    if (player === ai) {
      // maximizing ai's turn
      let bestScore = -Infinity;
      moves.forEach((move, idx) => {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = idx;
        }
      });
    } else {
      // minimizing opponent's turn
      let bestScore = Infinity;
      moves.forEach((move, idx) => {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = idx;
        }
      });
    }

    return moves[bestMove];
  };

  const playerMove = (boxIdx: number) => {
    let updatedBoard = board.map((value, idx) => {
      if (idx === boxIdx) {
        return playerIsX ? "X" : "O";
      } else {
        return value;
      }
    });
    setBoard(updatedBoard);
    if (checkWinner(updatedBoard, playerIsX ? "X" : "O")) {
      setWinner(playerIsX ? "X" : "O");
      updatedBoard = ["X", "X", "X", "X", "X", "X", "X", "X", "X"];
    }
    return updatedBoard;
  };

  const aiMove = (
    tmpBoard: Array<"X" | "O" | "">,
    newBoard: Array<"X" | "O" | "">,
    boxIdx: number
  ) => {
    const bestMove = minimax(tmpBoard, playerIsX ? "O" : "X", 0).index;
    const updatedBoard = newBoard.map((value, idx) => {
      if (idx === boxIdx) {
        return playerIsX ? "X" : "O";
      } else if (idx === bestMove) {
        return playerIsX ? "O" : "X";
      } else {
        return value;
      }
    });
    setBoard(updatedBoard);
    checkWinner(updatedBoard, playerIsX ? "O" : "X") &&
      setWinner(playerIsX ? "O" : "X");

    return updatedBoard;
  };

  const handleBoxClick = (boxIdx: number) => {
    if (winner !== "" && winner !== "T") return;
    let newBoard = playerMove(boxIdx);
    if (newBoard.filter((box) => box === "").length === 0) {
      setWinner("T");
      return;
    }
    if (!(newBoard.filter((box) => box === "X").length === 9)) {
      // AI moves
      const tmpBoard = [...newBoard];
      newBoard = aiMove(tmpBoard, newBoard, boxIdx);
    }
    if (newBoard.filter((box) => box === "").length === 0) {
      setWinner("T");
      return;
    }
  };

  const resetBoard = () => {
    setWinner("");
    setBoard(Array(9).fill(""));
    setAiStart((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-y-3 lg:gap-y-5 items-center justify-center min-h-screen py-5">
      <div className="container flex flex-col gap-y-1 items-center">
        <h1 className="flex justify-center text-white gap-x-2 text-3xl font-semibold">
          XO is <p className="text-green-300">Unbeatable</p>
          <Button isIconOnly size="sm" onClick={onOpen}>
            <Info />
          </Button>
          <a href="https://github.com/photkosee" target="_blank">
            <Button isIconOnly size="sm">
              <Github />
            </Button>
          </a>
        </h1>
        <p className="text-white text-lg flex gap-x-2">
          {winner === "X" &&
            `${
              playerIsX
                ? "You won!?  I blame my creator..."
                : "You lose :(  As always, I'm unbeatable..."
            }`}
          {winner === "O" &&
            `${
              playerIsX
                ? "You lose :(  As always, I'm unbeatable..."
                : "You won!?  I blame my creator..."
            }`}
          {winner === "T" && "It's a tie, I'm still unbeatable!"}
          {winner === "" && (
            <>
              Your turn as an
              {playerIsX ? (
                <p className="text-green-400">X</p>
              ) : (
                <p className="text-amber-500">O</p>
              )}
            </>
          )}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((type, idx) => (
          <Box
            key={idx}
            type={type}
            highlighted={idx % 2 === 0}
            onClick={() => handleBoxClick(idx)}
          />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-x-5 gap-y-1">
        <Button
          className="font-semibold text-xl flex items-center gap-x-1 min-w-36"
          radius="sm"
          onClick={() => {
            setPlayerIsX(!playerIsX);
            resetBoard();
          }}
        >
          Restart to play as an
          {playerIsX ? (
            <p className="text-amber-500">O</p>
          ) : (
            <p className="text-green-600">X</p>
          )}
        </Button>
        <Button
          className="font-semibold text-xl"
          radius="sm"
          onClick={resetBoard}
        >
          Restart
        </Button>
      </div>

      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choosing to go first or go second
              </ModalHeader>
              <ModalBody>
                <p>
                  This is a tic-tac-toe game. An X player will make the first
                  move follow by an O player. You are assigned to be X by
                  default but you can always switch it later on.
                </p>
                <p>
                  You are going to play against me, an AI. Please don't feel bad
                  if you lose since I'm Unbeatable!
                </p>
                <p>
                  Click on a GitHub icon to visit my GitHub page for more
                  projects and fun!
                </p>
                <div className="flex justify-around gap-x-2">
                  <Button
                    className="font-bold text-3xl text-green-500 py-9"
                    variant="ghost"
                    onClick={() => {
                      setPlayerIsX(true);
                      resetBoard();
                      onClose();
                    }}
                  >
                    X
                  </Button>
                  <Button
                    className="font-bold text-3xl text-amber-500 py-9"
                    variant="ghost"
                    onClick={() => {
                      setPlayerIsX(false);
                      resetBoard();
                      onClose();
                    }}
                  >
                    O
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default App;
