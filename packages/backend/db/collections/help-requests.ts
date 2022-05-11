/**
 * HelpRequests collection that serves as the model layer to store and retreive
 * help requests from a MongoDB database.
 */

import { Collection, ObjectId } from "mongodb";
import { MongoId, toObjectId } from "../../lib/mongo-helper";
import { HelpRequest } from "../../schemas/help-request";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createHelpRequestsCollection = (
  helpRequestsCollection: Collection<HelpRequest.Mongo>
) => {
  return {
    /**
     * Find a help request by the id.
     *
     * @param id  The id of the request.
     *
     * @returns   The request or null if it was not found.
     */
    find: async (id: MongoId): Promise<HelpRequest.Mongo | null> =>
      helpRequestsCollection.findOne({ _id: toObjectId(id) }),

    /**
     * Create a new request.
     *
     * @param data            The help request data.
     * @param userId          The id of auth user.
     *
     * @returns   true
     */
    create: async (
      data: HelpRequest.Input,
      userId: MongoId
    ): Promise<HelpRequest.Mongo> => {
      const requestData = {
        _id: new ObjectId(),
        userId: toObjectId(userId),
        ...data,
      };
      await helpRequestsCollection.insertOne(requestData);

      return requestData;
    },
  };
};

export default createHelpRequestsCollection;
