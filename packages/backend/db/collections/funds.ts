/**
 * Funds collection that serves as the model layer to store and retreive
 * specific funds associated with companies from a MongoDB database.
 */

import { Collection } from "mongodb";
import { MongoId, toObjectId, toObjectIds } from "../../lib/mongo-helper";
import type { Fund } from "../../schemas/fund";
import type { Accreditation } from "../../schemas/user";

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
      accreditation: Accreditation,
      ids?: MongoId[]
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
        .find({
          level: { $in: accreditationLevels },
          ...(ids ? { _id: { $in: toObjectIds(ids) } } : {}),
        })
        .toArray();
    },

    /**
     * Provides a list of funds searched by keyword.
     *
     * @param search  Search keyword.
     * @param limit   Optional limit for search result. Defaults to 10.
     *
     * @returns The list of funds.
     */
    findByKeyword: async (search = "", limit = 10): Promise<Fund.Mongo[]> => {
      const funds = (await fundsCollection
        .aggregate([
          {
            $search: {
              regex: {
                query: `(.*)${search.split(" ").join("(.*)")}(.*)`,
                path: "name",
              },
            },
          },
          {
            $limit: limit,
          },
        ])
        .toArray()) as Fund.Mongo[];

      return funds;
    },
  };
};

export default createFundsCollection;
