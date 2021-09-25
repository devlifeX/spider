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

export const getSitemap = (socket, props: getSitemapRequest): any => {
  let value = 0;
  const t = setInterval(() => {
    if (value == 100) {
      return clearInterval(t);
    }
    value++;
    socket.emit("sitemap", { value });
  }, 500);
  /* const id = uuidv4();
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
    .catch((err) => res.fail(err)); */
};
