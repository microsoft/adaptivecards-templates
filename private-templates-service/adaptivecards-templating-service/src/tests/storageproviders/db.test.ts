import { MongoDBProvider } from "../../storageproviders/MongoDBProvider";
import { StorageProvider } from "../../storageproviders/IStorageProvider";
import { InMemoryDBProvider } from "../../storageproviders/InMemoryDBProvider";
import * as DBTester from "../../tests_helper/db_t_definition";

const connectionString = "#{TEST_DB_CONNECTION_TOKEN}#";
describe("Test MongoDB", () => {
  let db: StorageProvider = new MongoDBProvider({ connectionString: connectionString });
  DBTester.testDB(db);
});

describe("Test InMemoryDB", () => {
  let db: StorageProvider = new InMemoryDBProvider();
  DBTester.testDB(db);
});
