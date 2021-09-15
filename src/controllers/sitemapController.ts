import { Request, Response } from "express";
import { findSitemap, sitemapCheck } from "../lib/url-status";
import { pick } from "../utils";
import { getSitemapRequest } from "../types";
import { main } from "sitemap-urls";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import config from "../config";

export const getSitemap = (req: Request, res: Response): any => {
  const { url, isDuplicate, isRecursive } = pick([
    "url",
    "isDuplicate",
    "isRecursive",
  ])(req.body) as getSitemapRequest;
  const id = uuidv4();

  findSitemap(url)
    .then((baseURL) =>
      main({
        isRecursive,
        filename: `${id}.txt`,
        isDuplicate,
        baseURL,
      })
    )
    .then(() => {
      return res.redirect(301, `/api/download?file=${id}`);
    })
    .catch((err) => res.fail(err));

  // run(urls).then((data) => {
  //   console.log(data);

  //   return res.ok("pong", 200, { data });
  // });
};

export const downloadFile = (req: Request, res: Response): any => {
  const { file } = req.query;
  const actualPath = `${config.DIR_SPIDER}/${file}.txt`;

  if (!fs.existsSync(actualPath)) {
    return res.fail("Not found", 404);
  } else {
    return res.download(actualPath);
  }
};
