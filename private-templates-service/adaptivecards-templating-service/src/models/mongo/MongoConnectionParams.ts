export interface MongoConnectionParams {
  connectionString?: string;
  options?: any;
}

export const mongoDefaultConnectionOptions: any = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 30000,
  useFindAndModify: false,
  retryWrites: false
};

export const mongoDefaultConnectionString: string = "mongodb://127.0.0.1:27017/default?";
