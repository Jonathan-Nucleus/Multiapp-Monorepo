import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { Post } from "../../../schemas/post";
import {
  createPost,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Mutations - featurePost", () => {
  const query = gql`
    mutation FeaturePost($postId: ID!, $feature: Boolean!) {
      featurePost(postId: $postId, feature: $feature) {
        _id
        featured
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  let user: User.Mongo | null;
  let post1: Post.Mongo | null;
  let post2: Post.Mongo | null;

  beforeAll(async () => {
    authUser = await createUser();
    user = await createUser();
    post1 = await createPost(authUser?._id);
    post2 = await createPost(user?._id);
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: "test",
        feature: true,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "postId")).toBeDefined();
  });

  it("fails with non-boolean feature value", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: toObjectId().toString(),
        feature: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with wrong post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: post2?._id.toString(),
        feature: true,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("returns featured post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: post1?._id.toString(),
        feature: true,
      },
    });

    expect(res.data?.featurePost._id.toString()).toBe(post1?._id.toString());
    expect(res.data?.featurePost.featured).toBeTruthy();
  });

  it("returns unfeatured post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: post1?._id.toString(),
        feature: false,
      },
    });

    expect(res.data?.featurePost._id.toString()).toBe(post1?._id.toString());
    expect(res.data?.featurePost.featured).toBeFalsy();
  });
});
