import { FC } from "react";

interface Props {
  onReset: () => void;
}

export const ResetButton: FC<Props> = ({ onReset }) => {
  return (
    <button
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
      onClick={onReset}
    >
      Reset Chat
    </button>
  );
};
