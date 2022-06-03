import { gql, MutationTuple, useMutation } from "@apollo/client";

type InviteUserData = {
  inviteUser: boolean;
};

type InviteUserDataVariables = {
  email: string;
};

export function useInviteUser(): MutationTuple<
  InviteUserData,
  InviteUserDataVariables
> {
  return useMutation<InviteUserData, InviteUserDataVariables>(
    gql`
      mutation Invite($email: String!) {
        inviteUser(email: $email)
      }
    `,
    {
      refetchQueries: ["Invites"],
    }
  );
}
