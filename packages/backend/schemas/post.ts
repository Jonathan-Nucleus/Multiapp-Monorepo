import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "../lib/mongo-helper";

import {
  User,
  AccreditationOptions,
  Accreditation,
  AccreditationEnum,
} from "./user";
import { Company } from "./company";
import type { Comment } from "./comment";

export namespace Post {
  export interface Mongo {
    _id: ObjectId;
    userId: ObjectId;
    isCompany: boolean;
    audience: Audience;
    body?: string;
    media?: Media;
    preview?: LinkPreview;
    mentionIds?: ObjectId[];
    categories: PostCategory[];
    likeIds?: ObjectId[];
    commentIds?: ObjectId[];
    shareIds?: ObjectId[];
    sharedPostId?: ObjectId;
    visible: boolean;
    reporterIds?: ObjectId[];
    updatedAt?: Date;
    featured?: boolean;
    deleted?: boolean;
  }

  export type GraphQL = GraphQLEntity<
    Omit<Mongo, "audience" | "categories" | "visible" | "deleted">
  > & {
    audience: AudienceEnum;
    categories: PostCategoryEnum[];
    createdAt: Date;
    user?: User.GraphQL;
    company?: Company.GraphQL;
    mentions: User.GraphQL[];
    likes: User.GraphQL[];
    shares: Post.GraphQL[];
    sharedPost?: Post.GraphQL;
    comments: Comment.GraphQL[];
    reporters: User.GraphQL[];
  };

  // Defines the server-side input schema for posts after GraphQL enumarations
  // have been transformed to their Mongo types.
  export type Input = Pick<
    GraphQL,
    "body" | "media" | "preview" | "mentionIds"
  > &
    Pick<Mongo, "audience" | "categories"> & {
      companyId?: string;
    };

  export type ShareInput = Required<Pick<Input, "body">> &
    Pick<Input, "mentionIds" | "companyId">;

  export type Update = Pick<
    GraphQL,
    "_id" | "body" | "mentionIds" | "media" | "preview" | "userId"
  > &
    Pick<Mongo, "audience" | "categories">;
}

interface Media {
  url: string;
  aspectRatio: number;
  transcoded?: boolean;
}

interface LinkPreview {
  url: string;
  mediaType: string;
  contentType?: string;
  favicons?: string[];
  title?: string;
  siteName?: string;
  description?: string;
  images?: string[];
}

/** Enumeration describing the audience targeted by a post. */
const { NONE: ignored, ...relevantAccreditationOptions } = Object.keys(
  AccreditationOptions
).reduce<{
  [key: string]: string;
}>((acc, option) => {
  acc[option] = AccreditationOptions[option].value;
  return acc;
}, {});

export const AudienceOptions = {
  EVERYONE: "everyone",
  ...relevantAccreditationOptions,
} as const;
export type Audience =
  | ValueOf<typeof AudienceOptions>
  | Exclude<Accreditation, "none">;
export type AudienceEnum =
  | keyof typeof AudienceOptions
  | Exclude<AccreditationEnum, "NONE">;

/** Enumeration describing the possible categories of a post. */
export const PostCategoryOptions = {
  MACRO: {
    value: "macro",
    label: "Macro",
  },
  CRYTPO: {
    value: "crypto",
    label: "Crypto",
  },
  IDEAS: {
    value: "ideas",
    label: "Ideas",
  },
  CONSUMER: {
    value: "consumer",
    label: "Consumer",
  },
  NEWS: {
    value: "news",
    label: "News",
  },
  TECHNOLOGY: {
    value: "tech",
    label: "Technology",
  },
  EDUCATION: {
    value: "education",
    label: "Education",
  },
  INDUSTRIALS: {
    value: "industrials",
    label: "Industrials",
  },
  QUESTIONS: {
    value: "questions",
    label: "Questions",
  },
  HEALTHCARE: {
    value: "healthcare",
    label: "Healthcare",
  },
  HEDGE: {
    value: "hedge",
    label: "Hedge Funds",
  },
  FINANCIALS: {
    value: "financials",
    label: "Financials",
  },
  VENTURE: {
    value: "venture",
    label: "Venture Capital",
  },
  MATERIALS: {
    value: "materials",
    label: "Materials",
  },
  PE: {
    value: "pe",
    label: "Private Equity",
  },
  ENERGY: {
    value: "energy",
    label: "Energy",
  },
  POLITICS: {
    value: "politics",
    label: "Politics",
  },
  REAL_ESTATE: {
    value: "real-estate",
    label: "Real Estate",
  },
  ENTERTAINMENT: {
    value: "entertainment",
    label: "Entertainment",
  },
  ESG: {
    value: "esg",
    label: "ESG",
  },
} as const;
export type PostCategory = ValueOf<typeof PostCategoryOptions>["value"];
export type PostCategoryEnum = keyof typeof PostCategoryOptions;

export const PostRoleFilterOptions = {
  PROFESSIONAL_FOLLOW: {
    label: "Pros + People I follow",
    value: "professional-follow",
  },
  PROFESSIONAL_ONLY: {
    label: "Professionals",
    value: "professional-only",
  },
  FOLLOW_ONLY: {
    label: "People I follow",
    value: "follow-only",
  },
  EVERYONE: {
    label: "Everyone",
    value: "everyone",
  },
} as const;
export type PostRoleFilter = ValueOf<typeof PostRoleFilterOptions>["value"];
export type PostRoleFilterEnum = keyof typeof PostRoleFilterOptions;

export const PostSchema = `
  type Post {
    _id: ID!
    userId: ID!
    isCompany: Boolean!
    audience: Audience!
    body: String
    media: Media
    preview: LinkPreview
    mentionIds: [ID!]
    categories: [PostCategory!]!
    likeIds: [ID!]
    commentIds: [ID!]
    shareIds: [ID!]
    sharedPostId: ID
    reporterIds: [ID!]
    createdAt: Date!
    updatedAt: Date
    featured: Boolean

    user: User
    company: Company
    mentions: [User!]
    likes: [User!]
    comments: [Comment!]
    reporters: [User!]
    sharedPost: Post
  }

  type Media {
    url: String!
    aspectRatio: Float!
  }

  input MediaInput {
    url: String!
    aspectRatio: Float!
  }

  input PostInput {
    companyId: ID
    audience: Audience!
    body: String
    media: MediaInput
    preview: LinkPreviewInput
    categories: [PostCategory!]!
    mentionIds: [ID!]
  }

  input PostUpdate {
    _id: ID!
    userId: ID!
    audience: Audience!
    body: String
    media: MediaInput
    preview: LinkPreviewInput
    categories: [PostCategory!]!
    mentionIds: [ID!]
  }

  input SharePostInput {
    companyId: ID
    body: String!
    mentionIds: [ID!]
  }

  type LinkPreview {
    url: String!
    mediaType: String!
    contentType: String
    favicons: [String!]
    title: String
    siteName: String
    description: String
    images: [String!]
  }

  input LinkPreviewInput {
    url: String!
    mediaType: String!
    contentType: String
    favicons: [String!]
    title: String
    siteName: String
    description: String
    images: [String!]
  }

  enum Audience {
    ${Object.keys(AudienceOptions).map((key) => key)}
  }

  enum PostCategory {
    ${Object.keys(PostCategoryOptions).map((key) => key)}
  }

  enum PostRoleFilter {
    ${Object.keys(PostRoleFilterOptions).map((key) => key)}
  }
`;
