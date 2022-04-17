import { ObjectId } from "mongodb";
import { ValueOf, GraphQLEntity } from "../lib/mongo-helper";

import { ContentCreatorSchema } from "./user";
import type { User, ContentCreatorProps } from "./user";
import type { Fund } from "./fund";

export namespace Company {
  export interface Mongo extends ContentCreatorProps {
    _id: ObjectId;
    name: string;
    memberIds: ObjectId[];
    fundIds?: ObjectId[];
    updatedAt?: Date;
  }

  export type GraphQL = GraphQLEntity<Mongo> & {
    members: User.GraphQL[];
    funds: Fund.GraphQL[];
    fundManagers: User.GraphQL[];
    createdAt: Date;
  };
}

// Note that AdjustableImage referenced below is defined as part of the User
// schema.
export const CompanySchema = `
  type Company {
    _id: ID!
    name: String!
    memberIds: [ID!]!
    fundIds: [ID!]!
    ${ContentCreatorSchema}
    createdAt: Date!
    updatedAt: Date

    members: [UserProfile!]!
    funds: [Fund!]!
    fundManagers: [User!]!
  }
`;
