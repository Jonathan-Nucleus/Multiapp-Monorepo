import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "../lib/mongo-helper";

import { Post, PostCategory, PostCategoryEnum } from "./post";
import { Company } from "./company";
import { Fund } from "./fund";

export interface ContentCreatorProps {
  avatar?: string;
  background?: AdjustableImage;
  tagline?: string;
  overview?: string;
  postIds?: ObjectId[];
  commentIds?: ObjectId[];
  followerIds?: ObjectId[];
  followingIds?: ObjectId[];
  companyFollowerIds?: ObjectId[];
  companyFollowingIds?: ObjectId[];
  website?: string;
  linkedIn?: string;
  twitter?: string;
}

export function isUser(user: User.Mongo | User.Stub): user is User.Mongo {
  return (user as User.Stub).role !== "stub";
}

export namespace User {
  export interface Mongo extends ContentCreatorProps {
    _id: ObjectId;
    email: string;
    password?: string; // Hashed password
    salt?: string; // Password salt
    authProvider?: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    accreditation: Accreditation;
    position?: string;
    companyIds?: ObjectId[];
    watchlistIds?: ObjectId[];
    settings?: Settings;
    featured?: boolean;

    // TODO: still needs to finalized
    //settings: Settings;

    managedFundsIds?: ObjectId[];
    mutedPostIds?: ObjectId[];
    hiddenPostIds?: ObjectId[];
    reportedPosts?: ReportedPost[];
    hiddenUserIds?: ObjectId[];
    chatToken?: string;
    emailToken?: string;
    inviteeIds?: ObjectId[];
    updatedAt?: Date;
  }

  export type Stub = Pick<Mongo, "_id" | "email" | "emailToken"> & {
    role: "stub";
  };

  export type FundManager = Omit<Mongo, "managedFundsIds"> & {
    managedFundsIds: ObjectId[];
  };

  export type GraphQL = GraphQLEntity<
    Omit<
      Mongo,
      | "password"
      | "salt"
      | "emailToken"
      | "authProvider"
      | "role"
      | "accreditation"
      | "reportedPost"
      | "settings"
    >
  > & {
    role: UserRoleEnum;
    accreditation: AccreditationEnum;
    reportedPosts: Omit<GraphQLEntity<ReportedPost>, "violations"> & {
      violations: PostViolationEnum;
    };
    settings: Omit<Settings, "interests"> & {
      interests?: PostCategoryEnum[];
    };
    createdAt: Date;
    companies: Company.GraphQL[];
    managedFunds: Fund.GraphQL[];
    mutedPosts: Post.GraphQL[];
    hiddenPosts: Post.GraphQL[];
    hiddenUsers: User.GraphQL[];
    invitees: (User.Stub | User.GraphQL)[];
    company?: Company.GraphQL;
    watchlist: Fund.GraphQL[];
    followers: User.GraphQL[];
    following: User.GraphQL[];
  };

  export type Input = Required<
    Pick<GraphQL, "email" | "firstName" | "lastName"> & {
      password: string;
      inviteCode: string;
    }
  >;

  export type OAuthInput = Pick<GraphQL, "email" | "firstName" | "lastName"> & {
    provider: string;
    tokenId: string;
  };
}

export interface Settings {
  interests?: PostCategory[];
}

