import React, {
  useContext,
  useEffect,
  PropsWithChildren,
  useState,
} from "react";

import {
  useAccount,
  AccountData,
} from "shared/graphql/query/account/useAccount";
import _ from "lodash";

export type Account = AccountData["account"];

const AccountContext = React.createContext<Account | undefined>(undefined);

export function useAccountContext(): Account {
  const account = useContext(AccountContext);
  if (!account) {
    throw new Error(
      "Account context not properly initialized, Please check to " +
        "ensure that you have included the appropriate Context Provider"
    );
  }
  return account;
}

interface AccountProviderProps extends PropsWithChildren<unknown> {
  onReady?: () => void;
  onUnauthenticated?: () => void;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({
  onReady,
  onUnauthenticated,
  children,
}) => {
  const { account, loading } = useAccountStated();

  useEffect(() => {
    if (!loading) {
      if (account) {
        onReady?.();
      } else {
        onUnauthenticated?.();
      }
    }
  }, [account, loading]);

  if (loading) {
    return <></>;
  }

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

type AccountState = {
  account?: Account;
  loading: boolean;
};

const useAccountStated = (): AccountState => {
  const [state, setState] = useState<AccountState>({ loading: true });
  const { data, loading, error } = useAccount({
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    if (error) {
      setState({ account: undefined, loading: false });
    } else {
      if (!loading && data) {
        if (data?.account) {
          if (!_.isEqual(state.account, data.account)) {
            setState({ account: data.account, loading: false });
          }
        } else {
          setState({ account: undefined, loading: false });
        }
      }
    }
  }, [data, loading]);
  return state;
};
