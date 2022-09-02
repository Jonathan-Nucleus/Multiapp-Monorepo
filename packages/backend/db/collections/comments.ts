/**
 * Comments collection that serves as the model layer to store and retreive
 * commments made on a post from a MongoDB database.
 */

import { Collection, ObjectId, UpdateFilter } from "mongodb";
import { MongoId, toObjectId, toObjectIds } from "../../lib/mongo-helper";
import { NotFoundError } from "../../lib/apollo/validate";
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
      commentsCollection.findOne({
        _id: toObjectId(id),
        deleted: { $exists: false },
      }),

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
      return commentsCollection
        .find({ ...query, deleted: { $exists: false } })
        .toArray();
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
      const { body, postId, commentId, mentionIds, attachments } = comment;
      const commentData = {
        _id: new ObjectId(),
        body,
        postId: toObjectId(postId),
        commentId: commentId ? toObjectId(commentId) : undefined,
        mentionIds: mentionIds ? toObjectIds(mentionIds) : undefined,
        userId: toObjectId(userId),
        attachments,
        likeCount: 0,
      };
      await commentsCollection.insertOne(commentData);
      await postsCollection.updateOne(
        { _id: toObjectId(postId) },
        {
          $addToSet: { commentIds: commentData._id },
          $inc: { commentCount: 1 },
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
      const { _id, body, mentionIds, attachments } = comment;
      const updateFilter: UpdateFilter<Comment.Mongo> = {
        $set: {
          attachments,
          body,
          updatedAt: new Date(),
          ...(mentionIds ? { mentionIds: toObjectIds(mentionIds) } : {}),
        },
      };

      const result = await commentsCollection.findOneAndUpdate(
        {
          _id: toObjectId(_id),
          userId: toObjectId(userId),
          deleted: { $exists: false },
        },
        updateFilter,
        { returnDocument: "after" }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError("Comment");
      }

      return result.value;
    },

    /**
     * Soft delete an existing comment.
     *
     * @param commentId   The id of the comment.
     * @param userId      The id of the user that created the comment.
     *
     * @returns   True if the comment was successfully deleted and false
     *            otherwise.
     */
    delete: async (commentId: MongoId, userId: MongoId): Promise<boolean> => {
      const result = await commentsCollection.findOneAndUpdate(
        {
          _id: toObjectId(commentId),
          userId: toObjectId(userId),
        },
        { $set: { deleted: true } },
        { returnDocument: "after" }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError("Comment");
      }

      const { postId } = result.value;
      await postsCollection.updateOne(
        { _id: toObjectId(postId) },
        { $inc: { commentCount: -1 } }
      );

      return true;
    },

    /**
     * Adds a like to a comment from a specific user.
     *
     * @param commentId   The id of the comment.
     * @param userId      The id of the user liking the comment.
     *
     * @returns   The updated comment record or null if it was not found.
     */
    likeComment: async (
      commentId: MongoId,
      userId: MongoId
    ): Promise<Comment.Mongo> => {
      const result = await commentsCollection.findOneAndUpdate(
        { _id: toObjectId(commentId), deleted: { $exists: false } },
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
     * Removes a like from a comment from a specific user.
     *
     * @param commentId   The id of the comment.
     * @param userId      The id of the user unliking the comment.
     *
     * @returns   The updated comment record or null if it was not found.
     */
    unlikeComment: async (
      commentId: MongoId,
      userId: MongoId
    ): Promise<Comment.Mongo> => {
      const result = await commentsCollection.findOneAndUpdate(
        { _id: toObjectId(commentId), deleted: { $exists: false } },
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
  };
};

export default createCommentsCollection;
