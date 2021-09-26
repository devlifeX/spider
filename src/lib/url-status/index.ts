import axios from "axios";
import * as t from "exectimer";
import cheerio from "cheerio";
import { splitEvery, flatten } from "ramda";
import { isValidSitemap } from "../../lib/sitemap-xml";

import { checkURLReturnType } from "./type";

const seoReport = (html: string) => {
  const $ = cheerio.load(html);

  return {
    h1: {
      text: $("h1").text(),
      count: $("h1")?.length,
      good: $("h1")?.length > 0 || false,
    },
    title: {
      text: $("title").text(),
      good: $("title").text()?.length < 64 || false,
    },
    description: {
      text: $("meta[name='description']").attr("content"),
      good:
        $("meta[name='description']").attr("content")?.length < 128 || false,
    },
    viewport: {
      good: $("meta[name='viewport']")?.length > 0 || false,
    },
    robots: {
      good:
        $("meta[name='robots']").attr("content")?.includes("index") || false,
    },
    canonical: {
      good: $("link[rel='canonical']").attr("href")?.includes("http") || false,
    },
    image: {
      url: $("meta[property='og:image']").attr("content"),
    },
  };
};

const makeHttpCall = (url: string) => {
  const id = Buffer.from(url).toString("base64");
  const tick = new t.Tick(`makeHttpCall-${id}`);
  tick.start();
  return axios.get(url).then((res) => {
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

export const recursiveRun = (urlChunk) => {
  const result = urlChunk.map(async (url) => await makeHttpCall(url));
  return Promise.all(result);
};

export const run = (urls, chunk = 1) => {
  const splited: string[][] = splitEvery(chunk, urls);

  let output = [];

  splited.reduce((acc, urls) => {
    return acc.then(() => {
      return recursiveRun(urls).then((results) => {
        console.log(results);

        return output.push(results);
      });
    });
  }, Promise.resolve());
};

export const checkUrl = (url): Promise<checkURLReturnType> => {
  return axios.get(url).then((res) => {
    if (res.status === 200) {
      return { data: res.data, url };
    }
  });
};

async function* findSitemap(url) {
  const list = ["sitemap.xml", "sitemap_index.xml"];
  const parsedURL = new URL(url);

  for (const slug of list) {
    try {
      const _url = `${parsedURL.origin}/${slug}`;
      const isValid = await isValidSitemap(`${parsedURL.origin}/${slug}`);
      yield { url: _url, isValid };
    } catch (error) {
      yield { url: "", isValid: false };
    }
  }
}

export const getSitemap = async (url): Promise<string> => {
  const isValidBaseURL = await isValidSitemap(url);
  if (!isValidBaseURL) {
    for await (const response of findSitemap(url)) {
      if (response.isValid) {
        return response.url;
      }
    }
  } else {
    return url;
  }
  return Promise.reject("can not find url");
};
