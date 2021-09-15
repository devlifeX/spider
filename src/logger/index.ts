import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.metadata(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
});
