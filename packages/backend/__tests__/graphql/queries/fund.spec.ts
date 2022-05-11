import { ApolloServer, gql } from "apollo-server";
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

describe("Query - fund", () => {
  const query = gql`
    query Fund($fundId: ID!) {
      fund(fundId: $fundId) {
        _id
        name
        manager {
          _id
          firstName
          lastName
          avatar
        }
        company {
          _id
          name
          avatar
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let company1: Company.Mongo;
  let funds: Fund.Mongo[];

  beforeAll(async () => {
    authUser = await createUser("user", "accredited");
    company1 = await createCompany(authUser._id);
    funds = (await Promise.all([
      await createFund(authUser._id, company1._id, "accredited"),
      await createFund(authUser._id, company1._id, "client"),
    ])) as Fund.Mongo[];
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid fund id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "fundId")).toBeDefined();
  });

  it("fails with wrong fund id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to get a fund", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: funds[0]._id.toString(),
      },
    });

    expect(res.data?.fund._id).toBe(funds[0]._id.toString());
    expect(res.data?.fund.name).toBe(funds[0]?.name.toString());
    expect(res.data?.fund.manager._id).toBe(authUser._id.toString());
    expect(res.data?.fund.manager.firstName).toBe(authUser?.firstName);
    expect(res.data?.fund.manager.lastName).toBe(authUser?.lastName);
    expect(res.data?.fund.company._id).toBe(company1._id.toString());
    expect(res.data?.fund.company.name).toBe(company1?.name);
  });

  it("fails to get a fund with non-permitted level", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        fundId: funds[1]._id.toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNPROCESSABLE_ENTITY);
  });
});
