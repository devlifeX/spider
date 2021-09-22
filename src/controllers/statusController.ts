import { Request, Response } from "express";
import { run, checkUrl, findSitemap } from "../lib/url-status";
import { pick } from "../utils";
import { getStatusRequest } from "../types";
import { main } from "../lib/sitemap-xml";

export const ping = (req: Request, res: Response): any => {
  return res.ok("pong");
};

export const getStatus = (req: Request, res: Response): any => {
  const { url } = pick(["url"])(req.body) as getStatusRequest;

  findSitemap(url)
    .then((baseURL) =>
      main({
        isRecursive: true,
        isDuplicate: true,
        baseURL,
      })
    )
    .then(run)
    .then((data) => res.ok("Ok", 200, { data }))
    .catch((err) => res.fail(err));

  // run(urls).then((data) => {
  //   console.log(data);

  //   return res.ok("pong", 200, { data });
  // });
};
