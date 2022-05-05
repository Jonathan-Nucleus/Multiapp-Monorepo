import {
  AudienceOptions,
  AudienceEnum,
  PostCategoryOptions,
  PostCategoryEnum,
} from "../schemas/post";

import { NotificationMethodOptions } from "../schemas/user";

import {
  FinancialStatusEnum,
  FinancialStatusOptions as BackendFinancialStatusOptions,
  InvestorClassOptions as BackendInvestorClassOptions,
} from "../schemas/user";

export const Audiences: AudienceEnum[] = Object.keys(AudienceOptions);
export const PostCategories = Object.keys(PostCategoryOptions).reduce(
  (acc, category) => {
    acc[category] = PostCategoryOptions[category].label;
    return acc;
  },
  {} as Record<PostCategoryEnum, string>
);

export const InvestorClassOptions = Object.keys(BackendInvestorClassOptions);

const orderedStatusOptions: FinancialStatusEnum[] = [
  "MIN_INCOME",
  "NET_WORTH",
  "LICENSED",
  "AFFILIATED",
];
export const FinancialStatusOptions = orderedStatusOptions.map((key) => {
  const { description, title } = BackendFinancialStatusOptions[key];
  return {
    value: key,
    description,
    title,
  };
});

export const NotificationMethods = Object.keys(NotificationMethodOptions);
