import { Collection } from "mongodb";
import { toObjectId, MongoId } from "backend/lib/mongo-helper";
import { NotFoundError } from "../../apollo/validate";
import createAppUsersCollection, {
  DeserializedUser as AppDeseserializedUser,
} from "backend/db/collections/users";
import { User, isUser } from "../../schemas/user";
import _omitBy from "lodash/omitBy";
import _isNil from "lodash/isNil";

export type DeserializedUser = AppDeseserializedUser & {
  admin: boolean;
};

const createAdminUsersCollection = (
  usersCollection: Collection<User.Mongo | User.Stub>
) => {
  const collection = {
    ...createAppUsersCollection(usersCollection),
    findAll: async (after?: MongoId, limit = 0): Promise<User.Mongo[]> => {
      return (await usersCollection
        .find({
          role: { $ne: "stub" },
          deletedAt: { $exists: false },
          ...(after ? { _id: { $gt: toObjectId(after) } } : {}),
        })
        .limit(limit)
        .sort({ firstName: 1 })
        .toArray()) as User.Mongo[];
    },
    updateUser: async (user: User.Update): Promise<User.Mongo | null> => {
      const { _id, ...otherData } = user;
      const updateData = _omitBy(otherData, _isNil);
      const updatedDocument = await usersCollection.findOneAndUpdate(
        { _id: toObjectId(_id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

      return updatedDocument.value as User.Mongo;
    },
    deserialize: async (userId: MongoId): Promise<DeserializedUser> => {
      const user = await usersCollection.findOne({
        _id: toObjectId(userId),
        deletedAt: { $exists: false },
      });
      if (!user || !isUser(user)) {
        throw new NotFoundError();
      }

      const { _id, role, accreditation, superUser } = user;

      return {
        _id: _id.toString(),
        role,
        acc: accreditation,
        admin: !!superUser,
      };
    },
  };

  return collection;
};

export default createAdminUsersCollection;
