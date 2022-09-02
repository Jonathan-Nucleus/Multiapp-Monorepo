import { ApolloServer, gql } from "apollo-server-express";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { User } from "../../../schemas/user";
import {
  createCompany,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { Company } from "../../../schemas/company";
import { ErrorCode } from "../../../lib/apollo/validate";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Query - userProfile", () => {
  const query = gql`
    query UserProfile($userId: ID!) {
      userProfile(userId: $userId) {
        firstName
        lastName
        avatar
        position
        company {
          _id
          name
          avatar
        }
        companies {
          _id
          name
          avatar
        }
        linkedIn
        website
        twitter
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user1: User.Mongo;
  let company1: Company.Mongo;
  let company2: Company.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    user1 = await createUser();
    company1 = await createCompany(user1._id);
    company2 = await createCompany(user1._id);
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid user id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        userId: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "userId")).toBeDefined();
  });

  it("fails with wrong user id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        userId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to get a profile with companies", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        userId: user1._id.toString(),
      },
    });

    expect(res.data?.userProfile.firstName).toBe(user1?.firstName);
    expect(res.data?.userProfile.lastName).toBe(user1?.lastName);
    expect(res.data?.userProfile.avatar).toBe(user1?.avatar);
    expect(res.data?.userProfile.position).toBe(user1?.position);
    expect(res.data?.userProfile.createdAt).toBeFalsy();
    expect(res.data?.userProfile.company._id).toBe(company1._id.toString());
    const companyIds = _.map(res.data?.userProfile.companies, "_id");
    expect(companyIds).toContain(company1._id.toString());
    expect(companyIds).toContain(company2._id.toString());
  });
});