export interface AdjustableImage {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

export interface ReportedPost {
  violations: PostViolation[];
  comments: string;
  postId: ObjectId;
}

/** Enumeration describing the role of the user. */
export const UserRoleOptions = {
  USER: "user",
  VERIFIED: "verified",
  PROFESSIONAL: "professional",
} as const;
export type UserRole = ValueOf<typeof UserRoleOptions>;
export type UserRoleEnum = keyof typeof UserRoleOptions;

/** Enumeration describing the accreditation status of the user. */
export const AccreditationOptions = {
  NONE: {
    value: "none",
    label: "Unaccredited",
  },
  ACCREDITED: {
    value: "accredited",
    label: "Accredited Investor",
  },
  QUALIFIED_CLIENT: {
    value: "client",
    label: "Qualified Client",
  },
  QUALIFIED_PURCHASER: {
    value: "purchaser",
    label: "Qualified Purchaser",
  },
  // RIA: "ria",                        NOT MVP
} as const;
export type Accreditation = ValueOf<typeof AccreditationOptions>["value"];
export type AccreditationEnum = keyof typeof AccreditationOptions;

export function compareAccreditation(
  a: Accreditation,
  b: Accreditation
): number {
  const accreditationRanking = [
    AccreditationOptions.NONE.value,
    AccreditationOptions.ACCREDITED.value,
    AccreditationOptions.QUALIFIED_CLIENT.value,
    AccreditationOptions.QUALIFIED_PURCHASER.value,
  ];

  return accreditationRanking.indexOf(a) - accreditationRanking.indexOf(b);
}

/** Enumeration describing the accreditation status of the user. */
export const PostViolationOptions = {
  OFF_TOPIC: {
    value: "off-topic",
    label: "Off-topic (not financial in nature)",
  },
  PROJECTION: {
    value: "projection",
    label: "Price or performance projection",
  },
  EXAGGERATION: {
    value: "exaggeration",
    label: "Exaggeratory or promissory statements",
  },
  PROMOTIONAL: { value: "promotional", label: "Promotional content" },
  PROPRIETARY: {
    value: "proprietary",
    label: "Discusses private funds, investments or trades ",
  },
} as const;
export type PostViolation = ValueOf<typeof PostViolationOptions>["value"];
export type PostViolationEnum = keyof typeof PostViolationOptions;

export const ContentCreatorSchema = `
  avatar: String
  background: AdjustableImage
  tagline: String
  overview: String
  postIds: [ID!]
  commentIds: [ID!]
  followerIds: [ID!]
  followingIds: [ID!]
  companyFollowerIds: [ID!]
  companyFollowingIds: [ID!]
  website: String
  linkedIn: String
  twitter: String

  posts(featured: Boolean): [Post!]!
  comments: [Comment!]!
  followers: [UserProfile!]!
  following: [UserProfile!]!
  companyFollowers: [Company!]!
  companyFollowing: [Company!]!
`;

const UserProfileSchema = `
  _id: ID!
  firstName: String!
  lastName: String!
  position: String
  companyIds: [ID!]
  watchlistIds : [ID!]
  ${ContentCreatorSchema}

  company: Company
  companies: [Company!]
  watchlist: [Fund!]
`;

export const UserSchema = `
  type User {
    ${UserProfileSchema}

    email: String!
    role: UserRole!
    accreditation: Accreditation!
    managedFundsIds: [ID!]
    mutedPostIds: [ID!]
    hiddenPostIds: [ID!]
    reportedPosts: [ReportedPost!]
    hiddenUserIds: [ID!]
    chatToken: String
    emailToken: String
    inviteeIds: [ID!]
    createdAt: Date!
    updatedAt: Date

    managedFunds: [Fund!]
    mutedPosts: [Post!]
    hiddenPosts: [Post!]
    hiddenUsers: [User!]
    invitees: [Invitee!]
  }

  type UserStub {
    _id: ID!
    email: String!
    emailToken: String
  }

  type UserProfile {
    ${UserProfileSchema}
  }

  union Invitee = User | UserStub

  input UserInput {
    email: String!
    password: String!
    inviteCode: String!
    firstName: String!
    lastName: String!
  }

  input OAuthUserInput {
    email: String!
    firstName: String!
    lastName: String!
    provider: String!
    tokenId: String!
  }

  type AdjustableImage {
    url: String!
    x: Int!
    y: Int!
    width: Int!
    height: Int!
    scale: Float!
  }

  type ReportedPost {
    violations: [PostViolation!]!
    comments: String
    postId: ID!
    post: Post!
  }

  input ReportedPostInput {
    violations: [PostViolation!]!
    comments: String
    postId: ID!
  }

  type Settings {
    interests: [PostCategory!]
  }

  input SettingsInput {
    interests: [PostCategory!]
  }

  enum UserRole {
    ${Object.keys(UserRoleOptions).map((key) => key)}
  }

  enum Accreditation {
    ${Object.keys(AccreditationOptions).map((key) => key)}
  }

  enum PostViolation {
    ${Object.keys(PostViolationOptions).map((key) => key)}
  }
`;
