import { Request, Response } from "express";

export const ping = (req: Request, res: Response): any => {
  return res.ok("pong");
};

export const getStatus = (req: Request, res: Response): any => {
  return res.ok("pong");
};
