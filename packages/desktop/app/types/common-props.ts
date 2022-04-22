import { PropsWithChildren } from "react";
import { Company } from "backend/graphql/companies.graphql";
import { AccountData } from "mobile/src/graphql/query/account";
import { FetchPostsData } from "mobile/src/graphql/query/account";

export interface UserProfileProps extends PropsWithChildren<unknown> {
  user: Exclude<AccountData["account"], undefined>;
}

export interface CompanyProfileProps extends PropsWithChildren<unknown> {
  company: Company;
}

export type PostType = Exclude<FetchPostsData["posts"], undefined>[number];

export type CompanyType = AccountData["account"]["companies"][number];
