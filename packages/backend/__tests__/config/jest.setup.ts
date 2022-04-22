import { closeDb, connectDb } from "./db.handler";

beforeAll(async () => {
  await connectDb();
});

afterAll(async () => {
  await closeDb();
});
