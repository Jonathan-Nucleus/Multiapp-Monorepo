import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { PostViolationOptions, User } from "../../../schemas/user";
import { Post } from "../../../schemas/post";
import {
  createPost,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { MongoId, toObjectId } from "../../../lib/mongo-helper";
import { getIgniteDb } from "../../../db";

describe("Mutations - reportPost", () => {
  const query = gql`
    mutation ReportPost($report: ReportedPostInput!) {
      reportPost(report: $report)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user: User.Mongo;
  let post1: Post.Mongo;
  const reportData = {
    postId: toObjectId().toString(),
    violations: [Object.keys(PostViolationOptions)[0]],
    comments: faker.lorem.sentence(),
  };

  beforeAll(async () => {
    authUser = await createUser();
    user = await createUser();
    post1 = await createPost(user._id);
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        report: {
          ...reportData,
          postId: "test",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "report.postId")).toBeDefined();
  });

  it("fails with empty violation", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        report: {
          ...reportData,
          violations: [],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with empty comments", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        report: {
          ...reportData,
          comments: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "report.comments")).toBeDefined();
  });

  it("fails with wrong post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        report: {
          ...reportData,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to report a post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        report: {
          ...reportData,
          postId: post1._id.toString(),
        },
      },
    });

    expect(res.data?.reportPost).toBeTruthy();

    const { posts, users } = await getIgniteDb();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(
      _.map(newUser.reportedPosts, (item) => item.postId.toString())
    ).toContain(post1._id.toString());

    const newPost = await posts.find(post1._id as MongoId);
    expect(_.map(newPost?.reporterIds, (item) => item.toString())).toContain(
      authUser._id.toString()
    );
  });

  it("fails to report a post that was already reported", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        report: {
          ...reportData,
          postId: post1._id.toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
  });
});
