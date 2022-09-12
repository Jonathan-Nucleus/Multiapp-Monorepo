import {
  AccreditationEnum,
  User as AppUser,
  UserSchema as AppUserSchema,
} from "backend/schemas/user";
import { GraphQLEntity } from "backend/lib/mongo-helper";

export * from "backend/schemas/user";

export namespace User {
  export type Mongo = AppUser.Mongo;
  export type GraphQL = GraphQLEntity<AppUser.Mongo> & AppUser.GraphQL;
  export type Stub = AppUser.Stub;
  export type Update = Pick<AppUser.Mongo, "_id"> &
    Partial<
      Pick<
        AppUser.Mongo,
        | "firstName"
        | "lastName"
        | "role"
        | "accreditation"
        | "avatar"
        | "background"
        | "position"
        | "tagline"
        | "overview"
        | "profile"
        | "website"
        | "twitter"
        | "linkedIn"
        | "featured"
        | "companyIds"
        | "watchlistIds"
        | "managedFundsIds"
        | "mutedPostIds"
        | "hiddenPostIds"
        | "hiddenUserIds"
      >
    >;
  export type GraphQLUpdate = Omit<GraphQLEntity<Update>, "accreditation"> & {
    accreditation?: AccreditationEnum;
  };
}

export const UserSchema = `
    ${AppUserSchema}

    input UpdateUserInput {
      _id: ID!
      firstName: String
      lastName: String
      role: UserRole
      accreditation: Accreditation
      avatar: String
      background: AdjustableImageInput
      position: String
      tagline: String
      overview: String
      profile: [ProfileSectionInput!]      
      featured: Boolean
      website: String
      twitter: String
      linkedIn: String
      companyIds: [ID!]
      watchlistIds: [ID!]
      managedFundsIds: [ID!]
      mutedPostIds: [ID!]
      hiddenPostIds: [ID!]
      hiddenUserIds: [ID!]
    }

    input ProfileSectionInput {
      title: String!
      desc: String!
    }
`;
