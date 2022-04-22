import { MongoMemoryServer } from "mongodb-memory-server";
import { disconnectDb, getIgniteDb } from "../../db";

const testDbName = "ignite-test";
let mongod: MongoMemoryServer;

export const connectDb = async (): Promise<void> => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
  }
  const uri = mongod.getUri();
  await getIgniteDb(`${uri}${testDbName}`);
};

export const closeDb = async () => {
  await disconnectDb();
  if (mongod) {
    await mongod.stop();
  }
};
