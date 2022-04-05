import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "backend/lib/mongo-helper";

export interface ContentCreatorProps {
  avatar?: string;
  background?: AdjustableImage;
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

    // TODO: still needs to finalized
    //settings: Settings;

    mutedPostIds?: ObjectId[];
    hiddenPostIds?: ObjectId[];
    reportedPosts?: ReportedPost[];
    hiddenUserIds?: ObjectId[];
    chatToken?: string;
    emailToken?: string;
    inviteeIds?: ObjectId[];
    updatedAt?: number;
  }

  export type Stub = Pick<Mongo, "_id" | "email" | "emailToken"> & {
    role: "stub";
  };

  export type GraphQL = GraphQLEntity<
    Omit<Mongo, "role" | "accreditation" | "reportedPost">
  > & {
    role: UserRoleEnum;
    accreditation: AccreditationEnum;
    reportedPosts: Omit<GraphQLEntity<ReportedPost>, "violation"> & {
      violation: PostViolationEnum;
    };
  };

  export type Input = Required<
    Pick<GraphQL, "email" | "password" | "firstName" | "lastName"> & {
      inviteCode: string;
    }
  >;

  export type OAuthInput = Pick<GraphQL, "email" | "firstName" | "lastName"> & {
    provider: string;
    tokenId: string;
  };
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
  NONE: "none",
  ACCREDITED: "accredited",
  QUALIFIED_CLIENT: "client",
  QUALIFIED_PURCHASER: "purchaser",
  // RIA: "ria",                        NOT MVP
} as const;
export type Accreditation = ValueOf<typeof AccreditationOptions>;
export type AccreditationEnum = keyof typeof AccreditationOptions;

/** Enumeration describing the accreditation status of the user. */
export const PostViolationOptions = {
  OFF_TOPIC: {
    value: "off-topic",
    message: "Off-topic (not financial in nature)",
  },
  PROJECTION: {
    value: "projection",
    message: "Price or performance projection",
  },
  EXAGGERATION: {
    value: "exaggeration",
    message: "Exaggeratory or promissory statements",
  },
  PROMOTIONAL: { value: "promotional", message: "Promotional content" },
  PROPRIETARY: {
    value: "proprietary",
    message: "Discusses private funds, investments or trades ",
  },
} as const;
export type PostViolation = ValueOf<typeof PostViolationOptions>["value"];
export type PostViolationEnum = keyof typeof PostViolationOptions;

export interface AdjustableImage {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

export interface ReportedPost {
  violation: PostViolation[];
  comments: string;
  postId: ObjectId;
}

export const ContentCreatorSchema = `
  avatar: String
  background: AdjustableImage
  postIds: [ID!]
  commentIds: [ID!]
  followerIds: [ID!]
  followingIds: [ID!]
  companyFollowerIds: [ID!]
  companyFollowingIds: [ID!]
  website: String
  linkedIn: String
  twitter: String

  posts: [Post!]!
  comments: [Comment!]!
  followers: [User!]!
  following: [User!]!
  companyFollowers: [Company!]!
  companyFollowing: [Company!]!
`;

export const UserSchema = `
  type User {
    _id: ID!
    email: String!
    hasPassword: Boolean!
    firstName: String!
    lastName: String!
    role: UserRole!
    accreditation: Accreditation!
    position: String
    companyIds: [ID!]
    ${ContentCreatorSchema}
    mutedPostIds: [ID!]
    hiddenPostIds: [ID!]
    reportedPosts: [ReportedPost!]
    hiddenUserIds: [ID!]
    chatToken: String
    emailToken: String
    inviteeIds: [ID!]
    createdAt: Int!
    updatedAt: Int

    companies: [Company!]!
    mutedPosts: [Post!]!
    hiddenPosts: [Post!]!
    hiddenUsers: [User!]!
    invitees: [Invitee!]!
  }

  type UserStub {
    _id: ID!
    email: String!
    emailToken: String
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
    violation: [PostViolation!]!
    comments: String
    postId: ID!
    post: Post!
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