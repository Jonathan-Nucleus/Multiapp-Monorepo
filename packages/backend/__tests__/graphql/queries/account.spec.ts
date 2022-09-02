import { ApolloServer, gql } from "apollo-server-express";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { User } from "../../../schemas/user";
import { Post } from "../../../schemas/post";
import {
  createCompany,
  createPost,
  createUser,
  DbCollection,
  getErrorCode,
} from "../../config/utils";
import { Company } from "../../../schemas/company";
import { ErrorCode } from "../../../lib/apollo/validate";
import { getIgniteDb } from "../../../db";

describe("Query - account", () => {
  const query = gql`
    query Account($featured: Boolean) {
      account {
        firstName
        lastName
        avatar
        role
        accreditation
        position
        companies {
          _id
          name
          avatar
        }
        posts(featured: $featured) {
          _id
        }
      }
    }
  `;

  let server: ApolloServer;
  let publicServer: ApolloServer;
  let authUser: User.Mongo;
  let company1: Company.Mongo;
  let post1: Post.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    company1 = await createCompany(authUser._id);
    post1 = await createPost(authUser._id);
    server = createTestApolloServer(authUser);
    publicServer = createTestApolloServer();
  });

  it("fails with unauthenticated call", async () => {
    const res = await publicServer.executeOperation({
      query,
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNAUTHENTICATED);
  });

  it("succeeds to get a profile with posts", async () => {
    const { db } = await getIgniteDb();

    await db
      .collection(DbCollection.POSTS)
      .updateOne({ _id: post1._id }, { $set: { featured: false } });

    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.account.firstName).toBe(authUser?.firstName);
    expect(res.data?.account.lastName).toBe(authUser?.lastName);
    expect(res.data?.account.avatar).toBe(authUser?.avatar);
    expect(res.data?.account.role).toBe(authUser?.role.toUpperCase());
    expect(res.data?.account.accreditation).toBe(
      authUser?.accreditation.toUpperCase()
    );
    expect(res.data?.account.position).toBe(authUser?.position);
    expect(res.data?.account.companies[0]._id).toBe(company1._id.toString());
    expect(res.data?.account.companies[0].name).toBe(company1?.name);

    expect(res.data?.account.posts[0]._id).toBe(post1._id.toString());
  });

  it("succeeds to get a profile with featured posts", async () => {
    const { db } = await getIgniteDb();

    await db
      .collection(DbCollection.POSTS)
      .updateOne({ _id: post1._id }, { $set: { featured: true } });

    const res = await server.executeOperation({
      query,
      variables: {
        featured: true,
      },
    });

    expect(res.data?.account.firstName).toBe(authUser?.firstName);
    expect(res.data?.account.lastName).toBe(authUser?.lastName);
    expect(res.data?.account.avatar).toBe(authUser?.avatar);
    expect(res.data?.account.role).toBe(authUser?.role.toUpperCase());
    expect(res.data?.account.accreditation).toBe(
      authUser?.accreditation.toUpperCase()
    );
    expect(res.data?.account.position).toBe(authUser?.position);
    expect(res.data?.account.companies[0]._id).toBe(company1._id.toString());
    expect(res.data?.account.companies[0].name).toBe(company1?.name);

    expect(res.data?.account.posts[0]._id).toBe(post1._id.toString());
  });
});
