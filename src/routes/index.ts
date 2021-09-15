import express from "express";
import { getStatus, getSitemap, downloadFile, ping } from "../controllers";

const registerRoutes = (app: express.Express): void => {
  const publicRouter = express.Router();
  const privateRouter = express.Router();

  publicRouter
    .post("/sitemap", getSitemap)
    .post("/status", getStatus)
    .get("/download", downloadFile);

  app.use("/ping", ping);
  app.use("/api", publicRouter);
};

export default registerRoutes;
