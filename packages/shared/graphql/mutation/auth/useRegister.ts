import { gql, MutationTuple, useMutation } from "@apollo/client";
import { User } from "backend/schemas/user";

type RegisterVariables = {
  user: User.Input;
};

type RegisterData = {
  register: string | null;
};

/**
 * GraphQL mutation that registers a new user.
 *
 * @returns   GraphQL mutation.
 */
export function useRegister(): MutationTuple<RegisterData, RegisterVariables> {
  return useMutation<RegisterData, RegisterVariables>(gql`
    mutation Register($user: UserInput!) {
      register(user: $user)
    }
  `);
}
