/**
 * Posts collection that serves as the model layer to store and retreive posts
 * from a MongoDB database.
 */

import { Collection, ObjectId, UpdateFilter } from "mongodb";
import _ from "lodash";
import { MongoId, toObjectId, toObjectIds } from "../../lib/mongo-helper";
import type {
  Post,
  PostCategory,
  Audience,
  PostRoleFilter,
} from "../../schemas/post";
import {
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from "../../lib/apollo/validate";
import { User, Accreditation } from "../../schemas/user";
import { Company } from "../../schemas/company";
import { createSearchStage } from "../../lib/utils";

type FilterOptions = {
  postIds?: MongoId[];
  categories?: PostCategory[];
  ignorePosts?: MongoId[];
  ignoreUsers?: MongoId[];
  roleFilter?: PostRoleFilter;
  followingUsers?: MongoId[];
  featured?: boolean;
};

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createPostsCollection = (
  postsCollection: Collection<Post.Mongo>,
  usersCollection: Collection<User.Mongo>,
  companiesCollection: Collection<Company.Mongo>
) => {
  return {
    /**
     * Find a post by the post id.
     *
     * @param id  The id of the post.
     *
     * @returns   The post or null if it was not found.
     */
    find: async (id: MongoId): Promise<Post.Mongo | null> =>
      postsCollection.findOne({
        _id: toObjectId(id),
        visible: true,
        deleted: { $exists: false },
      }),

    /**
     * Provides a list of all posts in the DB.
     *
     * @param ids       An optional array of specific IDs to filter by.
     * @param featured  Optionally filter by featured posts.
     *
     * @returns   An array of matching Post objects.
     */
    findAll: async (
      ids?: MongoId[],
      featured = false
    ): Promise<Post.Mongo[]> => {
      const query = ids !== undefined ? { _id: { $in: toObjectIds(ids) } } : {};
      return postsCollection
        .find({
          ...query,
          ...(featured ? { featured } : {}),
          deleted: { $exists: false },
          visible: true,
        })
        .sort({ _id: -1 })
        .toArray();
    },

    /**
     * Provides a list of all posts in the DB that match a specific set of
     * categories.
     *
     * @param userId          Id of the user requesting posts.
     * @param accreditation   Accreditation level of the user.
     * @param filterOptions   Optional filter parameters for posts.
     * @param before          Optional post id to load items before.
     * @param limit           Optional limit for pagination. Defaults to no limit.
     *
     * @returns   An array of matching Post objects.
     */
    findByFilters: async (
      userId: MongoId,
      accreditation: Accreditation,
      filterOptions: FilterOptions = {},
      before?: MongoId,
      limit = 0
    ): Promise<Post.Mongo[]> => {
      const {
        categories,
        postIds,
        ignorePosts = [],
        ignoreUsers = [],
        roleFilter = "everyone",
        followingUsers = [],
        featured = false,
      } = filterOptions;

      const audience = accreditation === "none" ? "everyone" : accreditation;
      const audienceLevels: Audience[] = [
        "everyone",
        "accredited",
        "client",
        "purchaser",
      ];
      audienceLevels.splice(audienceLevels.indexOf(audience) + 1);

      let userIds: MongoId[] = [];
      if (roleFilter !== "everyone") {
        if (
          roleFilter === "professional-follow" ||
          roleFilter === "professional-only"
        ) {
          const proIds = _.map(
            await usersCollection
              .find({ role: "professional", deletedAt: { $exists: false } })
              .toArray(),
            "_id"
          );
          userIds = [...proIds];
        }
        if (roleFilter === "professional-follow") {
          userIds = [...userIds, ...followingUsers];
        } else if (roleFilter === "follow-only") {
          userIds = [...followingUsers];
        }

        userIds = _.difference(userIds, ignoreUsers || []);
      }

      const excludePostIds = ignorePosts.map((id) => id.toString());
      const includePosts = postIds?.filter(
        (id) => !excludePostIds.includes(id.toString())
      );

      return postsCollection
        .find({
          _id: {
            ...(includePosts
              ? { $in: toObjectIds(includePosts) }
              : { $nin: toObjectIds(ignorePosts) }),
            $lt: toObjectId(before),
          },
          visible: true,
          deleted: { $exists: false },
          $or: [
            {
              userId: toObjectId(userId),
              ...(categories !== undefined
                ? { categories: { $in: categories } }
                : {}),
              ...(featured ? { featured: true } : {}),
            },
            {
              audience: { $in: audienceLevels },
              userId: {
                $nin: toObjectIds(ignoreUsers),
                ...(roleFilter !== "everyone"
                  ? { $in: toObjectIds(userIds) }
                  : {}),
              },
              ...(categories !== undefined
                ? { categories: { $in: categories } }
                : {}),
              ...(featured ? { featured: true } : {}),
            },
          ],
        })
        .sort({ _id: -1 })
        .limit(limit)
        .toArray();
    },

    /**
     * Creates a new post.
     *
     * @param post    The new post data.
     * @param userId  The ID of the user creating the post.
     * @param visible Optional param indicating whether the post should be
     *                visible on creation. Defaults to true.
     *
     * @returns   Persisted post data with id.
     */
    create: async (
      post: Post.Input,
      userId: MongoId,
      visible = true
    ): Promise<Post.Mongo> => {
      const { companyId, mentionIds, ...otherData } = post;
      const isCompany = !!companyId;
      const postData: Post.Mongo = {
        ...otherData,
        _id: new ObjectId(),
        mentionIds: mentionIds ? toObjectIds(mentionIds) : undefined,
        visible,
        userId: toObjectId(companyId ?? userId),
        isCompany,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
      };

      const insertResult = await postsCollection.insertOne(postData);
      if (!insertResult.acknowledged) {
        throw new InternalServerError("Not able to add a post.");
      }

      if (isCompany) {
        const updateResult = await companiesCollection.updateOne(
          { _id: toObjectId(companyId), deletedAt: { $exists: false } },
          {
            $addToSet: { postIds: postData._id },
            $inc: { postCount: visible ? 1 : 0 },
          }
        );
        if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
          throw new InternalServerError("Not able assign company.");
        }
      } else {
        const updateResult = await usersCollection.updateOne(
          { _id: toObjectId(userId), deletedAt: { $exists: false } },
          {
            $addToSet: { postIds: postData._id },
            $inc: { postCount: visible ? 1 : 0 },
          }
        );
        if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
          throw new InternalServerError("Not able to assign user.");
        }
      }

      return postData;
    },

    /**
     * Edit an existing post.
     *
     * @param post    Updated post data.
     * @param userId  The id of the user editing the post.
     *
     * @returns   The updated post object or null if unauthorizered or an
     *            error was encountered.
     */
    edit: async (post: Post.Update, userId: MongoId): Promise<Post.Mongo> => {
      const { _id, mentionIds, ...postData } = post;
      const updateFilter: UpdateFilter<Post.Mongo> = {
        $set: {
          ...postData,
          userId: toObjectId(userId),
          updatedAt: new Date(),
          ...(mentionIds ? { mentionIds: toObjectIds(mentionIds) } : {}),
        },
      };

      const result = await postsCollection.findOneAndUpdate(
        {
          _id: toObjectId(_id),
          userId: toObjectId(userId),
          deleted: { $exists: false },
        },
        updateFilter,
        { returnDocument: "after" }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError("Post");
      }

      return result.value;
    },

    /**
     * Updates the visibility state of a post.
     *
     * @param postId  The ID of the post to share.
     * @param post    Additional informtion the user would like to include with
     *                the shared post.
     * @param userId  The ID of the user sharing the post.
     *
     * @returns   Persisted shared post data with id.
     */
    setVisible: async (
      id: MongoId,
      visible: boolean,
      userId: MongoId
    ): Promise<Post.Mongo> => {
      const result = await postsCollection.findOneAndUpdate(
        {
          _id: toObjectId(id),
          userId: toObjectId(userId),
          deleted: { $exists: false },
        },
        { $set: { visible } },
        { returnDocument: "after" }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError("Post");
      }

      await usersCollection.updateOne(
        { _id: toObjectId(userId) },
        { $inc: { postCount: visible ? 1 : -1 } }
      );
      await companiesCollection.updateOne(
        { _id: toObjectId(userId) },
        { $inc: { postCount: visible ? 1 : -1 } }
      );

      return result.value;
    },

    /**
     * Shares an existing post with an additional message from the user.
     *
     * @param postId  The ID of the post to share.
     * @param post    Additional informtion the user would like to include with
     *                the shared post.
     * @param userId  The ID of the user sharing the post.
     *
     * @returns   Persisted shared post data with id.
     */
    share: async (
      postId: MongoId,
      post: Post.ShareInput,
      userId: MongoId
    ): Promise<Post.Mongo> => {
      const originalPostId = toObjectId(postId);
      const originalPost = await postsCollection.findOne({
        _id: originalPostId,
      });
      if (!originalPost) {
        throw new UnprocessableEntityError("Post not found.");
      }

      const { companyId, mentionIds, ...otherData } = post;
      const isCompany = !!companyId;
      const postData: Post.Mongo = {
        ...otherData,
        _id: new ObjectId(),
        mentionIds: mentionIds ? toObjectIds(mentionIds) : undefined,
        visible: true,
        userId: toObjectId(companyId ?? userId),
        isCompany,
        categories: originalPost.categories,
        audience: originalPost.audience,
        sharedPostId: originalPostId,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
      };

      const insertResult = await postsCollection.insertOne(postData);
      if (!insertResult.acknowledged) {
        throw new InternalServerError("Not able to add a post.");
      }

      const updateResult = await postsCollection.updateOne(
        { _id: originalPostId },
        {
          $addToSet: { shareIds: postData._id },
          $inc: { shareCount: 1 },
        }
      );

      if (!updateResult.acknowledged || updateResult.modifiedCount !== 1) {
        throw new InternalServerError("Not able to update original post.");
      }

      if (isCompany) {
        const updateResult = await companiesCollection.updateOne(
          { _id: toObjectId(companyId), deletedAt: { $exists: false } },
          { $addToSet: { postIds: postData._id } }
        );
        if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
          throw new InternalServerError("Not able assign company.");
        }
      } else {
        const updateResult = await usersCollection.updateOne(
          { _id: toObjectId(userId), deletedAt: { $exists: false } },
          { $addToSet: { postIds: postData._id } }
        );
        if (!updateResult.acknowledged || updateResult.modifiedCount === 0) {
          throw new InternalServerError("Not able to assign user.");
        }
      }

      return postData;
    },

    /**
     * Soft delete an existing post.
     *
     * @param postId  The id of the postt.
     * @param userId  The id of the user that created the post.
     *
     * @returns   True if the post was successfully deleted and false
     *            otherwise.
     */
    delete: async (
      postId: MongoId,
      userId: MongoId,
      companyIds: MongoId[]
    ): Promise<boolean> => {
      const result = await postsCollection.findOneAndUpdate(
        {
          _id: toObjectId(postId),
          userId: { $in: toObjectIds([userId, ...companyIds]) },
        },
        { $set: { deleted: true } },
        { returnDocument: "after" }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError("Post");
      }

      const { userId: postUserId } = result.value;
      if (postUserId === userId) {
        await usersCollection.updateOne(
          { _id: toObjectId(postUserId) },
          { $inc: { postCount: -1 } }
        );
      } else {
        await companiesCollection.updateOne(
          { _id: toObjectId(postUserId) },
          { $inc: { postCount: -1 } }
        );
      }

      return true;
    },

    /**
     * Set whether a user's post is flagged as featured.
     *
     * @param postId    The ID of the post.
     * @param userId    Teh ID of the user that owns the post.
     * @param feature   Whether or not to feature the post.
     *
     * @returns   The updated Post or null if it could not be updated.
     */
    feature: async (
      postId: MongoId,
      userId: MongoId,
      feature: boolean
    ): Promise<Post.Mongo> => {
      const result = await postsCollection.findOneAndUpdate(
        {
          _id: toObjectId(postId),
          userId: toObjectId(userId),
          deleted: { $exists: false },
        },
        { $set: { featured: feature } },
        { returnDocument: "after" }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError("Post");
      }

      return result.value;
    },

    /**
     * Updates the status of a transcoding media item to complete.
     *
     * @param postId    The ID of the post.
     * @param mediaUrl  The final name of the media file.
     *
     * @returns   The updated Post or null if it could not be updated.
     */
    updatePostMedia: async (
      postId: MongoId,
      mediaUrl: string
    ): Promise<Post.Mongo> => {
      const result = await postsCollection.findOneAndUpdate(
        {
          _id: toObjectId(postId),
          deleted: { $exists: false },
        },
        {
          $set: {
            "media.url": mediaUrl,
            "media.transcoded": true,
            visible: true,
          },
        },
        { returnDocument: "after" }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError("Post");
      }

      return result.value;
    },

    /**
     * Adds a like to a post from a specific user.
     *
     * @param postId  The id of the post.
     * @param userId  The id of the user liking the post.
     *
     * @returns   The updated post record or null if it was not found.
     */
    likePost: async (postId: MongoId, userId: MongoId): Promise<Post.Mongo> => {
      const result = await postsCollection.findOneAndUpdate(
        { _id: toObjectId(postId), deleted: { $exists: false } },
        {
          $addToSet: { likeIds: toObjectId(userId) },
          $inc: { likeCount: 1 },
        },
        { returnDocument: "after" }
      );

      if (!result.value) {
        throw new NotFoundError("Post");
      }

      return result.value;
    },

    /**
     * Removes a like from a post from a specific user.
     *
     * @param postId  The id of the post.
     * @param userId  The id of the user unliking the post.
     *
     * @returns   The updated post record or null if it was not found.
     */
    unlikePost: async (
      postId: MongoId,
      userId: MongoId
    ): Promise<Post.Mongo> => {
      const result = await postsCollection.findOneAndUpdate(
        { _id: toObjectId(postId), deleted: { $exists: false } },
        {
          $pull: { likeIds: toObjectId(userId) },
          $inc: { likeCount: -1 },
        },
        { returnDocument: "after" }
      );

      if (!result.value) {
        throw new NotFoundError("Post");
      }

      return result.value;
    },

    /**
     * Logs a report on a post by a particular user.
     *
     * @param postId  The id of the post.
     * @param userId  The id of the user reporting the post.
     *
     * @returns   Whether report was successfully logged.
     */
    logReport: async (postId: MongoId, userId: MongoId): Promise<boolean> => {
      const result = await postsCollection.updateOne(
        { _id: toObjectId(postId) },
        { $addToSet: { reporterIds: toObjectId(userId) } }
      );

      if (!result.acknowledged) {
        throw new InternalServerError("Not able to report a post.");
      }
      if (result.modifiedCount === 0) {
        throw new UnprocessableEntityError("Invalid post id.");
      }

      return true;
    },

    /**
     * Provides a list of posts searched by keyword.
     *
     * @param search  Search keyword.
     * @param limit   Optional limit for search result. Defaults to 10.
     *
     * @returns The list of posts.
     */
    findByKeyword: async (
      audience: Audience,
      search = "",
      limit = 10
    ): Promise<Post.Mongo[]> => {
      const stage = createSearchStage("body", search);
      if (!stage) {
        return [];
      }

      const audienceLevels: Audience[] = [
        "everyone",
        "accredited",
        "client",
        "purchaser",
      ];
      audienceLevels.splice(audienceLevels.indexOf(audience) + 1);

      const posts = (
        (await postsCollection
          .aggregate([
            {
              $search: { ...stage },
            },
            {
              $match: {
                deleted: { $exists: false },
              },
            },
            {
              $limit: limit,
            },
          ])
          .toArray()) as Post.Mongo[]
      ).filter((post) => audienceLevels.includes(post.audience));

      return posts;
    },
  };
};

export default createPostsCollection;
