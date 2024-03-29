import { gql } from "@apollo/client";
import { UserProfile } from "backend/graphql/users.graphql";
import { Company } from "backend/graphql/companies.graphql";
import { Post } from "backend/graphql/posts.graphql";

export type PostSummary = Pick<
  Post,
  | "_id"
  | "body"
  | "categories"
  | "attachments"
  | "preview"
  | "audience"
  | "mentionIds"
  | "userId"
  | "likeIds"
  | "likeCount"
  | "shareIds"
  | "shareCount"
  | "commentIds"
  | "commentCount"
  | "createdAt"
  | "comments"
  | "likes"
  | "highlighted"
  | "featured"
> & {
  user?: Pick<
    UserProfile,
    "_id" | "firstName" | "lastName" | "avatar" | "position" | "role"
  > & {
    company: Pick<Company, "name">;
  };

  company?: Pick<Company, "_id" | "name" | "avatar">;
};

export type Attachment = Exclude<Post["attachments"], undefined>[number];

export const POST_SUMMARY_FRAGMENT = gql`
  fragment PostSummaryFields on Post {
    _id
    body
    categories
    audience
    attachments {
      url
      aspectRatio
      documentLink
    }
    preview {
      title
      description
      images
      favicons
      url
    }
    mentionIds
    likeIds
    likeCount
    shareIds
    shareCount
    commentIds
    commentCount
    createdAt
    highlighted
    userId
    featured
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
  }
`;
