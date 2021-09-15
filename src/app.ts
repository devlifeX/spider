import config from "./config";
import registerRoutes from "./routes";
import express from "express";
import { connectToDb } from "./models";
import { failResponseHandler, successResponseHandler } from "./middlewares";
import cors from "cors";

const app: express.Express = express();
connectToDb(config.connectionString).then(() => {
  app.use(cors(config.corsOptions));
  app.use(express.json());
  app.use(failResponseHandler);
  app.use(successResponseHandler);

  app.listen(config.port, () => {
    console.log(`App listening on the port ${config.port}`);
  });
  registerRoutes(app);
});
