import { ObjectId } from "mongodb";
import { GraphQLEntity } from "../lib/mongo-helper";

import { ContentCreatorSchema } from "./user";
import type { User, ContentCreator } from "./user";
import type { Fund } from "./fund";

export namespace Company {
  export interface Mongo extends ContentCreator.Mongo {
    _id: ObjectId;
    name: string;
    memberIds: ObjectId[];
    fundIds?: ObjectId[];
    updatedAt?: Date;
    isChannel?: boolean;
  }

  export type GraphQL = ContentCreator.GraphQL &
    GraphQLEntity<Mongo> & {
      members: User.GraphQL[];
      funds: Fund.GraphQL[];
      fundManagers: User.GraphQL[];
      createdAt: Date;
    };

  export type ProfileInput = Required<Pick<GraphQL, "_id">> &
    Partial<
      Pick<
        GraphQL,
        | "name"
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

// Note that AdjustableImage referenced below is defined as part of the User
// schema.
export const CompanySchema = `
  type Company {
    _id: ID!
    name: String!
    memberIds: [ID!]!
    fundIds: [ID!]!
    isChannel: Boolean
    ${ContentCreatorSchema}

    members: [UserProfile!]!
    funds: [Fund!]!
    fundManagers: [User!]!
  }

  input CompanyProfileInput {
    _id: ID!
    name: String
    avatar: String
    background: AdjustableImageInput
    tagline: String
    overview: String
    website: String
    linkedIn: String
    twitter: String
  }
`;
