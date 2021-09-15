import express from "express";
import { getStatus, ping } from "../controllers";

const registerRoutes = (app: express.Express): void => {
  const publicRouter = express.Router();
  const privateRouter = express.Router();

  publicRouter.post("/status", getStatus);

  app.use("/ping", ping);
  app.use("/api", publicRouter);
};

export default registerRoutes;
