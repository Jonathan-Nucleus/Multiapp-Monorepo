import { QueryHookOptions } from '@apollo/client';
import { Invitee, InvitesData, InvitesVariables, useInvites } from './index';
import { useEffect, useState } from 'react';

export const useInviteesStated = (
  options?: QueryHookOptions<InvitesData, InvitesVariables>,
) => {
  const { data, loading } = useInvites(options);
  const [state, setState] = useState<Invitee[]>();
  useEffect(() => {
    if (!loading && data?.account.invitees) {
      setState(data?.account.invitees);
    }
  }, [data, loading]);
  return state;
};
