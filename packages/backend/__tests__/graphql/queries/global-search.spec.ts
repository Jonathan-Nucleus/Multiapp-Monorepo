import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import {
  createCompany,
  createFund,
  createPost,
  createUser,
} from "../../config/utils";
import { Company } from "../../../schemas/company";
import { Fund } from "../../../schemas/fund";
import { getIgniteDb } from "../../../db";
import { Post } from "../../../schemas/post";

describe("Query - globalSearch", () => {
  const query = gql`
    query GlobalSearch($search: String) {
      globalSearch(search: $search) {
        users {
          _id
          firstName
          lastName
        }
        companies {
          _id
          name
        }
        posts {
          _id
          body
        }
        funds {
          _id
          name
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  let userData: User.Mongo[];
  let companyData: Company.Mongo[];
  let postData: Post.Mongo[];
  let fundData: Fund.Mongo[];

  beforeAll(async () => {
    authUser = await createUser();
    userData = (await Promise.all([
      await createUser(),
      await createUser(),
      await createUser(),
      await createUser(),
      await createUser(),
    ])) as User.Mongo[];
    companyData = (await Promise.all([
      await createCompany(),
      await createCompany(),
      await createCompany(),
      await createCompany(),
      await createCompany(),
    ])) as Company.Mongo[];
    postData = (await Promise.all([
      await createPost(),
      await createPost(),
      await createPost(),
      await createPost(),
      await createPost(),
    ])) as Post.Mongo[];
    fundData = (await Promise.all([
      await createFund(),
      await createFund(),
      await createFund(),
      await createFund(),
      await createFund(),
    ])) as Fund.Mongo[];
    server = createTestApolloServer(authUser);
  });

  it("succeeds to get global serarch result", async () => {
    const { users, posts, companies, funds } = await getIgniteDb();

    const spy1 = jest
      .spyOn(users, "findByKeyword")
      .mockResolvedValueOnce(userData);
    const spy2 = jest
      .spyOn(companies, "findByKeyword")
      .mockResolvedValueOnce(companyData);
    const spy3 = jest
      .spyOn(posts, "findByKeyword")
      .mockResolvedValueOnce(postData);
    const spy4 = jest
      .spyOn(funds, "findByKeyword")
      .mockResolvedValueOnce(fundData);

    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.globalSearch.users).toHaveLength(userData.length);
    expect(res.data?.globalSearch.companies).toHaveLength(companyData.length);
    expect(res.data?.globalSearch.posts).toHaveLength(postData.length);
    expect(res.data?.globalSearch.funds).toHaveLength(fundData.length);

    spy1.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
    spy4.mockRestore();
  });

  it("succeeds to get global serarch result with search keyword", async () => {
    const { users, posts, companies, funds } = await getIgniteDb();

    const spy1 = jest
      .spyOn(users, "findByKeyword")
      .mockResolvedValueOnce(userData.slice(0, 1));
    const spy2 = jest
      .spyOn(companies, "findByKeyword")
      .mockResolvedValueOnce(companyData.slice(0, 2));
    const spy3 = jest
      .spyOn(posts, "findByKeyword")
      .mockResolvedValueOnce(postData.slice(0, 3));
    const spy4 = jest
      .spyOn(funds, "findByKeyword")
      .mockResolvedValueOnce(fundData.slice(0, 4));

    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.globalSearch.users).toHaveLength(1);
    expect(res.data?.globalSearch.companies).toHaveLength(2);
    expect(res.data?.globalSearch.posts).toHaveLength(3);
    expect(res.data?.globalSearch.funds).toHaveLength(4);

    spy1.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
    spy4.mockRestore();
  });
});
