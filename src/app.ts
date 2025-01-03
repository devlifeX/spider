import config from "./config";
import registerRoutes from "./routes";
import express from "express";
import { connectToDb } from "./models";
import { failResponseHandler, successResponseHandler } from "./middlewares";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketConnect } from "./socket";

const app: express.Express = express();
// connectToDb(config.connectionString).then(() => {
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(failResponseHandler);
app.use(successResponseHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
socketConnect(io);

httpServer.listen(config.port, () => {
  console.log(`Socket listening on the port ${config.port}`);
});

registerRoutes(app);
// });
