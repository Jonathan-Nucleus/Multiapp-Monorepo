import React, { useContext, useEffect, PropsWithChildren } from "react";

import {
  useAccount,
  AccountData,
} from "shared/graphql/query/account/useAccount";
export type Account = AccountData["account"];

const AccountContext = React.createContext<Account | undefined>(undefined);
export function useAccountContext(): Account {
  const account = useContext(AccountContext);
  if (!account) {
    throw new Error(
      "Account context not properly initializeed, Please check to " +
        "ensure that you have included the approprate Context Provider"
    );
  }

  return account;
}

interface AccountProviderProps extends PropsWithChildren<unknown> {
  onReady?: () => void;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({
  onReady,
  children,
}) => {
  const { data: { account } = {}, loading } = useAccount({
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (account) {
      console.log("Account ready");
      onReady?.();
    }
  }, [onReady, account]);

  if (!account && loading) {
    // Return loading state
    return null;
  }

  if (!account) {
    // Return error state
    return null;
  }

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};
