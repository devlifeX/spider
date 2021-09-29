import { pick } from "../utils";
import { getSitemapRequest, progressbarUpdaterSitemapProps } from "../types";
import { main, getSitemap } from "../lib/sitemap-xml";
import { v4 as uuidv4 } from "uuid";

const progressbarUpdater =
  (socket) => (item: progressbarUpdaterSitemapProps) => {
    const value = Math.floor((100 / item.total) * item.index);

    let output = {
      value,
      done: item.done,
      urls: item.urls,
      count: item.urls.length,
    };
    if (item?.meta) {
      output["meta"] = item.meta;
    }
    socket.emit("sitemap", output);
  };

export const getSitemapController = (socket, props: getSitemapRequest): any => {
  const { url, isDuplicate, basicAuth } = pick([
    "url",
    "isDuplicate",
    "basicAuth",
  ])(props) as getSitemapRequest;

  getSitemap(url, { basicAuth })
    .then(({ url: baseURL, error }) =>
      main({
        isDuplicate,
        baseURL,
        basicAuth,
        callbackOnEachItemFetched: progressbarUpdater(socket),
      })
    )
    .catch((err) => {
      console.log(err);

      socket.emit("sitemap", { error: { message: "URL issue", err } });
    });
};
