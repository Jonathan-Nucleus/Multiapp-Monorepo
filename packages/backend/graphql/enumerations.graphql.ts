import {
  AudienceOptions,
  AudienceEnum,
  PostCategoryOptions,
  PostCategoryEnum,
} from "../schemas/post";

import {
  AssetClassOptions,
  AssetClassEnum,
  DocumentCategoryOptions,
  DocumentCategoryEnum,
} from "../schemas/fund";

import { NotificationMethodOptions } from "../schemas/user";

import {
  InvestorClassEnum,
  FinancialStatusEnum,
  FinancialStatusOptions as BackendFinancialStatusOptions,
  InvestorClassOptions as BackendInvestorClassOptions,
} from "../schemas/user";

import {
  HelpRequestTypeOptions as BackendHelpRequestTypeOptions,
  HelpRequestTypeEnum,
} from "../schemas/help-request";

export const Audiences: AudienceEnum[] = Object.keys(AudienceOptions);
export const PostCategories = Object.keys(PostCategoryOptions).reduce(
  (acc, category) => {
    acc[category] = PostCategoryOptions[category].label;
    return acc;
  },
  {} as Record<PostCategoryEnum, string>
);

const orderedAssetClasses: AssetClassEnum[] = ["PE", "HEDGE", "CREDIT"];
export const AssetClasses = orderedAssetClasses.map((assetClass) => {
  const { label } = AssetClassOptions[assetClass];
  return {
    label,
    value: assetClass,
  };
});
export type { AssetClassEnum as AssetClass };

const orderedDocumentCategoryOptions: DocumentCategoryEnum[] = [
  "PRESENTATION",
  "PERFORMANCE",
  "INVESTOR_LETTER",
  "OPERATIONAL",
  "OTHER",
];
export const DocumentCategories = orderedDocumentCategoryOptions.map(
  (category) => {
    const { label } = DocumentCategoryOptions[category];
    return {
      label,
      value: category,
    };
  }
);
export type { DocumentCategoryEnum as DocumentCategory };

const orderedInvestorClassOptions: InvestorClassEnum[] = [
  "INDIVIDUAL",
  "ENTITY",
  "ADVISOR",
];
export type { InvestorClassEnum as InvestorClass };
export const InvestorClassOptions = orderedInvestorClassOptions.map((key) => {
  const { label } = BackendInvestorClassOptions[key];
  return {
    label,
    value: key,
  };
});

const baseIndividualStatusOptions = [
  "MIN_INCOME",
  "NET_WORTH",
  "LICENSED",
  "AFFILIATED",
] as const;
const baseEntityStatusOptions = [
  "ASSETS",
  "AI_OWNERS",
  "LICENSED",
  "AFFILIATED",
] as const;
const advancedIndividualStatusOptions = ["TIER1", "TIER2"] as const;
const advancedEntityStatusOptions = [
  "QP_OWNERS",
  "TIER1_AI_OWNERS",
  "TRUST_ASSETS",
  "TIER3",
] as const;

export type { FinancialStatusEnum as FinancialStatus };
export const FinancialStatusOptions = Object.keys(
  BackendFinancialStatusOptions
);

export const BaseFinancialStatusData = {
  INDIVIDUAL: baseIndividualStatusOptions.map((key) => {
    const { description, title } = BackendFinancialStatusOptions[key];
    return {
      value: key,
      description,
      title,
    };
  }),
  ENTITY: baseEntityStatusOptions.map((key) => {
    const { description, title } = BackendFinancialStatusOptions[key];
    return {
      value: key,
      description,
      title,
    };
  }),
} as const;
export const AdvancedFinancialStatusData = {
  INDIVIDUAL: advancedIndividualStatusOptions.map((key) => {
    const { description, title } = BackendFinancialStatusOptions[key];
    return {
      value: key,
      description,
      title,
    };
  }),
  ENTITY: advancedEntityStatusOptions.map((key) => {
    const { description, title } = BackendFinancialStatusOptions[key];
    return {
      value: key,
      description,
      title,
    };
  }),
} as const;

export const NotificationMethods = Object.keys(NotificationMethodOptions);

export const HelpRequestTypeOptions = Object.keys(
  BackendHelpRequestTypeOptions
);
export type { HelpRequestTypeEnum as HelpRequestType };
