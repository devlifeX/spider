import cheerio from "cheerio";
import path from "path";
import axios from "axios";
import fs from "fs";
import moment from "moment";
import R, { splitEvery, flatten } from "ramda";
import { isValidURL } from "../../utils";
import {
  SitemapMain,
  SitemapResponse,
  isValidSitemapResponse,
  fetchXMLOption,
  getSitemapResponse,
  RobotTXTReturnType,
} from "./types";

export function fetchXML(
  url: SitemapResponse | string,
  option?: fetchXMLOption
): Promise<string> {
  const finalURL = typeof url === "string" ? url : url.url;
  let axiosOptions = {};

  if (option?.basicAuth?.hasBasicAuth) {
    axiosOptions = {
      auth: {
        username: option.basicAuth.basicAuthUsername,
        password: option.basicAuth.basicAuthPassword,
      },
    };
  }

  return axios
    .get(finalURL, { timeout: 30000, ...axiosOptions })
    .then((res) => res.data)
    .catch((err) => "");
}

function* xmlLoader(urls: SitemapResponse[][], option?: fetchXMLOption) {
  for (const urlPack of urls) {
    yield urlPack.map((url) => fetchXML(url, option));
  }
}

function isURLXML(url: SitemapResponse | string) {
  const finalURL = typeof url === "string" ? url : url.url;
  const ext = path.extname(finalURL);
  return ext.toLocaleLowerCase() === ".xml";
}

function extractUrls(xml): SitemapResponse[] {
  try {
    const urls: SitemapResponse[] = [];
    const $ = cheerio.load(xml, { xmlMode: true });

    $("sitemap, url").each(function (_, v) {
      const url = decodeURI($(v).find("loc").text());
      const lastmod = $(v).find("lastmod").text();
      const changefreq = $(v).find("changefreq").text() || "نامشخص";
      const priority = $(v).find("priority").text() || "نامشخص";

      urls.push(sitemapTimerHandler({ url, lastmod, changefreq, priority }));
    });

    return urls;
  } catch (error) {
    return [];
  }
}

async function saveOutput(urlsArray: SitemapResponse[], filename) {
  //TODO : not tested
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    file.on("error", function (err) {
      console.log(`Error: ${err}`);
      reject(`Error: ${err}`);
    });
    urlsArray.forEach(function (v) {
      file.write(v + "\n");
    });
    console.log(`${urlsArray.length}, items saved at ${filename}`);
    file.on("close", () => resolve(urlsArray));
    file.end();
  });
}

export const isValidSitemap = (
  url: SitemapResponse | string,
  option?: fetchXMLOption
): Promise<isValidSitemapResponse> => {
  const finalURL = typeof url === "string" ? url : url.url;
  let response: isValidSitemapResponse = {
    fetchError: true,
    isValidXML: false,
  };

  /* if (!finalURL.includes(".xml")) {
    return Promise.resolve({
      fetchError: false,
      isValidXML: false,
    });
  } */

  return fetchXML(finalURL, option)
    .then((str) => {
      if (str.length <= 0) return response;
      return {
        fetchError: false,
        isValidXML: extractUrls(str).length > 0,
      };
    })
    .catch(() => response);
};

function isURL(str) {
  try {
    const myURL = new URL(str);
    if (myURL.href) {
      return true;
    } else return false;
  } catch {
    return false;
  }
}

const sitemapMetaExtractor = (url) => {
  return [
    { key: "آدرس سایت", value: new URL(url).origin, type: "link" },
    { key: "آدرس سایت‌مپ", value: url, type: "link" },
  ];
};

export async function main({
  baseURL,
  sitemapContent,
  basicAuth,
  filename,
  isDuplicate,
  callbackOnEachItemFetched,
}: SitemapMain): Promise<SitemapResponse[]> {
  let output: SitemapResponse[] = [];
  let urls: SitemapResponse[] = [];
  let xml = null;
  const callbackHandler = (props) =>
    callbackOnEachItemFetched && callbackOnEachItemFetched(props);

  if (baseURL) {
    xml = await fetchXML(baseURL, { basicAuth });
  } else {
    xml = sitemapContent;
  }

  urls = extractUrls(xml);

  const XMLURL = urls.filter((url) => isURLXML(url));
  const notXMLURL = urls.filter((url) => !isURLXML(url));

  const splited: SitemapResponse[][] = splitEvery(1, XMLURL);

  callbackHandler({
    index: 0,
    total: splited.length,
    urls: [...XMLURL, ...notXMLURL],
    done: splited.length <= 0,
    meta: sitemapMetaExtractor(baseURL),
  });

  let splitedIndex = 1;
  let tmp = [];
  for (const result of xmlLoader(splited, { basicAuth })) {
    const feed = await Promise.all(result);
    const newURLs = feed.map((i) => extractUrls(i));
    tmp.push(newURLs);

    callbackHandler({
      index: splitedIndex,
      total: splited.length,
      urls: flatten(newURLs),
      done: splitedIndex >= splited.length,
    });

    splitedIndex++;
  }

  output = flatten(tmp);
  output = [...XMLURL, ...notXMLURL, ...output];

  if (isDuplicate) {
    output = output.reduce(function (acc, url) {
      if (!acc.includes(url)) {
        acc.push(url);
      }
      return acc;
    }, []);
  }

  if (filename) {
    saveOutput(output, filename);
  }

  return output;
}

