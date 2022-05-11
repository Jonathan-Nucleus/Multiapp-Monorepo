import { PropsWithChildren } from "react";
import { AccountData } from "mobile/src/graphql/query/account";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";

type CompanyType = AccountData["account"]["companies"][number];

export type {
  CompanyType,
  UserProfile,
};

export interface UserProfileProps extends PropsWithChildren<unknown> {
  user: UserProfile | undefined;
}

export interface DialogProps {
  show: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}
