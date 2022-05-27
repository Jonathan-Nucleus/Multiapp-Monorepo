import { ObjectId } from "mongodb";
import { getIgniteDb } from "../index";
import { DbCollection } from "backend/__tests__/config/utils";
import { fundData as allData } from "./funds";

import { generateSalt, hashPassword } from "../collections/users";

import type { Fund } from "backend/schemas/fund";
import type { Company } from "backend/schemas/company";
import type { User } from "backend/schemas/user";

const seedDb = async (): Promise<void> => {
  const { db } = await getIgniteDb();
  await Promise.all(
    allData.map((fundData) => {
      return (async () => {
        const companyId = new ObjectId();
        const fundId = new ObjectId();
        const managerId = new ObjectId();
        const teamIds: ObjectId[] = fundData.team.map(() => new ObjectId());

        const fund: Fund.Mongo = {
          _id: fundId,
          companyId,
          managerId,
          teamIds,
          ...fundData.fund,
        };

        const company: Company.Mongo = {
          _id: companyId,
          memberIds: [managerId],
          fundIds: [fundId],
          ...fundData.company,
        };

        const salt = generateSalt();
        const manager: User.Mongo = {
          _id: managerId,
          role: "professional",
          accreditation: fund.level,
          companyIds: [companyId],
          salt,
          email: `jeff.brines+${fundData.manager.firstName.toLowerCase()}.${fundData.manager.lastName.toLowerCase()}@gmail.com`,
          fullName: `${fundData.manager.firstName} ${fundData.manager.lastName}`,
          password: hashPassword("pro-ignite-pass", salt),
          managedFundsIds: [fundId],
          ...fundData.manager,
        };

        const team: User.Mongo[] = fundData.team.map((member, index) => ({
          _id: teamIds[index],
          role: "professional",
          accreditation: fund.level,
          companyIds: [companyId],
          salt,
          email: `jeff.brines+${member.firstName.toLowerCase()}.${member.lastName.toLowerCase()}@gmail.com`,
          fullName: `${member.firstName} ${member.lastName}`,
          password: hashPassword("pro-ignite-pass", salt),
          managedFundsIds: [fundId],
          ...member,
        }));

        await db.collection(DbCollection.USERS).insertOne(manager);
        await db.collection(DbCollection.COMPANIES).insertOne(company);
        await db.collection(DbCollection.FUNDS).insertOne(fund);

        if (fundData.team.length > 0) {
          await db.collection(DbCollection.USERS).insertMany(team);
        }
      })();
    })
  );
};

seedDb().then(() => process.exit(0));
