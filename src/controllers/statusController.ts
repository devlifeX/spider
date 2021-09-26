import { Request, Response } from "express";
import { run, checkUrl, findSitemap } from "../lib/url-status";
import { pick } from "../utils";
import { getStatusRequest } from "../types";
import { main } from "../lib/sitemap-xml";

export const ping = (req: Request, res: Response): any => {
  return res.ok("pong");
};

const findSitemapURL = (url) => {
  return findSitemap(url).then((baseURL) =>
    main({
      isDuplicate: true,
      baseURL,
    })
  );
};

export const getStatus = async (req: Request, res: Response): Promise<any> => {
  const { url, urls } = pick(["url", "urls"])(req.body) as getStatusRequest;
  return Promise.resolve(url ? findSitemapURL(url) : urls)
    .then(run)
    .then((data) => res.ok("Ok", 200, { data }))
    .catch((err) => res.fail(err));
};
