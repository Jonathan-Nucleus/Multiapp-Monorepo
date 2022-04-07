import { getIgniteDb } from "../index";

import seedUsers from "./users";
import seedPosts from "./posts";
import seedCompanies from "./companies";
import seedComments from "./comments";
import seedFunds from "./funds";

const seedDb = async (): Promise<void> => {
  const { db } = await getIgniteDb();
  const userIds = await seedUsers(db);
  const postIds = await seedPosts(db, userIds);
  const companyIds = await seedCompanies(db, userIds);

  await seedComments(db, userIds, postIds);
  await seedFunds(db, userIds, companyIds);
};

seedDb().then(() => process.exit(0));
