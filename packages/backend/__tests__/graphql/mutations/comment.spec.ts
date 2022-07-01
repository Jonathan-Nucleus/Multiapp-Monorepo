import { ApolloServer, gql } from "apollo-server";
import * as FirebaseModule from "../../../lib/firebase-helper";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
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

jest.mock("firebase-admin");

describe("Mutations - comment", () => {
  const query = gql`
    mutation Comment($comment: CommentInput!) {
      comment(comment: $comment) {
        _id
        body
        likeIds
        mentions {
          _id
          firstName
          lastName
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user: User.Mongo;
  let post1: Post.Mongo;
  const commentData = {
    body: "test post body",
    mentionIds: [toObjectId().toString()],
  };

  beforeAll(async () => {
    authUser = await createUser();
    user = await createUser();
    post1 = await createPost(authUser._id);
    server = createTestApolloServer(authUser);
  });

  it("fails without post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with invalid post id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
          postId: toObjectId().toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with invalid mention ids", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
          postId: post1._id.toString(),
          mentionIds: ["test"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "comment.mentionIds[0]")).toBeDefined();
  });

  it("fails with invalid comment id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
          postId: post1._id.toString(),
          commentId: "test",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "comment.commentId")).toBeDefined();
  });

  it("returns new comment data", async () => {
    const spy = jest
      .spyOn(FirebaseModule, "sendPushNotification")
      .mockResolvedValueOnce(undefined);

    const { posts, db } = await getIgniteDb();
    const oldCommentCount = await db
      .collection(DbCollection.COMMENTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
          postId: post1._id.toString(),
          mentionIds: [user._id.toString()],
        },
      },
    });

    expect(res.data?.comment?.body).toBe(commentData.body);
    expect(res.data?.comment?.mentions[0]._id).toBe(user._id.toString());

    const newPost = (await posts.find(toObjectId(post1._id))) as Post.Mongo;

    const newCommentCount = await db
      .collection(DbCollection.COMMENTS)
      .countDocuments();

    expect(newPost.commentIds?.map((id) => id.toString())).toContain(
      res.data?.comment._id
    );
    expect(newCommentCount).toBe(oldCommentCount + 1);

    spy.mockRestore();
  });
});
