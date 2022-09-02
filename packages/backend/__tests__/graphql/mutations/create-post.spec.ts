import { ApolloServer, gql } from "apollo-server-express";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
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

describe("Mutations - createPost", () => {
  const query = gql`
    mutation CreatePost($post: PostInput!) {
      createPost(post: $post) {
        _id
        isCompany
        body
        attachments {
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
    attachments: [
      {
        url: "test.png",
        aspectRatio: 1.58,
      },
    ],
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

  it("fails without attachments aspect ratio", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          attachments: [
            {
              url: postData.attachments[0].url,
            },
          ],
          categories: ["test"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails without attachments url", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          attachments: [
            {
              aspectRatio: postData.attachments[0].aspectRatio,
            },
          ],
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

  it("fails with no body or attachments", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          body: undefined,
          attachments: undefined,
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

    console.log("repsonse", JSON.stringify(res));

    expect(res.data?.createPost?.body).toBe(postData.body);
    expect(JSON.stringify(res.data?.createPost?.categories)).toBe(
      JSON.stringify(postData.categories)
    );
    expect(JSON.stringify(res.data?.createPost?.attachments)).toBe(
      JSON.stringify(postData.attachments)
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

  it("posts with body and no attachments", async () => {
    const { users, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          attachments: undefined,
        },
      },
    });

    expect(res.data?.createPost?.body).toBe(postData.body);
    expect(JSON.stringify(res.data?.createPost?.categories)).toBe(
      JSON.stringify(postData.categories)
    );
    expect(res.data?.createPost?.attachments).toBeNull();
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

  it("posts with attachments and no body", async () => {
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
    expect(JSON.stringify(res.data?.createPost?.attachments)).toBe(
      JSON.stringify(postData.attachments)
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
    expect(JSON.stringify(res.data?.createPost?.attachments)).toBe(
      JSON.stringify(postData.attachments)
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

  it("notifies user when tagged in post", async () => {
    const { users, notifications, db } = await getIgniteDb();
    const oldPostCount = await db
      .collection(DbCollection.POSTS)
      .countDocuments();

    const oldNotifyCount = (await notifications.findByFilters(user1._id))
      .length;

    const res = await server.executeOperation({
      query,
      variables: {
        post: {
          ...postData,
          mentionIds: [user1._id.toString()],
        },
      },
    });

    expect(res.data?.createPost?.body).toBe(postData.body);
    expect(JSON.stringify(res.data?.createPost?.categories)).toBe(
      JSON.stringify(postData.categories)
    );
    expect(JSON.stringify(res.data?.createPost?.attachments)).toBe(
      JSON.stringify(postData.attachments)
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
    const newNotifyCount = (await notifications.findByFilters(user1._id))
      .length;

    expect(newUser.postIds?.map((id) => id.toString())).toContain(
      res.data?.createPost._id
    );
    expect(newPostCount).toBe(oldPostCount + 1);
    expect(newNotifyCount).toBe(oldNotifyCount + 1);
  });
});
