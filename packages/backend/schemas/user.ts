import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "../lib/mongo-helper";

import { Post, PostCategory, PostCategoryEnum } from "./post";
import { Company } from "./company";
import { Fund } from "./fund";
import { Comment } from "./comment";
import { HelpRequestType, HelpRequestTypeEnum } from "./help-request";

export namespace ContentCreator {
  export interface Mongo {
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

  export type GraphQL = GraphQLEntity<Mongo> & {
    posts: Post.GraphQL[];
    comments: Comment.GraphQL[];
    followers: User.Profile[];
    following: User.Profile[];
    companyFollowers: User.Profile[];
    companyFollowing: User.Profile[];
  };
}

export function isUser(user: User.Mongo | User.Stub): user is User.Mongo {
  return (user as User.Stub).role !== "stub";
}

export namespace User {
  export interface Mongo extends ContentCreator.Mongo {
    _id: ObjectId;
    email: string;
    password?: string; // Hashed password
    salt?: string; // Password salt
    authProvider?: string;
    firstName: string;
    lastName: string;
    fullName: string; // auto-generate by firstName and lastName. should not be updated manually.
    role: UserRole;
    accreditation: Accreditation;
    questionnaire?: Questionnaire;
    proRequest?: ProRequest;
    position?: string;
    companyIds?: ObjectId[];
    watchlistIds?: ObjectId[];
    settings?: Settings;
    featured?: boolean;
    fcmToken?: string;
    fcmTokenCreated?: Date;
    notificationBadge?: number;
    deletedAt?: Date;
    superUser?: boolean;

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

  export type Profile = GraphQLEntity<
    Pick<
      Mongo,
      | "_id"
      | "firstName"
      | "lastName"
      | "position"
      | "companyIds"
      | "watchlistIds"
      | "avatar"
      | "background"
      | "tagline"
      | "overview"
      | "managedFundsIds"
      | "postIds"
      | "commentIds"
      | "followerIds"
      | "followingIds"
      | "companyFollowerIds"
      | "companyFollowingIds"
      | "website"
      | "linkedIn"
      | "twitter"
      | "notificationBadge"
    >
  > & {
    role: UserRoleEnum;
    createdAt: Date;
    company?: Company.GraphQL;
    companies: Company.GraphQL[];
    watchlist: Fund.GraphQL[];
    managedFunds: Fund.GraphQL[];
  };

  export type GraphQL = Profile &
    ContentCreator.GraphQL &
    GraphQLEntity<
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
        | "questionnaire"
        | "deletedAt"
      >
    > & {
      accreditation: AccreditationEnum;
      reportedPosts: Omit<GraphQLEntity<ReportedPost>, "violations"> & {
        violations: PostViolationEnum;
      };
      settings: Omit<Settings, "interests" | "notifications"> & {
        interests?: PostCategoryEnum[];
        notifications: Record<NotificationEvent, NotificationMethodEnum>;
      };
      mutedPosts: Post.GraphQL[];
      hiddenPosts: Post.GraphQL[];
      hiddenUsers: User.GraphQL[];
      invitees: (User.Stub | User.GraphQL)[];
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

  export type ProfileInput = Required<Pick<GraphQL, "_id">> &
    Partial<
      Pick<
        GraphQL,
        | "firstName"
        | "lastName"
        | "position"
        | "avatar"
        | "background"
        | "tagline"
        | "overview"
        | "website"
        | "linkedIn"
        | "twitter"
      >
    >;
}

export interface Settings {
  interests?: PostCategory[];

  /**
   * Whether or user authorizes being tagged in posts, comments, and messages
   * using the @mention feature.
   */
  tagging: boolean;

  /** Whether or not user authorizes being directly messaged in the app. */
  messaging: boolean;

  /** Whether or not new messages should also be emailed to the user. */
  emailUnreadMessage: boolean;

