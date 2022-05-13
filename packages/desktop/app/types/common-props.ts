import { PropsWithChildren } from "react";
import { UserProfile } from "shared/graphql/query/user/useProfile";

export interface UserProfileProps extends PropsWithChildren<unknown> {
  user: UserProfile | undefined;
}

export interface DialogProps {
  show: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}
