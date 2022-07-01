import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
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
import { getIgniteDb } from "../../../db";

describe("Mutations - hidePost", () => {
  const query = gql`
    mutation HidePost($hide: Boolean!, $postId: ID!) {
      hidePost(hide: $hide, postId: $postId)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let post1: Post.Mongo;
  const hideData = {
    postId: toObjectId().toString(),
    hide: true,
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
        ...hideData,
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
        ...hideData,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to hide a post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        ...hideData,
        postId: post1._id.toString(),
      },
    });

    expect(res.data?.hidePost).toBeTruthy();

    const { users } = await getIgniteDb();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(_.map(newUser.hiddenPostIds, (item) => item.toString())).toContain(
      post1._id.toString()
    );
  });

  it("fails to hide a post that was already hidden", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        ...hideData,
        postId: post1._id.toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
  });

  it("succeeds to unhide a post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        hide: false,
        postId: post1._id.toString(),
      },
    });

    expect(res.data?.hidePost).toBeTruthy();

    const { users } = await getIgniteDb();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(
      _.map(newUser.hiddenPostIds, (item) => item.toString())
    ).not.toContain(post1._id.toString());
  });
});
