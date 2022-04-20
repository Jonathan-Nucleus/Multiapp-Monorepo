type Props = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChannelInfoIcon: React.FC<Props> = ({
  isEditing,
  setIsEditing,
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: "pointer", marginLeft: "16px" }}
    onClick={() => {
      if (!isEditing) {
        setIsEditing(true);
      }
    }}
  >
    <path
      d="M13.25 5.5C13.6642 5.5 14 5.16421 14 4.75C14 4.33579 13.6642 4 13.25 4C12.8358 4 12.5 4.33579 12.5 4.75C12.5 5.16421 12.8358 5.5 13.25 5.5Z"
      fill="#9F9F9E"
      stroke="#9F9F9E"
      strokeWidth="3"
    />
    <path
      d="M13.25 13C13.6642 13 14 12.6642 14 12.25C14 11.8358 13.6642 11.5 13.25 11.5C12.8358 11.5 12.5 11.8358 12.5 12.25C12.5 12.6642 12.8358 13 13.25 13Z"
      fill="#9F9F9E"
      stroke="#9F9F9E"
      strokeWidth="3"
    />
    <path
      d="M13.25 20.5C13.6642 20.5 14 20.1642 14 19.75C14 19.3358 13.6642 19 13.25 19C12.8358 19 12.5 19.3358 12.5 19.75C12.5 20.1642 12.8358 20.5 13.25 20.5Z"
      fill="#9F9F9E"
      stroke="#9F9F9E"
      strokeWidth="3"
    />
  </svg>
);
