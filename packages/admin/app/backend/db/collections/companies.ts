import { Collection } from "mongodb";
import createAppCompaniesCollection from "backend/db/collections/companies";
import { Company } from "../../schemas/company";

const createAdminCompaniesCollection = (
  companiesCollection: Collection<Company.Mongo>
) => {
  return {
    ...createAppCompaniesCollection(companiesCollection),
  };
};

export default createAdminCompaniesCollection;
