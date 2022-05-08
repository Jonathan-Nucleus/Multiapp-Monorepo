import { useAccount } from './index';
import { UserProfile } from '../user/useProfile';
import { useEffect, useState } from 'react';
import _ from 'lodash';

export const useCachedAccount = () => {
  const { data, loading } = useAccount({ fetchPolicy: 'cache-only' });
  const [account, setAccount] = useState<UserProfile>();
  useEffect(() => {
    if (!loading && data?.account && !_.isEqual(account, data.account)) {
      setAccount(data.account);
    }
  }, [account, data, loading]);
  return account;
};
