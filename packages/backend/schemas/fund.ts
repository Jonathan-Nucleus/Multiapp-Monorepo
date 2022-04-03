import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "backend/lib/mongo-helper";

import type { User } from "./user";
import type { Company } from "./company";

type UserCommonFields = Pick<User.Mongo, "avatar" | "background">;

export namespace Fund {
  export interface Mongo extends UserCommonFields {
    _id: ObjectId;
    name: string;
    managerId: ObjectId;
    companyId: ObjectId;
    status: FundStatus;
    hightlights: string[];
    overview: string;
    presentationUrl?: string;
    documents?: Document[];
    teamIds: ObjectId[];
    tags: string[];
    updatedAt?: number;

    // TODO: Figure out the rest of these soon
    // attributes
    // performance
    // status
  }

  export type GraphQL = GraphQLEntity<Omit<Mongo, "status" | "documents">> & {
    status: FundStatusEnum;
    documents: Array<
      Omit<Document, "category"> & { category: DocumentCategoryEnum }
    >;
    manager: User.GraphQL;
    company: Company.GraphQL;
    team: User.GraphQL[];
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
    managerId: ID!
    companyId: ID!
    status: FundStatus!
    hightlights: [String!]!
    overview: String!
    presentationUrl: String
    documents: [Document!]
    teamIds: [ID!]!
    tags: [String!]!
    createdAt: Int!
    updatedAt: Int

    manager: User!
    company: Company!
    team: [User!]!
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
