import { MongoDBProvider } from "../storageproviders/MongoDBProvider";
import { StorageProvider } from "../storageproviders/IStorageProvider";
import * as DBTester from "./db_test_definition.test";
import { InMemoryDBProvider } from "../storageproviders/InMemoryDBProvider";

const connectionString = process.env.MONGO_URL;
describe("Test MongoDB", () => {
  let db: StorageProvider = new MongoDBProvider({ connectionString: connectionString });
  DBTester.testDB(db);
});

describe("Test InMemoryDB", () => {
  let db: StorageProvider = new InMemoryDBProvider();
  DBTester.testDB(db);
});
