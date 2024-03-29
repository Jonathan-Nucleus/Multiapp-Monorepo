import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "../lib/mongo-helper";

import type { User, Accreditation, AccreditationEnum } from "./user";
import type { Company } from "./company";

export namespace Fund {
  export interface Mongo {
    _id: ObjectId;
    name: string;
    managerId: ObjectId;
    companyId: ObjectId;
    level: Accreditation;
    class: AssetClass;
    aum?: number;
    min: number;
    lockup: string;
    strategy: string;
    liquidity: string;
    fees: Attribute[];
    attributes: Attribute[];
    status: FundStatus;
    highlights: string[];
    overview: string;
    presentationUrl?: string;
    videos?: string[];
    documents?: Document[];
    teamIds: ObjectId[];
    tags: string[];
    metrics: Metric[];

    /** Whether an offshore fund is alo available. */
    offshore?: boolean;

    /** Whether a feeder fund is in place for this fund. */
    feeder?: boolean;

    /** Whether this fund is inactive and should not currently be displayed.*/
    inactive?: boolean;

    /** Whether this fund should only be shown with a limited view. */
    limitedView?: boolean;

    /** Fund-specific disclosure. */
    disclosure?: string;

    updatedAt: Date;
  }

  export type GraphQL = GraphQLEntity<
    Omit<Mongo, "level" | "class" | "status" | "documents">,
    Date
  > & {
    level: AccreditationEnum;
    class: AssetClassEnum;
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
  createdAt: Date;
}

interface Attribute {
  label: string;
  value: string;
}

interface Metric {
  date: Date;
  figure: number;
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
  PRESENTATION: {
    label: "Investor Presentation",
    value: "presentation",
  },
  INVESTOR_LETTER: {
    label: "Investor Letters",
    value: "investor-letter",
  },
  OPERATIONAL: {
    label: "Operational Docs",
    value: "operational",
  },
  PERFORMANCE: {
    label: "Performance Reports",
    value: "performance",
  },
  OTHER: {
    label: "Other",
    value: "other",
  },
} as const;
export type DocumentCategory = ValueOf<typeof DocumentCategoryOptions>["value"];
export type DocumentCategoryEnum = keyof typeof DocumentCategoryOptions;

export const AssetClassOptions = {
  HEDGE: {
    label: "Hedge Fund",
    value: "hedge",
  },
  PE: {
    label: "Private Equity",
    value: "pe",
  },
  CREDIT: {
    label: "Credit",
    value: "credit",
  },
  VC: {
    label: "Venture Capital",
    value: "vc",
  },
  CRYPTO: {
    label: "Crypto",
    value: "crypto",
  },
  RE: {
    label: "Real Estate",
    value: "re",
  },
} as const;
export type AssetClass = ValueOf<typeof AssetClassOptions>["value"];
export type AssetClassEnum = keyof typeof AssetClassOptions;

// Note that AdjustableImage referenced below is defined as part of the User
// schema.
export const FundSchema = `
  type Fund {
    _id: ID!
    name: String!
    managerId: ID!
    companyId: ID!
    level: Accreditation!
    class: AssetClass!
    aum: Int
    min: Int!
    lockup: String!
    strategy: String!
    liquidity: String!
    fees: [Attribute!]!
    attributes: [Attribute!]!
    status: FundStatus!
    highlights: [String!]!
    overview: String!
    presentationUrl: String
    videos: [String!]
    documents: [Document!]
    teamIds: [ID!]!
    tags: [String!]!
    metrics: [Metric!]!
    offshore: Boolean
    feeder: Boolean
    limitedView: Boolean
    disclosure: String
    createdAt: Date!
    updatedAt: Date!

    manager: UserProfile
    company: Company
    team: [UserProfile!]
  }

  type Document {
    title: String!
    url: String!
    category: DocumentCategory!
    date: Date!
    createdAt: Date!
  }

  type Attribute {
    label: String!
    value: String!
  }

  type Metric {
    date: Date!
    figure: Float!
  }

  enum FundStatus {
    ${Object.keys(FundStatusOptions).map((key) => key)}
  }

  enum DocumentCategory {
    ${Object.keys(DocumentCategoryOptions).map((key) => key)}
  }

  enum AssetClass {
    ${Object.keys(AssetClassOptions).map((key) => key)}
  }
`;
