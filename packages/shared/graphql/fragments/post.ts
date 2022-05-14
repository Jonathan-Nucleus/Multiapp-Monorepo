import { gql } from "@apollo/client";
import { UserProfile } from "backend/graphql/users.graphql";
import { Company } from "backend/graphql/companies.graphql";
import { Post } from "backend/graphql/posts.graphql";

export type PostSummary = Pick<
  Post,
  | "_id"
  | "body"
  | "categories"
  | "mediaUrl"
  | "audience"
  | "mentionIds"
  | "userId"
  | "likeIds"
  | "shareIds"
  | "commentIds"
  | "createdAt"
  | "comments"
  | "likes"
> & {
  user?: Pick<
    UserProfile,
    "_id" | "firstName" | "lastName" | "avatar" | "position" | "role"
  > & {
    company: Pick<Company, "name">;
  };

  company?: Pick<Company, "_id" | "name" | "avatar">;
};

export const POST_SUMMARY_FRAGMENT = gql`
  fragment PostSummaryFields on Post {
    _id
    body
    categories
    mediaUrl
    mentionIds
    likeIds
    shareIds
    commentIds
    createdAt
    userId
    user {
      _id
      firstName
      lastName
      avatar
      position
      role
      company {
        name
      }
    }
    company {
      _id
      name
      avatar
    }
    likes {
      _id
      firstName
      lastName
      avatar
      position
      role
      company {
        _id
        name
        avatar
      }
    }
    comments {
      _id
      body
      createdAt
      likeIds
      commentId
      mentions {
        _id
        firstName
        lastName
        avatar
        role
        position
      }
      user {
        _id
        firstName
        lastName
        avatar
        role
        position
      }
    }
  }
`;
