import { gql, useMutation, MutationTuple } from "@apollo/client";
import {
  InvestorClassOptions,
  FinancialStatusOptions,
  HelpRequestType,
  HelpRequestTypeOptions,
} from "backend/graphql/enumerations.graphql";
import { QuestionnaireInput } from "backend/graphql/users.graphql";
import {
  User,
  FinancialStatus,
  InvestorClass,
  Accreditation,
} from "backend/graphql/users.graphql";

export { InvestorClassOptions, FinancialStatusOptions };
export type { InvestorClass, FinancialStatus, Accreditation };
export type ContactMethod = HelpRequestType;
export const ContactMethodOptions = HelpRequestTypeOptions;

type SaveQuestionnaireVariables = {
  questionnaire: QuestionnaireInput;
};

type SaveQuestionnaireData = {
  saveQuestionnaire: Pick<User, "accreditation">;
};

/**
 * GraphQL mutation that saves questionnarie
 *
 * @returns   GraphQL mutation.
 */
export function useSaveQuestionnaire(): MutationTuple<
  SaveQuestionnaireData,
  SaveQuestionnaireVariables
> {
  return useMutation<SaveQuestionnaireData, SaveQuestionnaireVariables>(gql`
    mutation SaveQuestionnaire($questionnaire: QuestionnaireInput!) {
      saveQuestionnaire(questionnaire: $questionnaire) {
        accreditation
      }
    }
  `);
}
