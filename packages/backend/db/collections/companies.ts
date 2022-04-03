/**
 * Companies collection that serves as the model layer to store and retreive
 * individual companies from a MongoDB database.
 */

import { Collection, ObjectId } from "mongodb";
import {
  MongoId,
  toObjectId,
  toObjectIds,
  GraphQLEntity,
} from "backend/lib/mongo-helper";
import type { Company } from "backend/schemas/company";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createCompaniesCollection = (
  companiesCollection: Collection<Company.Mongo>
) => {
  return {
    /**
     * Find a company by the company id.
     *
     * @param id  The id of the compnay.
     *
     * @returns   The company or null if it was not found.
     */
    find: async (id: MongoId): Promise<Company.Mongo | null> =>
      companiesCollection.findOne({ _id: toObjectId(id) }),

    /**
     * Provides a list of all companies in the DB.
     *
     * @param ids An optional array of specific IDs to filter by.
     *
     * @returns   An array of matching Company objects.
     */
    findAll: async (ids?: MongoId[]): Promise<Company.Mongo[]> => {
      const query =
        ids !== undefined ? { _id: { $in: ids ? toObjectIds(ids) : ids } } : {};
      return companiesCollection.find(query).toArray();
    },
  };
};

export default createCompaniesCollection;
