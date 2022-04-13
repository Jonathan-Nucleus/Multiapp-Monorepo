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
} from "../../lib/mongo-helper";
import type { Company } from "../../schemas/company";

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

    /**
     * Set whether this company is following another user.
     *
     * @param follow        Whether or not this company is following another user.
     * @param followUserId  The id of the user to follow or unfollow.
     * @param companyId     The id of the current company.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowingUser: async (
      follow: boolean,
      followUserId: MongoId,
      companyId: MongoId
    ): Promise<boolean> => {
      try {
        const result = follow
          ? await companiesCollection.updateOne(
              { _id: toObjectId(companyId) },
              { $addToSet: { followingIds: toObjectId(followUserId) } }
            )
          : await companiesCollection.updateOne(
              { _id: toObjectId(companyId) },
              { $pull: { followingIds: toObjectId(followUserId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error following user ${followUserId}: ${err}`);
        return false;
      }
    },

    /**
     * Set whether another user is following this company.
     *
     * @param follow        Whether or not another user is following this company.
     * @param followUserId  The id of the user that is following or unfollowing.
     * @param companyId     The id of the current company.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollower: async (
      following: boolean,
      followerId: MongoId,
      companyId: MongoId
    ): Promise<boolean> => {
      try {
        const result = following
          ? await companiesCollection.updateOne(
              { _id: toObjectId(companyId) },
              { $addToSet: { followerIds: toObjectId(followerId) } }
            )
          : await companiesCollection.updateOne(
              { _id: toObjectId(companyId) },
              { $pull: { followerIds: toObjectId(followerId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error setting follower ${followerId}: ${err}`);
        return false;
      }
    },

    /**
     * Set whether this company is following a company.
     *
     * @param follow            Whether or not this company is following another company.
     * @param followCompanyId   The id of the company to follow or unfollow.
     * @param companyId         The id of the current company.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowingCompany: async (
      follow: boolean,
      followCompanyId: MongoId,
      companyId: MongoId
    ): Promise<boolean> => {
      try {
        const result = follow
          ? await companiesCollection.updateOne(
              { _id: toObjectId(companyId) },
              {
                $addToSet: { companyFollowingIds: toObjectId(followCompanyId) },
              }
            )
          : await companiesCollection.updateOne(
              { _id: toObjectId(companyId) },
              { $pull: { companyFollowingIds: toObjectId(followCompanyId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error following company ${followCompanyId}: ${err}`);
        return false;
      }
    },

    /**
     * Set whether this company is being followed by another company.
     *
     * @param follower            Whether or not this company is following another company.
     * @param followerCompanyId   The id of the company to follow or unfollow.
     * @param companyId           The id of the current company.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowerCompany: async (
      following: boolean,
      followerCompanyId: MongoId,
      companyId: MongoId
    ): Promise<boolean> => {
      try {
        const result = following
          ? await companiesCollection.updateOne(
              { _id: toObjectId(companyId) },
              {
                $addToSet: {
                  companyFollowerIds: toObjectId(followerCompanyId),
                },
              }
            )
          : await companiesCollection.updateOne(
              { _id: toObjectId(companyId) },
              { $pull: { companyFollowerIds: toObjectId(followerCompanyId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(
          `Error setting follower company ${followerCompanyId}: ${err}`
        );
        return false;
      }
    },
  };
};

export default createCompaniesCollection;
