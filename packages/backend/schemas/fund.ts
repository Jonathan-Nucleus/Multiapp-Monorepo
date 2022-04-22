import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "../lib/mongo-helper";

import type {
  User,
  Accreditation,
  AccreditationEnum,
  AdjustableImage,
} from "./user";
import type { Company } from "./company";

type UserCommonFields = Pick<User.Mongo, "avatar" | "background">;

export namespace Fund {
  export interface Mongo extends UserCommonFields {
    _id: ObjectId;
    name: string;
    level: Accreditation;
    managerId: ObjectId;
    companyId: ObjectId;
    status: FundStatus;
    highlights: string[];
    overview: string;
    presentationUrl?: string;
    documents?: Document[];
    teamIds: ObjectId[];
    tags: string[];
    updatedAt?: Date;

    // TODO: Figure out the rest of these soon
    // attributes
    // performance
    // status
  }

  export type GraphQL = GraphQLEntity<
    Omit<Mongo, "level" | "status" | "documents">
  > & {
    level: AccreditationEnum;
    status: FundStatusEnum;
    documents: Array<
      Omit<Document, "category"> & { category: DocumentCategoryEnum }
    >;
    manager: User.GraphQL;
    company: Company.GraphQL;
    team: User.GraphQL[];
    createdAt: Date;
  };
}

interface Document {
  title: string;
  url: string;
  category: DocumentCategory;
  date: Date;
  createdAt: number;
}

/** Enumeration describing the status of a fund. */
export const FundStatusOptions = {
  OPEN: "open",
  CLOSED: "closed",
} as const;
export type FundStatus = ValueOf<typeof FundStatusOptions>;
export type FundStatusEnum = keyof typeof FundStatusOptions;

/** Enumeration describing the category of a document. */
export const DocumentCategoryOptions = {
  PRESENTATION: "presentation",
  TEARSHEET: "tearsheet",
  INVESTOR_LETTER: "investor_letter",
  OPERATIONAL: "operational",
  PERFORMANCE: "performance",
  OTHER: "other",
} as const;
export type DocumentCategory = ValueOf<typeof DocumentCategoryOptions>;
export type DocumentCategoryEnum = keyof typeof DocumentCategoryOptions;

// Note that AdjustableImage referenced below is defined as part of the User
// schema.
export const FundSchema = `
  type Fund {
    _id: ID!
    name: String!
    level: Accreditation!
    managerId: ID!
    companyId: ID!
    status: FundStatus!
    highlights: [String!]!
    overview: String!
    presentationUrl: String
    documents: [Document!]
    teamIds: [ID!]!
    tags: [String!]!
    createdAt: Date!
    updatedAt: Date

    manager: UserProfile
    company: Company
    team: [UserProfile!]
  }

  type Document {
    title: String!
    url: String!
    category: DocumentCategory!
    date: Int!
    createdAt: Int!
  }

  enum FundStatus {
    ${Object.keys(FundStatusOptions).map((key) => key)}
  }

  enum DocumentCategory {
    ${Object.keys(DocumentCategoryOptions).map((key) => key)}
  }
`;
