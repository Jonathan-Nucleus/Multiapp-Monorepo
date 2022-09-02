import { ApolloServer, gql } from "apollo-server-express";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import {
  createComment,
  createPost,
  createUser,
  DbCollection,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { Post } from "../../../schemas/post";
import { toObjectId } from "../../../lib/mongo-helper";
import { Comment } from "../../../schemas/comment";

describe("Mutations - deleteComment", () => {
  const query = gql`
    mutation DeleteComment($commentId: ID!) {
      deleteComment(commentId: $commentId)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user1: User.Mongo;
  let post1: Post.Mongo;
  let comment1: Comment.Mongo;
  let comment2: Comment.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    user1 = await createUser();
    post1 = await createPost(authUser._id);
    comment1 = await createComment(authUser._id, post1._id);
    comment2 = await createComment(user1._id, post1._id);
    server = createTestApolloServer(authUser);
  });

  it("fails without comment id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {},
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with invalid comment id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        commentId: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "commentId")).toBeDefined();
  });

  it("fails with wrong comment id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        commentId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with wrong user", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        commentId: comment2._id.toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to delete a comment", async () => {
    const { db, comments } = await getIgniteDb();
    const oldCommentCount = await db
      .collection(DbCollection.COMMENTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        commentId: comment1._id.toString(),
      },
    });

    expect(res.data?.deleteComment).toBeTruthy();

    const newComment = await comments.find(toObjectId(comment1._id));
    expect(newComment).toBeNull();

    const newCommentCount = await db
      .collection(DbCollection.COMMENTS)
      .countDocuments();
    expect(newCommentCount).toBe(oldCommentCount); // Soft delete
  });
});
