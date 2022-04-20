import { createContext, useContext } from "react";

export type Dispatch = (type: "reload" | undefined) => void;

const ProfileContext = createContext<{ dispatch: Dispatch } | undefined>(
  undefined
);

const useProfileDispatch = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("userProfileDispatch can not be used");
  }
  return context;
};

export { ProfileContext, useProfileDispatch };
