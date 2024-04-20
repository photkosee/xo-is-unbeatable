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
  const [turn, setTurn] = useState<number>(0);
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

  const alphabeta = (
    newBoard: Array<"X" | "O" | "">,
    currPlayer: "X" | "O",
    depth: number,
    alpha: number,
    beta: number,
    bestMove: Array<number>
  ) => {
    let bestEvaluation: number = -Infinity;
    const opponent: "X" | "O" = currPlayer === "X" ? "O" : "X";

    if (checkWinner(newBoard, opponent)) {
      return -10000 + depth;
    }

    let currMove = 0;
    newBoard.forEach((box, idx) => {
      if (box === "") {
        const tmpBoard = [...newBoard];
        currMove = idx;
        tmpBoard[currMove] = currPlayer;
        const currEvaluation: number = -alphabeta(
          tmpBoard,
          opponent,
          depth + 1,
          -beta,
          -alpha,
          bestMove
        );

        if (currEvaluation > bestEvaluation) {
          bestEvaluation = currEvaluation;
          bestMove[depth] = currMove;
          if (bestEvaluation > alpha) {
            alpha = bestEvaluation;
            if (alpha >= beta) {
              return alpha;
            }
          }
        }
      }
    });

    if (currMove === 0) {
      return 0;
    } else {
      return alpha;
    }
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
    setTurn((prev) => prev + 1);
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
    const bestMove: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    alphabeta(
      tmpBoard,
      playerIsX ? "O" : "X",
      turn,
      -Infinity,
      Infinity,
      bestMove
    );
    console.log(bestMove[turn]);
    const updatedBoard = newBoard.map((value, idx) => {
      if (idx === boxIdx) {
        return playerIsX ? "X" : "O";
      } else if (idx === bestMove[turn]) {
        return playerIsX ? "O" : "X";
      } else {
        return value;
      }
    });
    setTurn((prev) => prev + 1);
    setBoard(updatedBoard);
    checkWinner(updatedBoard, playerIsX ? "O" : "X") &&
      setWinner(playerIsX ? "O" : "X");

    return updatedBoard;
  };

  const handleBoxClick = (boxIdx: number) => {
    if (winner !== "" && winner !== "T") return;

    let newBoard = playerMove(boxIdx);
    if (newBoard.filter((box) => box === "").length === 0) {
      if (checkWinner(newBoard, playerIsX ? "X" : "O")) {
        setWinner(playerIsX ? "X" : "O");
      } else if (checkWinner(newBoard, playerIsX ? "O" : "X")) {
        setWinner(playerIsX ? "O" : "X");
      } else {
        setWinner("T");
      }
      return;
    }

    if (!(newBoard.filter((box) => box === "X").length === 9)) {
      // AI moves
      const tmpBoard = [...newBoard];
      newBoard = aiMove(tmpBoard, newBoard, boxIdx);
    }

    if (newBoard.filter((box) => box === "").length === 0) {
      if (checkWinner(newBoard, playerIsX ? "X" : "O")) {
        setWinner(playerIsX ? "X" : "O");
      } else if (checkWinner(newBoard, playerIsX ? "O" : "X")) {
        setWinner(playerIsX ? "O" : "X");
      } else {
        setWinner("T");
      }
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
          <a
            href="https://github.com/photkosee"
            target="_blank"
            className="flex h-full items-center justify-center"
          >
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
