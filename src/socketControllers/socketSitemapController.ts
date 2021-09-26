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

const progressbarUpdater = (socket) => (item: any) => {
  const value = (item.total / 100) * item.index;
  const output = { value, done: item.index + 1 >= item.total };
  console.log(item);
  console.log(output);

  socket.emit("sitemap", output);
};

export const getSitemap = (socket, props: getSitemapRequest): any => {
  /* let value = 0;
  let done = false;
  const t = setInterval(() => {
    console.log(value);

    if (value >= 100) {
      done = true;
    }
    socket.emit("sitemap", { value, done });
    if (done) {
      return clearInterval(t);
    }
    value++;
  }, 30); */

  const { url, isDuplicate, basicAuth } = pick([
    "url",
    "isDuplicate",
    "basicAuth",
  ])(props) as getSitemapRequest;

  const id = uuidv4();
  const timesmap = new Date().getTime();
  const _url = new URL(url);

  findSitemap(url)
    .then((baseURL) =>
      main({
        isDuplicate,
        baseURL,
        basicAuth,
        callbackOnEachItemFetched: progressbarUpdater(socket),
      })
    )
    .catch((err) => {
      socket.emit("sitemap", { error: { message: "URL issue", err } });
    });
};
