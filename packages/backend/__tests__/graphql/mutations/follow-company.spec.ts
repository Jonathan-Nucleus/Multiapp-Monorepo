import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import {
  createCompany,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";

import { getIgniteDb } from "../../../db";
import { toObjectId } from "../../../lib/mongo-helper";
import { Company } from "../../../schemas/company";

describe("Mutations - followCompany", () => {
  const query = gql`
    mutation FollowCompany($follow: Boolean!, $companyId: ID!) {
      followCompany(follow: $follow, companyId: $companyId)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user: User.Mongo;
  let company1: Company.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    user = await createUser();
    company1 = await createCompany(user._id);
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid company id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        follow: true,
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
        follow: true,
        companyId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to follow a company", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        follow: true,
        companyId: company1._id.toString(),
      },
    });

    expect(res.data?.followCompany).toBeTruthy();

    const { users, companies } = await getIgniteDb();

    const newUser1 = (await users.find({ _id: authUser._id })) as User.Mongo;
    const newCompany1 = (await companies.find(
      toObjectId(company1._id)
    )) as Company.Mongo;
    expect(
      _.map(newUser1.companyFollowingIds, (item) => item.toString())
    ).toContain(company1._id.toString());
    expect(_.map(newCompany1.followerIds, (item) => item.toString())).toContain(
      authUser._id.toString()
    );
  });

  it("succeeds to unfollow a user", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        follow: false,
        companyId: company1._id.toString(),
      },
    });

    expect(res.data?.followCompany).toBeTruthy();

    const { users, companies } = await getIgniteDb();

    const newUser1 = (await users.find({ _id: authUser._id })) as User.Mongo;
    const newCompany1 = (await companies.find(
      toObjectId(company1._id)
    )) as Company.Mongo;
    expect(
      _.map(newUser1.companyFollowingIds, (item) => item.toString())
    ).not.toContain(company1._id.toString());
    expect(
      _.map(newCompany1.followerIds, (item) => item.toString())
    ).not.toContain(authUser._id.toString());
  });
});
