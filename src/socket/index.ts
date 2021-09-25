import { v4 as uuidv4 } from "uuid";

/**
 * Conreoller include here
 */
import { getSitemap } from "../socketControllers";

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
    socket.on("sitemap", (message) => getSitemap(io.sockets, message));

    /**
     * Other socket functions
     */
    // socket.on("message", (value) => this.handleMessage(value));
    socket.on("disconnect", () => this.disconnect());
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  /*   sendMessage(message) {
    this.io.sockets.emit("sitemap", message);
  }

  getMessages() {
    this.sendMessage({ message: "dar" });
  } */
  /* 
  handleMessage(value) {
    const message = {
      id: uuidv4(),
      user: users.get(this.socket) || defaultUser,
      value,
      time: Date.now(),
    };

    messages.add(message);
    this.sendMessage(message);

    setTimeout(() => {
      messages.delete(message);
      this.io.sockets.emit("deleteMessage", message.id);
    }, messageExpirationTimeMS);
  } */

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