async function* findSitemap(
  url: string
): AsyncGenerator<(isValidSitemapResponse & { url: string }) | null> {
  const list = ["sitemap.xml", "sitemap_index.xml"];
  const parsedURL = new URL(url);

  for (const slug of list) {
    try {
      const _url = `${parsedURL.origin}/${slug}`;
      const check = await isValidSitemap(`${parsedURL.origin}/${slug}`);

      yield { url: _url, ...check };
    } catch (error) {
      yield null;
    }
  }
}

const fullURL = (url) => {
  let outputURL = url;
  let urlObject = new URL(url);
  if (!urlObject.pathname.includes(".xml")) {
    outputURL = `${urlObject.origin}/sitemap.xml`;
  }

  return outputURL;
};

const httpsURL = (url) => {
  if (!url.includes("http")) {
    return `https://${url}`;
  }
  return url;
};
const removeTrailingSlash = (str) => str.replace(/\/+$/g, "");
const sanitize = R.pipe(R.toLower, R.trim, removeTrailingSlash);

export const fixNakedURL = (url: any) => {
  if (Number(url) == url || R.isNil(url)) {
    return undefined;
  }
  const fix = R.pipe(sanitize, httpsURL);
  const finalURL = R.tryCatch(fix, R.empty);
  return finalURL(url);
};

export const getSitemap = async (
  url: string,
  option?: fetchXMLOption
): Promise<getSitemapResponse> => {
  let response: getSitemapResponse = {
    url,
    hasError: true,
    errorMessage: "هیچ سایت‌مپی پیدا نشد!",
  };
  const fixedURL = fixNakedURL(url);

  return Promise.resolve(fixedURL)
    .then((url) => isValidSitemap(url, option))
    .then(async (check) => {
      if (check.fetchError) {
        return { ...response, errorMessage: "سایت در دسترس نیست" };
      }

      if (check.isValidXML) {
        return { url: fixedURL, hasError: false };
      }

      if (!check.isValidXML) {
        const robots = await getSitemapFromRobotstxt(url, option);
        if (!robots.hasError) {
          return { url: robots.url, hasError: false };
        }
      }

      if (!check.isValidXML) {
        for await (const res of findSitemap(fixedURL)) {
          if (res?.isValidXML) {
            return { url: res.url, hasError: false };
          }
        }
      }
      return response;
    });
};

export const sitemapTimerHandler = (obj: SitemapResponse): SitemapResponse => {
  if (obj?.lastmod) {
    moment.locale("fa");
    const relativeTime = moment(obj.lastmod).fromNow();
    return {
      ...obj,
      relativeTime,
    };
  } else {
    return {
      ...obj,
      relativeTime: "نامشخص",
    };
  }
};

export const getSitemapFromRobotstxt = (
  url: string,
  option?: fetchXMLOption
): Promise<RobotTXTReturnType> => {
  const output: RobotTXTReturnType = {
    url,
    hasError: true,
    errorMessage: "Robots.txt پیدا نشد",
  };
  if (!isValidURL(url)) return Promise.resolve(output);

  const createRobotsUrl = (url: string) => {
    return `${new URL(url).origin}/robots.txt`;
  };

  const actions = R.compose(createRobotsUrl, httpsURL);

  const firstFix = R.tryCatch(actions, () => undefined);

  const fixedURL = firstFix(url);

  if (!fixedURL) return Promise.resolve(output);
  const robotsParser = (str) => {
    return str
      .toLowerCase()
      .split("\n")
      .reduce((acc, i) => {
        if (i.includes("sitemap")) {
          acc.push(i.split("sitemap:")[1].trim());
        }
        return acc;
      }, []);
  };
  return Promise.resolve(fixedURL)
    .then((url) => fetchXML(url, option))
    .then(robotsParser)
    .then((res) => {
      let outputURL = url;
      if (res.length > 0) {
        outputURL = res[0];
      }
      return {
        url: outputURL,
        hasError: res.length <= 0,
        errorMessage: res.length <= 0 ? "Robots.txt پیدا نشد" : "",
      };
    });
};
