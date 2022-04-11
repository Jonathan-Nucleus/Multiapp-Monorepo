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
    shareIds?: ObjectId[];
    sharedPostId?: ObjectId;
    visible: boolean;
    reporterIds?: ObjectId[];
    updatedAt?: Date;
  }

  export type GraphQL = GraphQLEntity<Omit<Mongo, "visible">> & {
    createdAt: Date;
    user: User.GraphQL;
    mentions: User.GraphQL[];
    likes: User.GraphQL[];
    shares: Post.GraphQL[];
    sharedPost?: Post.GraphQL;
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
  MATERIALS: {
    value: "materials",
    label: "Materials",
  },
  NEWS: {
    value: "news",
    label: "News",
  },
  ENERGY: {
    value: "energy",
    label: "Energy",
  },
  POLITICS: {
    value: "politics",
    label: "Politics",
  },
  CRYTPO: {
    value: "crypto",
    label: "Crypto",
  },
  IDEAS: {
    value: "ideas",
    label: "Ideas",
  },
  ESG: {
    value: "esg",
    label: "ESG",
  },
  EDUCATION: {
    value: "education",
    label: "Education",
  },
  VENTURE: {
    value: "venture",
    label: "Venture Capital",
  },
  QUESTIONS: {
    value: "questions",
    label: "Questions",
  },
  PE: {
    value: "pe",
    label: "Private Equity",
  },
  TECH: {
    value: "tech",
    label: "Technology",
  },
  HEDGE: {
    value: "hedge",
    label: "Hedge Funds",
  },
  CONSUMER: {
    value: "consumer",
    label: "Consumer",
  },
  ENTERTAINMENT: {
    value: "entertainment",
    label: "Entertainment",
  },
  INDUSTRIALS: {
    value: "industrials",
    label: "Industrials",
  },
  REAL_ESTATE: {
    value: "real-estate",
    label: "Real Estate",
  },
  HEALTHCARE: {
    value: "healthcare",
    label: "Healthcare",
  },
  OP_ED: {
    value: "op-ed",
    label: "Op-Ed",
  },
  FINANCIALS: {
    value: "financials",
    label: "Financials",
  },
} as const;
export type PostCategory = ValueOf<typeof PostCategoryOptions>["value"];
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
    shareIds: [ID!]
    sharedPostId: ID
    reporterIds: [ID!]
    createdAt: Date!
    updatedAt: Date

    user: User
    mentions: [User!]
    likes: [User!]
    comments: [Comment!]
    reporters: [User!]
    sharedPost: Post
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
