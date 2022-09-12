import { gql, MutationTuple, useMutation } from "@apollo/client";
import { MediaType, MediaUpload } from "backend/graphql/mutations.graphql";
import { UpdateUserInput } from "admin/app/backend/graphql/users.graphql";
import { USER_DETAILS_FRAGMENT, User } from "../fragments/user";

type UpdateUserVariables = {
  userData: UpdateUserInput;
};

type UpdateUserData = {
  updateUser: User;
};

/**
 * GraphQL mutation that update users profile in admin panel.
 * @returns   GraphQL mutation.
 */
export function useUpdateUser(): MutationTuple<
  UpdateUserData,
  UpdateUserVariables
> {
  return useMutation<UpdateUserData, UpdateUserVariables>(
    gql`
      ${USER_DETAILS_FRAGMENT}
      mutation UpdateUser($userData: UpdateUserInput!) {
        updateUser(userData: $userData) {
          ...UserDetailsFields
        }
      }
    `
  );
}

type UploadLinkVariables = {
  localFilename: string;
  type: MediaType;
  id: string;
};

type UploadLinkData = {
  uploadLink: MediaUpload | null;
};

/**
 * GraphQL mutation that upload link
 *
 * @returns   GraphQL mutation.
 */
export function useFetchUploadLink(): MutationTuple<
  UploadLinkData,
  UploadLinkVariables
> {
  return useMutation<UploadLinkData, UploadLinkVariables>(gql`
    mutation UploadLink($localFilename: String!, $type: MediaType!, $id: ID!) {
      uploadLink(localFilename: $localFilename, type: $type, id: $id) {
        remoteName
        uploadUrl
      }
    }
  `);
}
