import { Collection } from "mongodb";
import createAppHelpRequestsCollection from "backend/db/collections/help-requests";
import { HelpRequest } from "../../schemas/help-request";

const createAdminHelpRequestsCollection = (
  helpRequestsCollection: Collection<HelpRequest.Mongo>
) => {
  return {
    ...createAppHelpRequestsCollection(helpRequestsCollection),
  };
};

export default createAdminHelpRequestsCollection;
