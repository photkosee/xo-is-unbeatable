import { FC } from "react";
import "./box.css";

interface BoxProps {
  value: string;
  onClick: () => void;
}

const Box: FC<BoxProps> = ({ value, onClick }) => {
  const style = value === "X" ? "box x" : "box o";

  return (
    <button className={style} onClick={onClick}>
      {value}
    </button>
  );
};

export default Box;
