import { getSitemap } from "../lib/url-status";
import { pick } from "../utils";
import { getSitemapRequest, progressbarUpdaterSitemapProps } from "../types";
import { main } from "../lib/sitemap-xml";
import { v4 as uuidv4 } from "uuid";

const progressbarUpdater =
  (socket) => (item: progressbarUpdaterSitemapProps) => {
    const value = Math.floor((100 / item.total) * item.index);
    const output = { value, done: item.done, urls: item.urls };
    socket.emit("sitemap", output);
  };

export const getSitemapController = (socket, props: getSitemapRequest): any => {
  const { url, isDuplicate, basicAuth } = pick([
    "url",
    "isDuplicate",
    "basicAuth",
  ])(props) as getSitemapRequest;

  getSitemap(url)
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
