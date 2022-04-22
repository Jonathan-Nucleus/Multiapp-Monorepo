import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { Post } from "../../../schemas/post";
import {
  createCompany,
  createPost,
  createUser,
  getErrorCode,
} from "../../config/utils";
import { Company } from "../../../schemas/company";
import { ErrorCode } from "../../../lib/validate";

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
  let authUser: User.Mongo | null;
  let company1: Company.Mongo | null;
  let post1: Post.Mongo | null;

  beforeAll(async () => {
    authUser = await createUser();
    company1 = await createCompany(authUser?._id);
    post1 = await createPost(authUser?._id);
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
    expect(res.data?.account.companies[0]._id).toBe(company1?._id.toString());
    expect(res.data?.account.companies[0].name).toBe(company1?.name);
    if (!post1?.featured) {
      expect(res.data?.account.posts[0]._id).toBe(post1?._id.toString());
    }
  });

  it("succeeds to get a profile with featured posts", async () => {
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
    expect(res.data?.account.companies[0]._id).toBe(company1?._id.toString());
    expect(res.data?.account.companies[0].name).toBe(company1?.name);
    if (post1?.featured) {
      expect(res.data?.account.posts[0]._id).toBe(post1?._id.toString());
    }
  });
});
