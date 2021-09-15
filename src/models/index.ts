import mongoose from "mongoose";

export const connectToDb = (connectionString: string): any => {
  return mongoose
    .connect(connectionString, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      dbName: "faraday",
    })
    .catch((err) => {
      console.log(err);
    });
};
