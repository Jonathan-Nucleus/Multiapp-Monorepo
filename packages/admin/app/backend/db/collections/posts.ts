import { Collection } from "mongodb";
import { MongoId, toObjectId } from "backend/lib/mongo-helper";
import { NotFoundError } from "backend/lib/apollo/validate";

import createAppPostsCollection from "backend/db/collections/posts";
import { Company } from "../../schemas/company";
import { Post } from "../../schemas/post";
import { User } from "../../schemas/user";

const createAdminPostsCollection = (
  postsCollection: Collection<Post.Mongo>,
  usersCollection: Collection<User.Mongo>,
  companiesCollection: Collection<Company.Mongo>
) => {
  return {
    ...createAppPostsCollection(
      postsCollection,
      usersCollection,
      companiesCollection
    ),
    delete: async (postId: MongoId): Promise<boolean> => {
      const result = await postsCollection.findOneAndUpdate(
        { _id: toObjectId(postId) },
        { $set: { deleted: true } },
        { returnDocument: "after" }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError("Post");
      }

      const { userId: postUserId, isCompany } = result.value;
      if (!isCompany) {
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
    disableComments: async (
      postId: MongoId,
      disable: boolean
    ): Promise<Post.Mongo> => {
      const result = await postsCollection.findOneAndUpdate(
        { _id: toObjectId(postId) },
        { $set: { disabledComments: disable } }
      );
      if (!result.value) {
        throw new NotFoundError("Post");
      }

      return result.value;
    },
  };
};

export default createAdminPostsCollection;
