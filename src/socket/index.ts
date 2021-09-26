import { v4 as uuidv4 } from "uuid";

/**
 * Conreoller include here
 */
import { getSitemapController } from "../socketControllers";

const messages = new Set();
const users = new Map();

const defaultUser = {
  id: "anon",
  name: "Anonymous",
};

const messageExpirationTimeMS = 5 * 60 * 1000;

export class Connection {
  protected socket = null;
  protected io = null;

  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    /**
     * Register controller
     */
    socket.on("sitemap", (message) =>
      getSitemapController(io.sockets, message)
    );

    /**
     * Other socket functions
     */

    socket.on("disconnect", () => this.disconnect());
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  disconnect() {
    users.delete(this.socket);
  }
}

export const socketConnect = (io) => {
  console.log("Socket connectiong...");

  io.on("connection", (socket) => {
    new Connection(io, socket);
    console.log("Socket ON connection.");
  });
};
