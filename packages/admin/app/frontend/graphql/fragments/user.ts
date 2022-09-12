import { gql } from "@apollo/client";
import { Company } from "admin/app/backend/graphql/companies.graphql";
import { Comment as CommentEntity } from "admin/app/backend/graphql/comments.graphql";
import { Post as PostEntity } from "admin/app/backend/graphql/posts.graphql";
import { User as UserEntity } from "admin/app/backend/graphql/users.graphql";

export type UserSummary = Pick<
  UserEntity,
  "_id" | "firstName" | "lastName" | "avatar" | "role"
>;

export const USER_SUMMARY_FRAGMENT = gql`
  fragment UserSummaryFields on User {
    _id
    firstName
    lastName
    avatar
    role
  }
`;

export type User = Pick<
  UserEntity,
  | "_id"
  | "firstName"
  | "lastName"
  | "email"
  | "accreditation"
  | "avatar"
  | "background"
  | "role"
  | "position"
  | "tagline"
  | "overview"
  | "website"
  | "linkedIn"
  | "twitter"
  | "followerCount"
  | "followingCount"
  | "postCount"
  | "createdAt"
> & {
  company?: Pick<Company, "name">;
  companies: Pick<Company, "name">[];
  managedFunds: Pick<UserEntity["managedFunds"][number], "name">[];
};

export const USER_DETAILS_FRAGMENT = gql`
  fragment UserDetailsFields on User {
    _id
    firstName
    lastName
    email
    accreditation
    company {
      name
    }
    companies {
      name
    }
    managedFunds {
      name
    }
    background {
      url
      x
      y
      width
      height
      scale
    }
    avatar
    role
    position
    tagline
    twitter
    linkedIn
    website
    overview
    followingCount
    followerCount
    postCount
    createdAt
  }
`;

export type Post = Pick<
  PostEntity,
  "_id" | "body" | "createdAt" | "disableComments"
> & {
  user?: Pick<UserEntity, "firstName" | "lastName">;
  __typename: "Post";
};

export type Comment = Pick<CommentEntity, "_id" | "body" | "createdAt"> & {
  user: Pick<UserEntity, "firstName" | "lastName">;
  __typename: "Comment";
};

export type UserActivity = Pick<UserEntity, "_id"> & {
  posts: Post[];
  comments: Comment[];
};

export function isPost(activity: Post | Comment): activity is Post {
  return activity.__typename === "Post";
}

export const USER_ACTIVITY_FRAGMENT = gql`
  fragment UserActivityDataFields on User {
    _id
    comments {
      _id
      __typename
      body
      createdAt
      user {
        firstName
        lastName
      }
    }
    posts {
      _id
      __typename
      body
      createdAt
      user {
        firstName
        lastName
      }
      disableComments
    }
  }
`;
