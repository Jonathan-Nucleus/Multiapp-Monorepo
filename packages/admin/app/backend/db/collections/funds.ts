import { Collection } from "mongodb";
import createAppFundsCollection from "backend/db/collections/funds";
import { Fund } from "../../schemas/fund";

const createAdminFundsCollection = (
  fundsCollection: Collection<Fund.Mongo>
) => {
  return {
    ...createAppFundsCollection(fundsCollection),
  };
};

export default createAdminFundsCollection;
