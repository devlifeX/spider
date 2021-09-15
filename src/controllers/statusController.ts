import { Request, Response } from "express";
import { run, checkUrl } from "../lib/url-status";
import { pick } from "../utils";
import { getStatusRequest } from "../types";

export const ping = (req: Request, res: Response): any => {
  return res.ok("pong");
};

export const getStatus = (req: Request, res: Response): any => {
  const { url } = pick(["url"])(req.body) as getStatusRequest;

  checkUrl(url).then((validURL) => console.log(validURL));

  // run(urls).then((data) => {
  //   console.log(data);

  //   return res.ok("pong", 200, { data });
  // });
};
