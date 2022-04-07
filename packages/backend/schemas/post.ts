import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "backend/lib/mongo-helper";

import { User, AccreditationOptions } from "./user";
import type { Comment } from "./comment";

export namespace Post {
  export interface Mongo {
    _id: ObjectId;
    userId: ObjectId;
    audience: Audience;
    body?: string;
    mediaUrl?: string;
    mentionIds?: ObjectId[];
    categories: PostCategory[];
    likeIds?: ObjectId[];
    commentIds?: ObjectId[];
    visible: boolean;
    reporterIds?: ObjectId[];
    updatedAt?: Date;
  }

  export type GraphQL = GraphQLEntity<Mongo> & {
    user: User.GraphQL;
    mentions: User.GraphQL[];
    likes: User.GraphQL[];
    comments: Comment.GraphQL[];
    reporters: User.GraphQL[];
  };

  export type Input = Pick<
    GraphQL,
    "audience" | "body" | "mediaUrl" | "categories" | "mentionIds"
  >;
}

/** Enumeration describing the audience targeted by a post. */
const { NONE: ignored, ...relevantAccrediationOptions } = AccreditationOptions;
export const AudienceOptions = {
  EVERYONE: "everyone",
  ...relevantAccrediationOptions,
} as const;
export type Audience = ValueOf<typeof AudienceOptions>;

/** Enumeration describing the possible cateogories of a post. */
export const PostCategoryOptions = {
  NEWS: "news",
  POLITICS: "politics",
  IDEAS: "ideas",
  EDUCATION: "education",
  QUESTIONS: "questions",
  TECH: "tech",
  CONSUMER: "consumer",
  INDUSTRIALS: "industrials",
  HEALTHCARE: "healthcare",
  FINANCIALS: "financials",
  ENERGY: "energy",
  CRYPTO: "crypto",
} as const;
export type PostCategory = ValueOf<typeof PostCategoryOptions>;
export type PostCategoryEnum = keyof typeof PostCategoryOptions;

export const PostSchema = `
  type Post {
    _id: ID!
    userId: ID!
    audience: Audience!
    body: String
    mediaUrl: String
    mentionIds: [ID!]
    categories: [PostCategory!]!
    likeIds: [ID!]
    commentIds: [ID!]
    visible: Boolean!
    reporterIds: [ID!]
    createdAt: Date!
    updatedAt: Date

    user: User!
    mentions: [User!]!
    likes: [User!]!
    comments: [Comment!]!
    reporters: [User!]!
  }

  input PostInput {
    audience: Audience!
    body: String
    mediaUrl: String
    categories: [PostCategory!]!
    mentionIds: [ID!]
  }

  enum Audience {
    ${Object.keys(AudienceOptions).map((key) => key)}
  }

  enum PostCategory {
    ${Object.keys(PostCategoryOptions).map((key) => key)}
  }
`;
