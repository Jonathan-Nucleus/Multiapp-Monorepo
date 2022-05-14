import { gql } from "@apollo/client";
import { Company } from "backend/graphql/companies.graphql";

export type CompanySummary = Pick<
  Company,
  | "_id"
  | "name"
  | "tagline"
  | "overview"
  | "avatar"
  | "website"
  | "linkedIn"
  | "twitter"
>;

export const COMPANY_SUMMARY_FRAGMENT = gql`
  fragment CompanySummaryFields on Company {
    _id
    name
    tagline
    overview
    avatar
    website
    linkedIn
    twitter
  }
`;
