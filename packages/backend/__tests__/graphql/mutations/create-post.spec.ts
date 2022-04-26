import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import {
  createUser,
  DbCollection,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { AudienceOptions, PostCategoryOptions } from "../../../schemas/post";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Mutations - createPost", () => {
  const query = gql`
    mutation CreatePost($post: PostInput!) {
      createPost(post: $post) {
        _id
        body
        mediaUrl
        likeIds
        commentIds
        createdAt
        categories
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  const postData = {
    audience: Object.keys(AudienceOptions)[0],
    categories: [Object.keys(PostCategoryOptions)[0]],
    body: "test post body",
    mediaUrl: "test.png",
    mentionIds: [toObjectId().toString()],
  };

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid audience", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          audience: "test",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with invalid categories", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          categories: ["test"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with invalid mention ids", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          mentionIds: ["test"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "post.mentionIds[0]")).toBeDefined();
  });

  it("returns new post data", async () => {
    const { users, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
        },
      },
    });

    expect(res.data?.createPost?.body).toBe(postData.body);
    expect(JSON.stringify(res.data?.createPost?.categories)).toBe(
      JSON.stringify(postData.categories)
    );
    expect(res.data?.createPost?.mediaUrl).toBe(postData.mediaUrl);

    const newUser = (await users.find({ _id: authUser?._id })) as User.Mongo;
    const newPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    expect(newUser.postIds?.map((id) => id.toString())).toContain(
      res.data?.createPost._id
    );
    expect(newPostCount).toBe(oldPostCount + 1);
  });
});
