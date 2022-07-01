import { ApolloServer, gql } from "apollo-server";
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

describe("Query - post", () => {
  const query = gql`
    query Post($postId: ID!) {
      post(postId: $postId) {
        _id
        user {
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
        postId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to get a post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        postId: post1._id.toString(),
      },
    });

    expect(res.data?.post._id).toBe(post1._id.toString());
    expect(res.data?.post.user._id).toBe(user._id.toString());
    expect(res.data?.post.user.firstName).toBe(user?.firstName);
    expect(res.data?.post.user.lastName).toBe(user?.lastName);
  });
});
