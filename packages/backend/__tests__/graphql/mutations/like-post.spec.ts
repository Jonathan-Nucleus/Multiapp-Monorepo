import { ApolloServer, gql } from "apollo-server-express";
import * as FirebaseModule from "../../../lib/firebase-helper";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import { Post } from "../../../schemas/post";
import {
  createPost,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { toObjectId } from "../../../lib/mongo-helper";

jest.mock("firebase-admin");

describe("Mutations - likePost", () => {
  const query = gql`
    mutation LikePost($like: Boolean!, $postId: ID!) {
      likePost(like: $like, postId: $postId) {
        _id
        likeIds
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let post1: Post.Mongo;
  const likeData = {
    postId: toObjectId().toString(),
    like: true,
  };

  beforeAll(async () => {
    authUser = await createUser();
    post1 = await createPost(authUser._id);
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        ...likeData,
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
        ...likeData,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to like a post", async () => {
    const spy = jest
      .spyOn(FirebaseModule, "sendPushNotification")
      .mockResolvedValueOnce(undefined);

    const res = await server.executeOperation({
      query,
      variables: {
        ...likeData,
        postId: post1._id.toString(),
      },
    });

    expect(res.data?.likePost._id).toBe(post1._id.toString());
    expect(res.data?.likePost.likeIds).toContain(authUser._id.toString());

    spy.mockRestore();
  });

  it("succeeds to unlike a post", async () => {
    const spy = jest
      .spyOn(FirebaseModule, "sendPushNotification")
      .mockResolvedValueOnce(undefined);

    const res = await server.executeOperation({
      query,
      variables: {
        like: false,
        postId: post1._id.toString(),
      },
    });

    expect(res.data?.likePost._id).toBe(post1._id.toString());
    expect(res.data?.likePost.likeIds).not.toContain(authUser._id.toString());

    spy.mockRestore();
  });
});
