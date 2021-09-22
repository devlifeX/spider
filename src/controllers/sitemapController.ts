import { Request, Response } from "express";
import { findSitemap, sitemapCheck } from "../lib/url-status";
import { pick, sitemapFullPath } from "../utils";
import { getSitemapRequest } from "../types";
import { main } from "../lib/sitemap-xml";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import config from "../config";
import path from "path";
import { fileURLToPath } from "url";

export const getSitemap = (req: Request, res: Response): any => {
  const { url, isDuplicate, isRecursive } = pick([
    "url",
    "isDuplicate",
    "isRecursive",
  ])(req.body) as getSitemapRequest;
  const id = uuidv4();
  const timesmap = new Date().getTime();
  const _url = new URL(url);
  const filename = `${_url.hostname}--${timesmap}--${id}.txt`;
  const fullPath = `${sitemapFullPath(url)}${filename}`;

  findSitemap(url)
    .then((baseURL) =>
      main({
        isRecursive,
        filename: fullPath,
        isDuplicate,
        baseURL,
      })
    )
    .then(() => {
      return res.redirect(301, `/api/download?file=${filename}`);
    })
    .catch((err) => res.fail(err));
};

export const downloadFile = (req: Request, res: Response): any => {
  const { file } = req.query;
  const hostname = file.toString().split("--")[0];
  const actualPath = `${path.resolve(
    process.env.SITEMAP_SAVE_DIR
  )}/${hostname}/${file}`;

  console.log("downloadFile", actualPath);

  if (!fs.existsSync(actualPath)) {
    return res.fail("Not found", 404);
  } else {
    return res.download(actualPath);
  }
};
