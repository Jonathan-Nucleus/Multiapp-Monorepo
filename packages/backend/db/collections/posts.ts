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
import type { Post } from "backend/schemas/post";

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
      const query =
        ids !== undefined ? { _id: { $in: ids ? toObjectIds(ids) : ids } } : {};
      return postsCollection.find(query).toArray();
    },
  };
};

export default createPostsCollection;
