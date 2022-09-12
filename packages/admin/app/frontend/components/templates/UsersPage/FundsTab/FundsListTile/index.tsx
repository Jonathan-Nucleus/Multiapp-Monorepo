import { FC, ReactNode } from "react";

type VF = () => void;

interface ListTileProps {
  fund: any;
  onPressed: VF;
  fundInfo: ReactNode;
}

const FundsListTile: FC<ListTileProps> = ({ onPressed, fund, fundInfo }) => {
  return (
    <button
      onClick={onPressed}
      className="h-20 w-full flex flex-row justify-between items-center bg-white hover:bg-gray-50 p-4 border-b"
    >
      <div
        className="flex justify-center items-center bg-gray-100 rounded-full text uppercase text-primary font-bold"
        style={{ width: `110px`, height: `50px` }}
      >
        {fund.name[0]}
      </div>
      <div className="w-full flex flex-col justify-center items-start pl-2">
        <p className="text-black">{fund.name}</p>
        <div className="w-full flex flex-row">
          <p className="text-gray-600 text-sm">{fund.manager.company.name}</p>
        </div>
      </div>
      <div className="w-full flex flex-col items-end pr-6">{fundInfo}</div>
    </button>
  );
};

export default FundsListTile;