  /** Notification method settings for various notification events. */
  notifications: Record<NotificationEvent, NotificationMethod>;
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

export interface Questionnaire {
  class: InvestorClass;
  status: FinancialStatus[];
  date: Date;
  advisorRequest?: {
    firm: string;
    crd: string;
    phone: string;
    email: string;
    contactMethod: HelpRequestType;
  };
}

export type QuestionnaireInput = {
  class: InvestorClassEnum;
  status: FinancialStatusEnum[];
  date: Date;
  advisorRequest?: Omit<
    Exclude<Questionnaire["advisorRequest"], undefined>,
    "contactMethod"
  > & {
    contactMethod: HelpRequestTypeEnum;
  };
};

export interface ProRequest {
  role: ProRoleEnum;
  email: string;
  organization?: string;
  position: string;
  info?: string;
}

/** Enumeration describing the role of the user. */
export const UserRoleOptions = {
  USER: "user",
  VERIFIED: "verified",
  PROFESSIONAL: "professional",
} as const;
export type UserRole = ValueOf<typeof UserRoleOptions>;
export type UserRoleEnum = keyof typeof UserRoleOptions;

export const NotificationMethodOptions = {
  NONE: "none",
  SMS: "sms",
  EMAIL: "email",
  BOTH: "both",
} as const;
export type NotificationMethod = ValueOf<typeof NotificationMethodOptions>;
export type NotificationMethodEnum = keyof typeof NotificationMethodOptions;

/**
 * List of notification events that the user can set their notifiation method
 * preferences for.
 */
export const NotificationEventOptions = {
  postCreate: {
    label: "New posts from people or companies you're following",
    info: undefined,
  },
  postLike: {
    label: "Likes on your posts",
    info: undefined,
  },
  postComment: {
    label: "Comments on your posts",
    info: undefined,
  },
  commentLike: {
    label: "Likes on your comments",
    info: "When someone likes a comment you made on your own or anyone else's post.",
  },
  tagCreate: {
    label: "Tagged in a post, comment, or profile page.",
    info: "When someone tags you via @mention a post, comment or on their profile or company profile.",
  },
  messageReceived: {
    label: "New Messages",
    info: "When someone sends you a new message with Prometheus",
  },
} as const;
export type NotificationEvent = keyof typeof NotificationEventOptions;

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

export const InvestorClassOptions = {
  INDIVIDUAL: {
    value: "individual",
    label: "Individual",
  },
  ENTITY: {
    value: "entity",
    label: "Entity",
  },
  ADVISOR: {
    value: "advisor",
    label: "Financial Advisor",
  },
} as const;
export type InvestorClass = ValueOf<typeof InvestorClassOptions>["value"];
export type InvestorClassEnum = keyof typeof InvestorClassOptions;

export const FinancialStatusOptions = {
  MIN_INCOME: {
    value: "200K+",
    title: "Income",
    description:
      "I earn $200K+ per year, or with my spousal equivalent, $300K+ per year.",
  },
  NET_WORTH: {
    value: "net-worth",
    title: "Personal Net Worth",
    description: "I/we have $1M+ in assets excluding primary residence.",
  },
  ASSETS: {
    value: "assets",
    title: "Assets",
    description: "Entity has more than $5M in assets.",
  },
  TIER1: {
    value: "$2.2M",
    title: "Do you have at least $2.2M in investments?",
    description: "",
  },
  TIER2: {
    value: "$5M",
    title: "Do you have at least $5M in investments?",
    description: "",
  },
  AI_OWNERS: {
    value: "ai-owners",
    title: "Ownership",
    description: "All owners of the Entity are Accredited Investors.",
  },
  LICENSED: {
    value: "licensed",
    title: "License Holder",
    description:
      "I hold an active Series 7, 65, or 82 license in good standing.",
  },
  AFFILIATED: {
    value: "affliated",
    title: "Affiliation",
    description:
      "I am a knowledgeable employee, executive officer, trustee, general partner, or advisory board member of a private fund.",
  },
  QP_OWNERS: {
    value: "qp-owners",
    title: "Ownership",
    description: "All owners of the Entity are Qualified Purchasers.",
  },
  TIER1_AI_OWNERS: {
    value: "tier1-ai-owners",
    title: "Ownership",
    description:
      "All owners of the Entity are Accredited Investors with each of the entity's owners havea net worth of $2.2M.",
  },
  TRUST_ASSETS: {
    value: "trust-assets",
    title: "Assets",
    description: "I'm a trust with $5M+ in investments.",
  },
  TIER3: {
    value: "tier3",
    title: "Assets",
    description: "I'm an entity that owns and invests $25M+ in investments.",
  },
} as const;
export type FinancialStatus = ValueOf<typeof FinancialStatusOptions>["value"];
export type FinancialStatusEnum = keyof typeof FinancialStatusOptions;

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

export const ProRoleOptions = {
  MANAGER: {
    value: "manager",
    label: "Fund manager",
  },
  JOURNALIST: {
    value: "journalist",
    label: "Journalist",
  },
  C_LEVEL: {
    value: "c-level",
    label: "C level manager",
  },
  FOUNDER: {
    value: "founder",
    label: "Promotional content",
  },
  EX_MANAGER: {
    value: "ex-manager",
    label: "Ex fund manager",
  },
  OTHER: {
    value: "other",
    label: "Other",
  },
} as const;
export type ProRole = ValueOf<typeof ProRoleOptions>["value"];
export type ProRoleEnum = keyof typeof ProRoleOptions;

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

