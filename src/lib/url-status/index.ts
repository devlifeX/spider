import axios from "axios";
import * as t from "exectimer";
import cheerio from "cheerio";
import { splitEvery, flatten } from "ramda";

const seoReport = (html: string) => {
  const $ = cheerio.load(html);

  return {
    h1: {
      text: $("h1").text(),
      count: $("h1").length,
      good: $("h1").length > 0,
    },
    title: {
      text: $("title").text(),
      good: $("title").text().length < 64,
    },
    description: {
      text: $("meta[name='description']").attr("content"),
      good: $("meta[name='description']").attr("content").length < 128,
    },
    viewport: {
      good: $("meta[name='viewport']").length > 0,
    },
    robots: {
      good: $("meta[name='robots']").attr("content").includes("index"),
    },
    canonical: {
      good: $("link[rel='canonical']").attr("href").includes("http"),
    },
    image: {
      url: $("meta[property='og:image']").attr("content"),
    },
  };
};

const makeHttpCall = async (url: string) => {
  const id = Buffer.from(url).toString("base64");
  const tick = new t.Tick(`makeHttpCall-${id}`);
  tick.start();
  return await axios.get(url).then((res) => {
    const { status, statusText } = res;

    const { _currentUrl, _redirectCount, _redirects } =
      res.request._redirectable;

    tick.stop();
    const results = t.timers[`makeHttpCall-${id}`];

    return {
      time: results.parse(results.duration()),
      url: _currentUrl,
      redirectCount: _redirectCount,
      redirects: _redirects,
      status,
      statusText,
      bodySize: res.data.length,
      seo: {
        ...seoReport(res.data),
      },
    };
  });
};

export const run = async (urls, chunk = 10) => {
  const splited: string[][] = splitEvery(chunk, urls);

  const result = splited.map((urlChunk) =>
    urlChunk.map(async (url) => await makeHttpCall(url))
  );

  return Promise.all(flatten(result)).then((res) => {
    return res;
  });
};

export const checkUrl = (url) =>
  axios
    .get(url)
    .then((res) =>
      res.status === 200
        ? Promise.resolve(url)
        : Promise.reject("Not valid url")
    );
