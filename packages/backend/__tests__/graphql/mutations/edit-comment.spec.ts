import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import {
  createComment,
  createPost,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { Post } from "../../../schemas/post";
import { toObjectId } from "../../../lib/mongo-helper";
import { Comment } from "../../../schemas/comment";

describe("Mutations - editComment", () => {
  const query = gql`
    mutation EditComment($comment: CommentUpdate!) {
      editComment(comment: $comment) {
        _id
        body
        postId
        updatedAt
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let post1: Post.Mongo;
  let comment1: Comment.Mongo;
  const commentData = {
    body: faker.lorem.sentence(),
    mentionIds: [toObjectId().toString()],
  };

  beforeAll(async () => {
    authUser = await createUser();
    post1 = await createPost(authUser._id);
    comment1 = await createComment(authUser._id, post1._id);
    server = createTestApolloServer(authUser);
  });

  it("fails without comment id", async () => {
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

  it("fails with invalid comment id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
          _id: "test",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "comment._id")).toBeDefined();
  });

  it("fails with invalid mention ids", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
          _id: toObjectId().toString(),
          mentionIds: ["test"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "comment.mentionIds[0]")).toBeDefined();
  });

  it("fails with without body", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          _id: toObjectId().toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with empty body", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          _id: toObjectId().toString(),
          body: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "comment.body")).toBeDefined();
  });

  it("fails with wrong comment id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
          _id: toObjectId().toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("returns comment with updated body", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        comment: {
          ...commentData,
          _id: comment1._id.toString(),
        },
      },
    });

    expect(res.data?.editComment?.body).toBe(commentData.body);
    expect(res.data?.editComment?.postId).toBe(post1._id.toString());

    const { comments } = await getIgniteDb();

    const newComment = await comments.find(toObjectId(comment1._id));
    expect(newComment?.body).toBe(commentData.body);
    expect(newComment?.updatedAt?.toISOString()).not.toBe(
      comment1?.updatedAt?.toISOString()
    );
  });
});
