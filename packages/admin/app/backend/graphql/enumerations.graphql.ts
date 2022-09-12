import {
  AccreditationOptions as BackendAccreditationOptions,
  AccreditationEnum,
  UserRoleEnum,
} from "../schemas/user";
export * from "backend/graphql/enumerations.graphql";

const orderedAccreditationOptions: AccreditationEnum[] = [
  "NONE",
  "ACCREDITED",
  "QUALIFIED_CLIENT",
  "QUALIFIED_PURCHASER",
];
export const AccreditationOptions = orderedAccreditationOptions.map((acc) => {
  const { label } = BackendAccreditationOptions[acc];
  return {
    label,
    value: acc,
  };
});
export type { AccreditationEnum as Accreditation };

const UserRoleOptions: { label: string; value: UserRoleEnum }[] = [
  { label: "User", value: "USER" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Pro", value: "PROFESSIONAL" },
  { label: "FA", value: "FA" },
  { label: "FO", value: "FO" },
  { label: "IA", value: "IA" },
  { label: "RIA", value: "RIA" },
];
export { UserRoleOptions };
export type { UserRoleEnum as UserRole };
