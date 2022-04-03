/**
 * Comments collection that serves as the model layer to store and retreive
 * commments made on a post from a MongoDB database.
 */

import { Collection, ObjectId } from "mongodb";
import {
  MongoId,
  toObjectId,
  toObjectIds,
  GraphQLEntity,
} from "backend/lib/mongo-helper";
import type { Comment } from "backend/schemas/comment";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createCommentsCollection = (
  commentsCollection: Collection<Comment.Mongo>
) => {
  return {
    /**
     * Find a comment by the comment id.
     *
     * @param id  The id of the comment.
     *
     * @returns   The comment or null if it was not found.
     */
    find: async (id: MongoId): Promise<Comment.Mongo | null> =>
      commentsCollection.findOne({ _id: toObjectId(id) }),

    /**
     * Provides a list of all comments in the DB.
     *
     * @param ids An optional array of specific IDs to filter by.
     *
     * @returns   An array of matching Comment objects.
     */
    findAll: async (ids?: MongoId[]): Promise<Comment.Mongo[]> => {
      const query =
        ids !== undefined ? { _id: { $in: ids ? toObjectIds(ids) : ids } } : {};
      return commentsCollection.find(query).toArray();
    },
  };
};

export default createCommentsCollection;
