import { FC } from "react";

import Box from "../box/Box";
import "./board.css";

interface BoardProps {
  board: string[];
  onClick: (idx: number) => void;
}

const Board: FC<BoardProps> = ({ board, onClick }) => {
  return (
    <div className="board">
      {board.map((value, idx) => {
        return (
          <Box value={value} onClick={() => value === null && onClick(idx)} />
        );
      })}
    </div>
  );
};

export default Board;
