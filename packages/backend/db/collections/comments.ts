/**
 * Comments collection that serves as the model layer to store and retreive
 * commments made on a post from a MongoDB database.
 */

import { Collection, ObjectId, UpdateFilter } from "mongodb";
import {
  MongoId,
  toObjectId,
  toObjectIds,
  GraphQLEntity,
} from "../../lib/mongo-helper";
import { NotFoundError } from "../../lib/validate";
import type { Comment } from "../../schemas/comment";
import type { Post } from "../../schemas/post";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createCommentsCollection = (
  commentsCollection: Collection<Comment.Mongo>,
  postsCollection: Collection<Post.Mongo>
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

    /**
     * Create a new comment on a post.
     *
     * @param comment The comment data.
     * @param userId  The id of the user making the comment.
     *
     * @returns   The comment object or null if an error was encountered.
     */
    create: async (
      comment: Comment.Input,
      userId: MongoId
    ): Promise<Comment.Mongo> => {
      const { body, postId, commentId, mentionIds } = comment;
      const commentData = {
        _id: new ObjectId(),
        body,
        postId: toObjectId(postId),
        commentId: commentId ? toObjectId(commentId) : undefined,
        mentionIds: mentionIds ? toObjectIds(mentionIds) : undefined,
        userId: toObjectId(userId),
      };
      await commentsCollection.insertOne(commentData);
      await postsCollection.updateOne(
        { _id: toObjectId(postId) },
        {
          $addToSet: { commentIds: commentData._id },
          $set: { updatedAt: new Date() },
        }
      );

      return commentData;
    },

    /**
     * Edit an existing comment.
     *
     * @param comment  Updated comment data.
     * @param userId  The id of the user editing the comment.
     *
     * @returns   The updated comment object or null if unauthorizered or an
     *            error was encountered.
     */
    edit: async (
      comment: Comment.Update,
      userId: MongoId
    ): Promise<Comment.Mongo> => {
      const { _id, body, mentionIds } = comment;
      let updateFilter: UpdateFilter<Comment.Mongo> = {
        $set: {
          body,
          updatedAt: new Date(),
          ...(mentionIds ? { mentionIds: toObjectIds(mentionIds) } : {}),
        },
      };

      const result = await commentsCollection.findOneAndUpdate(
        { _id: toObjectId(_id), userId: toObjectId(userId) },
        updateFilter,
        { returnDocument: "after" }
      );

      if (!result.value) {
        throw new NotFoundError("Comment");
      }

      return result.value;
    },

    /**
     * Delete an existing comment.
     *
     * @param commentId  The id of the comment.
     * @param userId  The id of the user editing the comment.
     *
     * @returns   True if the comment was successfully deleted and false
     *            otherwise.
     */
    delete: async (commentId: MongoId, userId: MongoId): Promise<boolean> => {
      const result = await commentsCollection.findOneAndDelete({
        _id: toObjectId(commentId),
        userId: toObjectId(userId),
      });

      if (!result.value) {
        throw new NotFoundError("Comment");
      }

      if (result.ok) {
        await postsCollection.updateOne(
          { _id: result.value.postId },
          { $pull: { commentIds: result.value._id } }
        );
      }

      return !!result.ok;
    },
  };
};

export default createCommentsCollection;
