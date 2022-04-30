import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import {
  createPost,
  createUser,
  DbCollection,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { Post } from "../../../schemas/post";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Mutations - deletePost", () => {
  const query = gql`
    mutation DeletePost($postId: ID!) {
      deletePost(postId: $postId)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  let user1: User.Mongo | null;
  let post1: Post.Mongo | null;
  let post2: Post.Mongo | null;

  beforeAll(async () => {
    authUser = await createUser();
    user1 = await createUser();
    post1 = await createPost(authUser?._id);
    post2 = await createPost(user1?._id);
    server = createTestApolloServer(authUser);
  });

  it("fails without post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {},
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with invalid post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "postId")).toBeDefined();
  });

  it("fails with wrong post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with wrong user", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: post2?._id.toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to delete a post", async () => {
    const { posts, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        postId: post1?._id.toString(),
      },
    });

    expect(res.data?.deletePost).toBeTruthy();

    const newPost = await posts.find(toObjectId(post1?._id));
    expect(newPost).toBeNull();

    const newPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();
    expect(newPostCount).toBe(oldPostCount); // Soft delete
  });
});
