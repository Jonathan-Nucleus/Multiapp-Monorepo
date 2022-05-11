import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
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
import { getIgniteDb } from "../../../db";

describe("Mutations - mutePost", () => {
  const query = gql`
    mutation MutePost($mute: Boolean!, $postId: ID!) {
      mutePost(mute: $mute, postId: $postId)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let post1: Post.Mongo;
  const muteData = {
    postId: toObjectId().toString(),
    mute: true,
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
        ...muteData,
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
        ...muteData,
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to mute a post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        ...muteData,
        postId: post1._id.toString(),
      },
    });

    expect(res.data?.mutePost).toBeTruthy();

    const { users } = await getIgniteDb();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(_.map(newUser.mutedPostIds, (item) => item.toString())).toContain(
      post1._id.toString()
    );
  });

  it("fails to mute a post that was already hidden", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        ...muteData,
        postId: post1._id.toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
  });

  it("succeeds to unmute a post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        mute: false,
        postId: post1._id.toString(),
      },
    });

    expect(res.data?.mutePost).toBeTruthy();

    const { users } = await getIgniteDb();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(
      _.map(newUser.mutedPostIds, (item) => item.toString())
    ).not.toContain(post1._id.toString());
  });
});
