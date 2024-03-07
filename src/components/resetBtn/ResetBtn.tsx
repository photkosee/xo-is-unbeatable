import { FC } from "react";
import "./resetBtn.css";

interface ResetButtonProps {
  resetBoard: () => void;
}

const ResetButton: FC<ResetButtonProps> = ({ resetBoard }) => {
  return (
    <button className="reset-btn" onClick={resetBoard}>
      Reset
    </button>
  );
};

export default ResetButton;
