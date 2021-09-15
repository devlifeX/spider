import { Request, Response } from "express";
import { checkUrl } from "../lib/url-status";
import { pick } from "../utils";
import { getSitemapRequest } from "../types";
import main from "sitemap-urls";
import { v4 as uuidv4 } from "uuid";

export const getSitemap = (req: Request, res: Response): any => {
  const { url, isDuplicate, isRecursive } = pick([
    "url",
    "isDuplicate",
    "isRecursive",
  ])(req.body) as getSitemapRequest;
  const id = uuidv4();

  checkUrl(url)
    .then((baseURL) =>
      main({
        isRecursive,
        filename: `${id}.txt`,
        isDuplicate,
        baseURL,
      })
    )
    .then(() => {
      return res.redirect(`/api/download?file=${id}`, 301);
    })
    .catch((err) => res.fail(err));

  // run(urls).then((data) => {
  //   console.log(data);

  //   return res.ok("pong", 200, { data });
  // });
};

export const downloadFile = (req: Request, res: Response): any => {
  const { file } = req.params;
  res.download(`${__dirname}/${file}.txt`);
};
