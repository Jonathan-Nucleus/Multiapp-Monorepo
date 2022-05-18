import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { Post } from "../../../schemas/post";
import { Company } from "../../../schemas/company";
import {
  createUser,
  createPost,
  createCompany,
  DbCollection,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { AudienceOptions, PostCategoryOptions } from "../../../schemas/post";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Mutations - sharePost", () => {
  const query = gql`
    mutation SharePost($postId: ID!, $post: SharePostInput!) {
      sharePost(postId: $postId, post: $post) {
        _id
        isCompany
        audience
        body
        createdAt
        categories
        user {
          _id
        }
        company {
          _id
        }
        sharedPost {
          _id
          categories
          audience
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let authCompany: Company.Mongo;
  let post1: Post.Mongo;
  let user1: User.Mongo;
  let company1: Company.Mongo;

  const sharePostData = {
    body: "test post body",
    mentionIds: [toObjectId().toString()],
  };

  beforeAll(async () => {
    authUser = await createUser();
    user1 = await createUser();
    authCompany = await createCompany(authUser._id);
    post1 = await createPost(user1._id);
    company1 = await createCompany(user1._id);
    server = createTestApolloServer(authUser);
  });

  it("fails with no post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...sharePostData,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with invalid post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: "test",
        post: {
          ...sharePostData,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with media", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: toObjectId().toString(),
        post: {
          ...sharePostData,
          media: {
            url: "test.png",
            aspectRatio: 1.58,
          },
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with audience", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: toObjectId().toString(),
        post: {
          ...sharePostData,
          audience: Object.keys(AudienceOptions)[0],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with categories", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: toObjectId().toString(),
        post: {
          ...sharePostData,
          categories: [Object.keys(PostCategoryOptions)[0]],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with invalid mention ids", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: toObjectId().toString(),
        post: {
          ...sharePostData,
          mentionIds: ["test"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "post.mentionIds[0]")).toBeDefined();
  });

  it("fails to share as another user's company", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: toObjectId().toString(),
        post: {
          ...sharePostData,
          companyId: company1._id.toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_REQUEST);
  });

  it("shares a post as a user", async () => {
    const { users, posts, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        postId: post1._id.toString(),
        post: {
          ...sharePostData,
        },
      },
    });

    expect(res.data?.sharePost?.body).toBe(sharePostData.body);
    expect(res.data?.sharePost?.sharedPost._id).toBe(post1._id.toString());
    expect(res.data?.sharePost?.audience).toBe(
      res.data?.sharePost?.sharedPost?.audience
    );
    expect(res.data?.sharePost?.categories).toStrictEqual(
      res.data?.sharePost?.sharedPost?.categories
    );
    expect(res.data?.sharePost?.user._id).toBe(authUser._id.toString());

    const newUser = (await users.find({
      _id: authUser._id,
    })) as User.Mongo | null;
    if (!newUser) {
      throw new Error("Cannot find original post creator");
    }

    const newPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    expect(newUser.postIds).toContainEqual(toObjectId(res.data?.sharePost._id));
    expect(newPostCount).toBe(oldPostCount + 1);

    const newPost = await posts.find(post1._id);
    if (!newPost) {
      throw new Error("Cannot find original post");
    }
    expect(newPost.shareIds).toContainEqual(
      toObjectId(res.data?.sharePost?._id)
    );
  });

  it("shares a post as a company", async () => {
    const { companies, posts, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        postId: post1._id.toString(),
        post: {
          ...sharePostData,
          companyId: authCompany._id.toString(),
        },
      },
    });

    expect(res.data?.sharePost?.body).toBe(sharePostData.body);
    expect(res.data?.sharePost?.sharedPost._id).toBe(post1._id.toString());
    expect(res.data?.sharePost?.audience).toBe(
      res.data?.sharePost?.sharedPost?.audience
    );
    expect(res.data?.sharePost?.categories).toStrictEqual(
      res.data?.sharePost?.sharedPost?.categories
    );
    expect(res.data?.sharePost?.company._id).toBe(authCompany._id.toString());

    const newCompany = (await companies.find(
      authCompany._id
    )) as Company.Mongo | null;
    if (!newCompany) {
      throw new Error("Cannot find original post creator");
    }

    const newPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    expect(newCompany.postIds).toContainEqual(
      toObjectId(res.data?.sharePost._id)
    );
    expect(newPostCount).toBe(oldPostCount + 1);

    const newPost = await posts.find(post1._id);
    if (!newPost) {
      throw new Error("Cannot find original post");
    }
    expect(newPost.shareIds).toContainEqual(
      toObjectId(res.data?.sharePost?._id)
    );
  });
});
