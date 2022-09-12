import { FC, ReactNode, useEffect, useRef } from "react";

type VF = () => void;

interface ListTileProps {
  userImage: ReactNode;
  userName: string;
  userType: string;
  onPressed: VF;
  initFocus: boolean;
}

const ListTile: FC<ListTileProps> = ({
  onPressed,
  userImage,
  userName,
  userType,
  initFocus,
}) => {
  const ref: any = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (initFocus) {
      ref.current.focus();
    }
  }, []);

  return (
    <button
      ref={ref}
      onClick={onPressed}
      className={
        "w-full flex flex-row justify-between items-center bg-white hover:bg-gray-50 focus-within focus:bg-gray-100 focus:outline-none p-4 border-b"
      }
    >
      {userImage}
      <div className="w-full flex flex-col justify-center items-start pl-2">
        <p className="text-black">{userName}</p>
        <div className="w-full flex flex-row">
          <p className="text-gray-600 text-sm">{userType}</p>
        </div>
      </div>
    </button>
  );
};

export default ListTile;