  posts(
    featured: Boolean
    categories: [PostCategory!]
    before: ID
    limit: Int
  ): [Post!]!
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
  role: UserRole!
  companyIds: [ID!]
  watchlistIds : [ID!]
  managedFundsIds: [ID!]
  ${ContentCreatorSchema}

  company: Company
  companies: [Company!]
  watchlist: [Fund!]
  managedFunds: [Fund!]
  settings: Settings
`;

export const UserSchema = `
  type User {
    ${UserProfileSchema}

    email: String!
    accreditation: Accreditation!
    mutedPostIds: [ID!]
    hiddenPostIds: [ID!]
    reportedPosts: [ReportedPost!]
    hiddenUserIds: [ID!]
    chatToken: String
    emailToken: String
    inviteeIds: [ID!]
    createdAt: Date!
    updatedAt: Date
    notificationBadge: Int
    superUser: Boolean

    mutedPosts: [Post!]
    hiddenPosts: [Post!]
    hiddenUsers: [User!]
    invitees: [Invitee!]
  }

  type UserStub {
    _id: ID!
    email: String!
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

  input UserProfileInput {
    _id: ID!
    firstName: String
    lastName: String
    position: String
    avatar: String
    background: AdjustableImageInput
    tagline: String
    overview: String
    website: String
    linkedIn: String
    twitter: String
  }

  input QuestionnaireInput {
    class: InvestorClass!
    status: [FinancialStatus!]!
    date: Date!
    advisorRequest: AdvisorRequestInput
  }

  input ProRequestInput {
    role: ProRole!
    email: String!
    organization: String
    position: String!
    info: String
  }

  type AdjustableImage {
    url: String!
    x: Int!
    y: Int!
    width: Int!
    height: Int!
    scale: Float!
  }

  input AdjustableImageInput {
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

  type NotificationSettings {
    ${Object.keys(NotificationEventOptions).map(
      (event) => `${event}: NotificationMethod!`
    )}
  }

  input NotificationSettingsInput {
    ${Object.keys(NotificationEventOptions).map(
      (event) => `${event}: NotificationMethod!`
    )}
  }

  type Settings {
    interests: [PostCategory!]
    tagging: Boolean!
    messaging: Boolean!
    emailUnreadMessage: Boolean!
    notifications: NotificationSettings!
  }

  input SettingsInput {
    interests: [PostCategory!]
    tagging: Boolean
    messaging: Boolean
    emailUnreadMessage: Boolean
    notifications: NotificationSettingsInput
  }

  input AdvisorRequestInput {
    firm: String!
    crd: String!
    phone: String!
    email: String!
    contactMethod: HelpRequestType!
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

  enum InvestorClass {
    ${Object.keys(InvestorClassOptions).map((key) => key)}
  }

  enum FinancialStatus {
    ${Object.keys(FinancialStatusOptions).map((key) => key)}
  }

  enum ProRole {
    ${Object.keys(ProRoleOptions).map((key) => key)}
  }

  enum NotificationMethod {
    ${Object.keys(NotificationMethodOptions).map((key) => key)}
  }
`;
