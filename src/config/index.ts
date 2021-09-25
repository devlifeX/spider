import dotenv from "dotenv";
import * as path from "path";
dotenv.config();

import { CORS } from "../types";

const corsOptions: CORS = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  optionsSuccessStatus: 200,
};

export default {
  currentEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT,
  socketPort: process.env.SOCKET_PORT,
  connectionString: process.env.CONNECTION_STRING,
  apiSecret: process.env.API_SECRET,
  corsOptions,
  DIR_SPIDER: path.resolve(__dirname, "../.."),
};
