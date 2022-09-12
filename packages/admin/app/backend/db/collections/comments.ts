import { Collection } from "mongodb";
import { MongoId, toObjectId } from "backend/lib/mongo-helper";
import { NotFoundError } from "backend/lib/apollo/validate";

import createAppCommentsCollection from "backend/db/collections/comments";
import { Comment } from "../../schemas/comment";
import { Post } from "../../schemas/post";

const createAdminCommentsCollection = (
  commentsCollection: Collection<Comment.Mongo>,
  postsCollection: Collection<Post.Mongo>
) => {
  return {
    ...createAppCommentsCollection(commentsCollection, postsCollection),
    delete: async (commentId: MongoId): Promise<boolean> => {
      const result = await commentsCollection.findOneAndUpdate(
        { _id: toObjectId(commentId) },
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
  };
};

export default createAdminCommentsCollection;
