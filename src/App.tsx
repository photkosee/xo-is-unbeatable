import { useState } from "react";
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
  const [playerTurn, setPlayerTurn] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(""));
  const [gameOver, setGameOver] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    setBoard(Array(9).fill(""));
  };

  return (
    <div className="container flex flex-col gap-y-3 lg:gap-y-5 items-center justify-center min-h-screen py-5">
      <h1 className="flex justify-center text-white gap-x-2 text-3xl font-semibold">
        XO is <p className="text-green-300">Unbeatable</p>
        <Button isIconOnly size="sm" onClick={onOpen}>
          <Info />
        </Button>
        <Button isIconOnly size="sm">
          <Github />
        </Button>
      </h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((type, idx) => (
          <Box key={idx} type={type} highlighted={idx % 2 === 0} />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-x-5 gap-y-1">
        <Button
          className="font-semibold text-xl flex items-center gap-x-1 min-w-36"
          radius="sm"
          onClick={() => setPlayerIsX(!playerIsX)}
        >
          Switch to
          {playerIsX ? (
            <p className="text-amber-500">O</p>
          ) : (
            <p className="text-green-600">X</p>
          )}
        </Button>
        <Button
          className="font-semibold text-xl min-w-36"
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
                Choosing between X or O
              </ModalHeader>
              <ModalBody>
                <p>
                  This is a tic-tac-toe game. X player will make the first move
                  follow by O player. You are assigned to be X by default but
                  you can switch it later on.
                </p>
                <p>
                  You are going to play against me, an AI. Please don't feel bad
                  if you lose since I'm Unbeatable.
                </p>
                <div className="flex justify-around gap-x-2">
                  <Button
                    className="font-bold text-3xl text-green-500 py-9"
                    variant="ghost"
                    onClick={() => {
                      setPlayerIsX(true);
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
