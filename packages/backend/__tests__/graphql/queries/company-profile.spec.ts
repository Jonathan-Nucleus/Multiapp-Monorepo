import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import {
  createCompany,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { Company } from "../../../schemas/company";
import { ErrorCode } from "../../../lib/validate";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Query - companyProfile", () => {
  const query = gql`
    query CompanyProfile($companyId: ID!) {
      companyProfile(companyId: $companyId) {
        name
        avatar
        members {
          _id
          firstName
          lastName
          avatar
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user1: User.Mongo;
  let company1: Company.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    user1 = await createUser();
    company1 = await createCompany(user1._id);
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid company id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        companyId: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "companyId")).toBeDefined();
  });

  it("fails with wrong company id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        companyId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to get a profile with members", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        companyId: company1._id.toString(),
      },
    });

    expect(res.data?.companyProfile.name).toBe(company1?.name);
    const memberIds = _.map(res.data?.companyProfile.members, "_id");
    expect(memberIds).toContain(user1._id.toString());
    expect(memberIds).not.toContain(authUser._id.toString());
  });
});
