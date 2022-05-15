import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { Company } from "../../../schemas/company";
import {
  createUser,
  createCompany,
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
        isCompany
        body
        media {
          url
          aspectRatio
        }
        likeIds
        commentIds
        createdAt
        categories
        user {
          _id
        }
        company {
          _id
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let authCompany: Company.Mongo;
  let user1: User.Mongo;
  let company1: Company.Mongo;

  const postData = {
    audience: Object.keys(AudienceOptions)[0],
    categories: [Object.keys(PostCategoryOptions)[0]],
    body: "test post body",
    media: {
      url: "test.png",
      aspectRatio: 1.58,
    },
    mentionIds: [toObjectId().toString()],
  };

  beforeAll(async () => {
    authUser = await createUser();
    user1 = await createUser();
    authCompany = await createCompany(authUser._id);
    company1 = await createCompany(user1._id);

    server = createTestApolloServer(authUser);

    if (!authUser || !user1 || !authCompany || !company1 || !server) {
      throw new Error("Failed to create test objects");
    }
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

  it("fails without media aspect ratio", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          media: {
            url: postData.media.url,
          },
          categories: ["test"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails without media url", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          media: {
            aspectRatio: postData.media.aspectRatio,
          },
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

  it("fails to posts as another user's company", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          companyId: company1._id.toString(),
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_REQUEST);
  });

  it("fails with no body or media", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          body: undefined,
          media: undefined,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
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
    expect(JSON.stringify(res.data?.createPost?.media)).toBe(
      JSON.stringify(postData.media)
    );
    expect(res.data?.createPost?.user._id).toBe(authUser._id.toString());

    const newUser = (await users.find({
      _id: authUser._id,
    })) as User.Mongo | null;
    if (!newUser) {
      throw new Error("Cannot find original post creator");
    }

    const newPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    expect(newUser.postIds?.map((id) => id.toString())).toContain(
      res.data?.createPost._id
    );
    expect(newPostCount).toBe(oldPostCount + 1);
  });

  it("posts with body and no media", async () => {
    const { users, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          media: undefined,
        },
      },
    });

    expect(res.data?.createPost?.body).toBe(postData.body);
    expect(JSON.stringify(res.data?.createPost?.categories)).toBe(
      JSON.stringify(postData.categories)
    );
    expect(res.data?.createPost?.media).toBeNull();
    expect(res.data?.createPost?.user._id).toBe(authUser._id.toString());

    const newUser = (await users.find({
      _id: authUser._id,
    })) as User.Mongo | null;
    if (!newUser) {
      throw new Error("Cannot find original post creator");
    }

    const newPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    expect(newUser.postIds?.map((id) => id.toString())).toContain(
      res.data?.createPost._id
    );
    expect(newPostCount).toBe(oldPostCount + 1);
  });

  it("posts with media and no body", async () => {
    const { users, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          body: undefined,
        },
      },
    });

    expect(res.data?.createPost?.body).toBeNull();
    expect(JSON.stringify(res.data?.createPost?.categories)).toBe(
      JSON.stringify(postData.categories)
    );
    expect(JSON.stringify(res.data?.createPost?.media)).toBe(
      JSON.stringify(postData.media)
    );
    expect(res.data?.createPost?.user._id).toBe(authUser._id.toString());

    const newUser = (await users.find({
      _id: authUser._id,
    })) as User.Mongo | null;
    if (!newUser) {
      throw new Error("Cannot find original post creator");
    }

    const newPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    expect(newUser.postIds?.map((id) => id.toString())).toContain(
      res.data?.createPost._id
    );
    expect(newPostCount).toBe(oldPostCount + 1);
  });

  it("posts as the user's company", async () => {
    const { companies, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          companyId: authCompany._id.toString(),
        },
      },
    });

    expect(res.data?.createPost?.body).toBe(postData.body);
    expect(JSON.stringify(res.data?.createPost?.categories)).toBe(
      JSON.stringify(postData.categories)
    );
    expect(JSON.stringify(res.data?.createPost?.media)).toBe(
      JSON.stringify(postData.media)
    );
    expect(res.data?.createPost?.company._id).toBe(authCompany._id.toString());
    expect(res.data?.createPost?.isCompany).toBe(true);

    const newCompany = (await companies.find(
      authCompany._id
    )) as Company.Mongo | null;
    if (!newCompany) {
      throw new Error("Cannot find original post creator");
    }

    const newPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    expect(newCompany.postIds?.map((id) => id.toString())).toContain(
      res.data?.createPost._id
    );
    expect(newPostCount).toBe(oldPostCount + 1);
  });
});
