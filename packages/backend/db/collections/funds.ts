/**
 * Funds collection that serves as the model layer to store and retreive
 * specific funds associated with companies from a MongoDB database.
 */

import { Collection } from "mongodb";
import { MongoId, toObjectId, toObjectIds } from "../../lib/mongo-helper";
import { createSearchStage } from "../../lib/utils";
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
      fundsCollection.findOne({
        _id: toObjectId(id),
        inactive: { $exists: false },
      }),

    /**
     * Provides a list of all funds in the DB.
     *
     * @param ids An optional array of specific IDs to filter by.
     *
     * @returns   An array of matching Fund objects.
     */
    findAll: async (ids?: MongoId[]): Promise<Fund.Mongo[]> => {
      return fundsCollection
        .find({
          inactive: { $exists: false },
          ...(ids !== undefined
            ? { _id: { $in: ids ? toObjectIds(ids) : ids } }
            : {}),
        })
        .toArray();
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
          inactive: { $exists: false },
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
    findByKeyword: async (
      accreditation: Accreditation,
      search = "",
      limit = 10
    ): Promise<Fund.Mongo[]> => {
      const stage = createSearchStage("name", search);
      if (!stage) {
        return [];
      }

      const accreditationLevels: Accreditation[] = [
        "accredited",
        "client",
        "purchaser",
      ];
      accreditationLevels.splice(
        accreditationLevels.indexOf(accreditation) + 1
      );

      const funds = (
        (await fundsCollection
          .aggregate([
            {
              $search: { ...stage },
            },
            {
              $limit: limit,
            },
          ])
          .toArray()) as Fund.Mongo[]
      ).filter(
        (fund) => accreditationLevels.includes(fund.level) && !fund.inactive
      );

      return funds;
    },
  };
};

export default createFundsCollection;
