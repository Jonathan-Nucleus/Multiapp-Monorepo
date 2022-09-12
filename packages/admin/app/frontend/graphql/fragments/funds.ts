import { gql } from "@apollo/client";
import { Company } from "backend/graphql/companies.graphql";
import { Fund } from "backend/graphql/funds.graphql";
import { User } from "backend/graphql/users.graphql";

export type FundDetails = Pick<Fund, "_id"> & {
  watchlist: Pick<Fund, "name"> & {
    manager: Pick<User, "fullName"> & {
      company: Pick<Company, "name">;
    };
  };
};

export const FUND_FRAGMENT = gql`
  fragment FundFields on Fund {
    name
    manager {
      company {
        name
      }
    }
  }
`;
