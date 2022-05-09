import { useAccount, AccountData } from './index';
import { useEffect, useState } from 'react';
import _ from 'lodash';

type UserProfile = AccountData['account'];
export const useCachedAccount = (): UserProfile | undefined => {
  const { data, loading } = useAccount({ fetchPolicy: 'cache-only' });
  const [account, setAccount] = useState<UserProfile>();
  useEffect(() => {
    if (!loading && data?.account && !_.isEqual(account, data.account)) {
      setAccount(data.account);
    }
  }, [account, data, loading]);
  return account;
};
