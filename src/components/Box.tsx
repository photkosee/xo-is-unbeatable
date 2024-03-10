import { Circle, X } from "lucide-react";
import React, { FC } from "react";

interface BoxProps {
  type: "X" | "O" | "";
  highlighted: boolean;
  onClick: () => void;
}

const Box: FC<BoxProps> = ({ type, highlighted, onClick }) => {
  return (
    <div
      className={`size-[calc(100vw/5)] max-h-[120px] max-w-[120px] bg-[#1f3540] rounded-md
      flex items-center justify-center ${
        type === ""
          ? "hover:bg-[#1f3540]/70 cursor-pointer"
          : "cursor-not-allowed"
      } ${highlighted ? "bg-[#2d4d5e]" : "bg-[#1f3540]"}`}
      role="button"
      onClick={type === "" ? onClick : () => {}}
    >
      {type === "X" && <X className="text-green-400 h-2/3 w-2/3" />}
      {type === "O" && <Circle className="text-amber-500 h-2/3 w-2/3" />}
    </div>
  );
};

export default Box;
