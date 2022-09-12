import { FC } from "react";

type VF = () => void;

interface ListTileDetailsProps {
  profileProperty: any;
  profileValue: any;
  onPressed: VF;
}

const ListTileDetails: FC<ListTileDetailsProps> = ({
  onPressed,
  profileProperty,
  profileValue,
}) => {
  const arrNotShowUpdate: string[] = [
    "Associated Companies",
    "Managed Funds",
    "Followers Count",
    "Following Count",
    "Post Count",
    "Member Since",
  ];

  const getVal = (): string => {
    if (profileValue && profileProperty.value) {
      if (typeof profileProperty.value === "function") {
        return profileProperty.value(profileValue);
      }
      return profileValue[profileProperty.value]
        ? profileValue[profileProperty.value]
        : "N/A";
    }
    return "N/A";
  };

  const showUpdateButton = (): boolean => {
    let found: boolean = false;
    arrNotShowUpdate.forEach((item: string) => {
      if (item === profileProperty.label) {
        found = true;
      }
    });
    return !found;
  };

  return (
    <div className="w-full flex flex-row justify-between items-center bg-white hover:bg-gray-50 p-4 border-b">
      <div>
        <p className="text-black">{profileProperty.label}</p>
        <p className="text-gray-600">{getVal()}</p>
      </div>
      {showUpdateButton() && (
        <button
          className="rounded-md bg-blue-500 p-3"
          type="button"
          onClick={onPressed}
        >
          <p className="text-white">Update</p>
        </button>
      )}
    </div>
  );
};

export default ListTileDetails;
