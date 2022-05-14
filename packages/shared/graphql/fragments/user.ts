import { gql } from "@apollo/client";
import { UserProfile } from "backend/graphql/users.graphql";

export type UserSummary = Pick<
  UserProfile,
  "_id" | "firstName" | "lastName" | "avatar" | "role" | "position"
>;

export const USER_SUMMARY_FRAGMENT = gql`
  fragment UserSummaryFields on UserProfile {
    _id
    firstName
    lastName
    avatar
    role
    position
  }
`;
