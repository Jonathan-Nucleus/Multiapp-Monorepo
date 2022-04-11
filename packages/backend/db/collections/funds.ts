/**
 * Funds collection that serves as the model layer to store and retreive
 * specific funds associated with companies from a MongoDB database.
 */

import { Collection, ObjectId } from "mongodb";
import {
  MongoId,
  toObjectId,
  toObjectIds,
  GraphQLEntity,
} from "backend/lib/mongo-helper";
import type { Fund } from "backend/schemas/fund";
import type { Accreditation } from "backend/schemas/user";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createFundsCollection = (fundsCollection: Collection<Fund.Mongo>) => {
  return {
    /**
     * Find a fund by the fund id.
     *
     * @param id  The id of the fund.
     *
     * @returns   The fund or null if it was not found.
     */
    find: async (id: MongoId): Promise<Fund.Mongo | null> =>
      fundsCollection.findOne({ _id: toObjectId(id) }),

    /**
     * Provides a list of all funds in the DB.
     *
     * @param ids An optional array of specific IDs to filter by.
     *
     * @returns   An array of matching Fund objects.
     */
    findAll: async (ids?: MongoId[]): Promise<Fund.Mongo[]> => {
      const query =
        ids !== undefined ? { _id: { $in: ids ? toObjectIds(ids) : ids } } : {};
      return fundsCollection.find(query).toArray();
    },

    /**
     * Provides a list of all funds in the DB according to accreditation status.
     *
     * @param accreditation The accreditation level that funds should meet.
     *
     * @returns   An array of matching Fund objects.
     */
    findByAccreditation: async (
      accreditation: Accreditation
    ): Promise<Fund.Mongo[]> => {
      const accreditationLevels: Accreditation[] = [
        "accredited",
        "client",
        "purchaser",
      ];
      accreditationLevels.splice(
        accreditationLevels.indexOf(accreditation) + 1
      );

      return fundsCollection
        .find({ level: { $in: accreditationLevels } })
        .toArray();
    },
  };
};

export default createFundsCollection;
