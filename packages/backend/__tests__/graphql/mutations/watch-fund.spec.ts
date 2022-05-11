import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import {
  createCompany,
  createFund,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { toObjectId } from "../../../lib/mongo-helper";
import { Company } from "../../../schemas/company";
import { Fund } from "../../../schemas/fund";
import { getIgniteDb } from "../../../db";

describe("Mutations - watchFund", () => {
  const query = gql`
    mutation WatchFund($watch: Boolean!, $fundId: ID!) {
      watchFund(watch: $watch, fundId: $fundId) {
        _id
        watchlistIds
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let company1: Company.Mongo;
  let fund1: Fund.Mongo;
  let fund2: Fund.Mongo;

  beforeAll(async () => {
    authUser = await createUser("user", "client");
    company1 = await createCompany(authUser._id);
    fund1 = await createFund(authUser._id, company1._id);
    fund2 = await createFund(authUser._id, company1._id, "purchaser");
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid fund id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: "test",
        watch: true,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "fundId")).toBeDefined();
  });

  it("fails with non-boolean watch value", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: toObjectId().toString(),
        watch: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with wrong fund id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: toObjectId().toString(),
        watch: true,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails without proper accreditation level", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: fund2._id.toString(),
        watch: true,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });

  it("succeeds to watch a fund", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: fund1._id.toString(),
        watch: true,
      },
    });

    expect(res.data?.watchFund).toBeDefined();

    const { users } = await getIgniteDb();
    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(_.map(newUser.watchlistIds, (item) => item.toString())).toContain(
      fund1._id.toString()
    );
    expect(res.data?.watchFund?.watchlistIds).toContain(fund1._id.toString());
  });

  it("succeeds to unwatch a fund", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: fund1._id.toString(),
        watch: false,
      },
    });

    expect(res.data?.watchFund).toBeDefined();

    const { users } = await getIgniteDb();
    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(
      _.map(newUser.watchlistIds, (item) => item.toString())
    ).not.toContain(fund1._id.toString());
    expect(res.data?.watchFund?.watchlistIds).not.toContain(
      fund1._id.toString()
    );
  });
});
