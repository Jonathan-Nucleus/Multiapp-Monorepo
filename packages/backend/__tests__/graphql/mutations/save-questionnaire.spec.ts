import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode } from "../../config/utils";
import { getIgniteDb } from "../../../db";

describe("Mutations - saveQuestionnaire", () => {
  const query = gql`
    mutation SaveQuestionnaire($questionnaire: QuestionnaireInput!) {
      saveQuestionnaire(questionnaire: $questionnaire) {
        _id
        accreditation
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  const questionnaireData = {
    class: "INDIVIDUAL",
    status: ["MIN_INCOME"],
    date: new Date().toISOString(),
  };

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("fails with empty class", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
          class: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with empty level", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
          level: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with empty date", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
          date: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with for advisor with no request data", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
          class: "advisor",
          level: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("succeeds with empty status", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
          status: [],
        },
      },
    });

    expect(res.data?.saveQuestionnaire.accreditation).toBe("NONE");

    const { users } = await getIgniteDb();
    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    expect(newUser.questionnaire?.class).toBe("individual");
    expect(newUser.questionnaire?.status).toHaveLength(0);
    expect(newUser.questionnaire?.date.toString()).toBe(
      new Date(questionnaireData.date).toString()
    );
  });

  it("succeeds with non-empty status", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
        },
      },
    });

    expect(res.data?.saveQuestionnaire.accreditation).toBe("ACCREDITED");

    const { users } = await getIgniteDb();
    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    expect(newUser.questionnaire?.class).toBe("individual");
    expect(newUser.questionnaire?.status).toHaveLength(1);
    expect(newUser.questionnaire?.status[0]).toBe("200K+");
    expect(newUser.questionnaire?.date.toString()).toBe(
      new Date(questionnaireData.date).toString()
    );
  });

  it("succeeds with duplicated statuses", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
          status: ["MIN_INCOME", "MIN_INCOME"],
        },
      },
    });

    expect(res.data?.saveQuestionnaire.accreditation).toBe("ACCREDITED");

    const { users } = await getIgniteDb();
    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    expect(newUser.questionnaire?.class).toBe("individual");
    expect(newUser.questionnaire?.status).toHaveLength(1);
    expect(newUser.questionnaire?.status[0]).toBe("200K+");
    expect(newUser.questionnaire?.date.toString()).toBe(
      new Date(questionnaireData.date).toString()
    );
  });

  it("succeeds with tier-1 level", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
          status: ["TIER1"],
        },
      },
    });

    expect(res.data?.saveQuestionnaire.accreditation).toBe("QUALIFIED_CLIENT");
  });

  it("succeeds with tier-2 level", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        questionnaire: {
          ...questionnaireData,
          status: ["TIER2"],
        },
      },
    });

    expect(res.data?.saveQuestionnaire.accreditation).toBe(
      "QUALIFIED_PURCHASER"
    );
  });
});
