import {
  gql,
  useQuery,
  useMutation,
  QueryResult,
  MutationTuple,
} from "@apollo/client";
import { User } from "backend/schemas/user";

type RegisterVariables = {
  user: User.Input;
};

type RegisterData = {
  register: string;
};

/**
 * GraphQL mutation that registers a new user.
 *
 * @returns   GraphQL mutation.
 */
export function useRegisterUser(): MutationTuple<
  RegisterData,
  RegisterVariables
> {
  return useMutation<RegisterData, RegisterVariables>(gql`
    mutation Register($user: UserInput!) {
      register(user: $user)
    }
  `);
}
