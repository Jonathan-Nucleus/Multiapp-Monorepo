import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import { Company } from "../../../schemas/company";
import {
  createPost,
  createUser,
  createCompany,
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
        media {
          url
          aspectRatio
        }
        categories
        mentionIds
        updatedAt
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let authCompany: Company.Mongo;
  let user: User.Mongo;
  let company1: Company.Mongo;
  let post1: Post.Mongo;
  let post2: Post.Mongo;
  let post3: Post.Mongo;
  let post4: Post.Mongo;

  const postData = {
    body: faker.lorem.sentence(),
    audience: "EVERYONE",
    categories: ["NEWS"],
    media: {
      url: "test.png",
      aspectRatio: 1.58,
    },
    mentionIds: [toObjectId().toString()],
  };

  beforeAll(async () => {
    authUser = await createUser();
    authCompany = await createCompany(authUser._id);
    user = await createUser();
    company1 = await createCompany(user._id);
    post1 = await createPost(authUser._id);
    post2 = await createPost(authCompany._id, true);
    post3 = await createPost(user._id);
    post4 = await createPost(company1._id, true);
    server = createTestApolloServer(authUser);
  });

  it("fails without post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          userId: authUser._id.toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails without user id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: toObjectId().toString(),
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
          userId: authUser._id.toString(),
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
          userId: authUser._id.toString(),
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
          userId: authUser._id.toString(),
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
          userId: authUser._id.toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with unauthorized user", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: post3._id.toString(),
          userId: authUser._id.toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with unauthorized user for company post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: post4._id.toString(),
          userId: company1._id.toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_REQUEST);
  });

  it("returns post with updated body", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: post1._id.toString(),
          userId: authUser._id.toString(),
        },
      },
    });

    expect(res.data?.editPost?.body).toBe(postData.body);

    const { posts } = await getIgniteDb();

    const newPost = await posts.find(toObjectId(post1._id));
    expect(newPost?.body).toBe(postData.body);
    expect(newPost?.updatedAt?.toISOString()).not.toBe(
      post1?.updatedAt?.toISOString()
    );
  });

  it("succeeds for user company post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          _id: post2._id.toString(),
          userId: authCompany._id.toString(),
        },
      },
    });

    expect(res.data?.editPost?.body).toBe(postData.body);

    const { posts } = await getIgniteDb();

    const newPost = await posts.find(toObjectId(post1._id));
    expect(newPost?.body).toBe(postData.body);
    expect(newPost?.updatedAt?.toISOString()).not.toBe(
      post1?.updatedAt?.toISOString()
    );
  });
});
