import { ObjectId } from "mongodb";
import { GraphQLEntity, ValueOf } from "../lib/mongo-helper";
import type { Fund } from "./fund";
import type { User } from "./user";

export namespace HelpRequest {
  export interface Mongo {
    _id: ObjectId;
    userId: ObjectId;
    type: HelpRequestType;
    fundId: ObjectId;
    email?: string;
    phone?: string;
    preferredTimeOfDay?: PreferredTimeOfDay;
    message?: string;
  }

  export type GraphQL = GraphQLEntity<Mongo> & {
    createdAt: Date;
    user: User.GraphQL;
    fund: Fund.GraphQL;
  };

  export type Input = Required<Pick<Mongo, "type" | "fundId">> &
    Pick<Mongo, "email" | "phone" | "preferredTimeOfDay" | "message">;
}

export const HelpRequestTypeOptions = {
  EMAIL: {
    label: "Email",
    value: "email",
  },
  PHONE: {
    label: "Phone",
    value: "phone",
  },
} as const;
export type HelpRequestType = ValueOf<typeof HelpRequestTypeOptions>["value"];
export type HelpRequestTypeEnum = keyof typeof HelpRequestTypeOptions;

export const PreferredTimeOfDayOptions = {
  MORNING: {
    label: "Morning (8am - 12pm)",
    value: "morning",
  },
  AFTERNOON: {
    label: "Afternoon (12pm - 5pm)",
    value: "afternoon",
  },
  EVENING: {
    label: "Evening (5pm - 8pm)",
    value: "evening",
  },
} as const;
export type PreferredTimeOfDay = ValueOf<
  typeof PreferredTimeOfDayOptions
>["value"];
export type PreferredTimeOfDayEnum = keyof typeof PreferredTimeOfDayOptions;

export const HelpRequestSchema = `
  type HelpRequest {
    _id: ID!
    type: HelpRequestType!
    userId: ID!
    fundId: ID!
    email: String
    phone: String
    preferredTimeOfDay: PreferredTimeOfDay
    message: String
    createdAt: Date!

    user: User!
    fund: Fund!
  }

  enum HelpRequestType {
    ${Object.keys(HelpRequestTypeOptions).map((key) => key)}
  }

  enum PreferredTimeOfDay {
    ${Object.keys(PreferredTimeOfDayOptions).map((key) => key)}
  }

  input HelpRequestInput {
    type: HelpRequestType!
    fundId: ID!
    email: String
    phone: String
    preferredTimeOfDay: PreferredTimeOfDay
    message: String
  }
`;
