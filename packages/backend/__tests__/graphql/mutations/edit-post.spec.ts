import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import {
  createPost,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { Post } from "../../../schemas/post";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Mutations - editPost", () => {
  const query = gql`
    mutation EditPost($post: PostUpdate!) {
      editPost(post: $post) {
        _id
        audience
        body
        mediaUrl
        categories
        mentionIds
        updatedAt
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  let user: User.Mongo | null;
  let post1: Post.Mongo | null;
  const postData = {
    body: faker.lorem.sentence(),
    audience: "EVERYONE",
    categories: ["NEWS"],
    mediaUrl: "test.png",
    mentionIds: [toObjectId().toString()],
  };

  beforeAll(async () => {
    authUser = await createUser();
    user = await createUser();
    post1 = await createPost(authUser?._id);
    server = createTestApolloServer(authUser);
  });

  it("fails without post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with invalid post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: "test",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "post._id")).toBeDefined();
  });

  it("fails with invalid mention ids", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: toObjectId().toString(),
          mentionIds: ["test"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "post.mentionIds[0]")).toBeDefined();
  });

  it("fails with without body", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          _id: toObjectId().toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with wrong post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: toObjectId().toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("returns post with updated body", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: post1?._id.toString(),
        },
      },
    });

    expect(res.data?.editPost?.body).toBe(postData.body);

    const { posts } = await getIgniteDb();

    const newPost = await posts.find(toObjectId(post1?._id));
    expect(newPost?.body).toBe(postData.body);
    expect(newPost?.updatedAt?.toISOString()).not.toBe(
      post1?.updatedAt?.toISOString()
    );
  });
});
