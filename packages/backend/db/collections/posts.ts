/**
 * Posts collection that serves as the model layer to store and retreive posts
 * from a MongoDB database.
 */

import { Collection, ObjectId } from "mongodb";
import {
  MongoId,
  toObjectId,
  toObjectIds,
  GraphQLEntity,
} from "backend/lib/mongo-helper";
import type { Post, PostCategory, Audience } from "backend/schemas/post";
import type { Comment } from "backend/schemas/comment";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createPostsCollection = (postsCollection: Collection<Post.Mongo>) => {
  return {
    /**
     * Find a post by the post id.
     *
     * @param id  The id of the post.
     *
     * @returns   The post or null if it was not found.
     */
    find: async (id: MongoId): Promise<Post.Mongo | null> =>
      postsCollection.findOne({ _id: toObjectId(id) }),

    /**
     * Provides a list of all posts in the DB.
     *
     * @param ids An optional array of specific IDs to filter by.
     *
     * @returns   An array of matching Post objects.
     */
    findAll: async (ids?: MongoId[]): Promise<Post.Mongo[]> => {
      const query = ids !== undefined ? { _id: { $in: toObjectIds(ids) } } : {};
      return postsCollection.find(query).toArray();
    },

    /**
     * Provides a list of all posts in the DB that match a specific set of
     * categories.
     *
     * @param audience    Audience level of posts to fetch.
     * @param categories  Optional list of categories to match.
     * @param ignorePosts List of post ids that should not be fetched.
     * @param ignoreUsers List of user ids of whose posts not to fetch.
     * @param offset      Optional offset for pagination. Defaults to 0.
     * @param limit       Optional limit for pagination. Defaults to no limit.
     *
     * @returns   An array of matching Post objects.
     */
    findByCategory: async (
      audience: Audience,
      categories?: PostCategory[],
      ignorePosts: MongoId[] = [],
      ignoreUsers: MongoId[] = [],
      offset: number = 0,
      limit: number = 0
    ): Promise<Post.Mongo[]> => {
      const audienceLevels: Audience[] = [
        "everyone",
        "accredited",
        "client",
        "purchaser",
      ];
      audienceLevels.splice(audienceLevels.indexOf(audience) + 1);

      return postsCollection
        .find({
          _id: { $nin: toObjectIds(ignorePosts) },
          audience: { $in: audienceLevels },
          userId: { $nin: toObjectIds(ignoreUsers) },
          ...(categories !== undefined
            ? { categories: { $in: categories } }
            : {}),
        })
        .sort({ _id: -1 })
        .skip(offset)
        .limit(limit)
        .toArray();
    },

    /**
     * Creates a new post.
     *
     * @param post  The new post data.
     *
     * @returns   Persisted post data with id.
     */
    create: async (
      post: Post.Input,
      userId: MongoId
    ): Promise<Post.Mongo | null> => {
      const { mentionIds } = post;
      const postData: Post.Mongo = {
        ...post,
        _id: new ObjectId(),
        mentionIds: mentionIds ? toObjectIds(mentionIds) : undefined,
        visible: true,
        userId: toObjectId(userId),
      };

      try {
        await postsCollection.insertOne(postData);
      } catch (err) {
        console.log("Error creating new post:", err);
        return null;
      }

      return postData;
    },

    /**
     * Adds a like to a post from a specific user.
     *
     * @param postId  The id of the post.
     * @param userId  The id of the user liking the post.
     *
     * @returns   Whether the like was successfully recorded.
     */
    likePost: async (postId: MongoId, userId: MongoId): Promise<boolean> => {
      try {
        const result = await postsCollection.updateOne(
          { _id: toObjectId(postId) },
          { $addToSet: { likeIds: toObjectId(userId) } }
        );

        return result.acknowledged;
      } catch (err) {
        console.log("Error creating new post:", err);
        return false;
      }
    },

    /**
     * Removes a like from a post from a specific user.
     *
     * @param postId  The id of the post.
     * @param userId  The id of the user unliking the post.
     *
     * @returns   Whether the like was successfully removed.
     */
    unlikePost: async (postId: MongoId, userId: MongoId): Promise<boolean> => {
      try {
        const result = await postsCollection.updateOne(
          { _id: toObjectId(postId) },
          { $pull: { likeIds: toObjectId(userId) } }
        );

        return result.acknowledged;
      } catch (err) {
        console.log("Error creating new post:", err);
        return false;
      }
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
      try {
        const result = await postsCollection.updateOne(
          { _id: toObjectId(postId) },
          { $addToSet: { reporterIds: toObjectId(userId) } }
        );

        return result.acknowledged;
      } catch (err) {
        console.log("Error creating new post:", err);
        return false;
      }
    },

    // TODO: Outstanding endpoints to implement
    // updatePost(post: PostUpdate) → Post
    // sharePost(postId: ID) → Post
  };
};

export default createPostsCollection;
