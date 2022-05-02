import { gql, useMutation, MutationTuple } from '@apollo/client';
import {
  InvestorClassOptions,
  FinancialStatusOptions,
} from 'backend/graphql/enumerations.graphql';
import { QuestionnaireInput } from 'backend/graphql/users.graphql';
import {
  UserProfile,
  FinancialStatus,
  InvestorClass,
  InvestmentLevel,
} from 'backend/graphql/users.graphql';

export { InvestorClassOptions, FinancialStatusOptions };
export type { InvestorClass, FinancialStatus, InvestmentLevel };

type SaveQuestionnaireVariables = {
  questionnaire: QuestionnaireInput;
};

type SaveQuestionnaireData = {
  saveQuestionnaire: Pick<UserProfile, '_id'>;
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
        _id
      }
    }
  `);
}
