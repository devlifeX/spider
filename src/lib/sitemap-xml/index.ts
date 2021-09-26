import cheerio from "cheerio";
import path from "path";
import axios from "axios";
import fs from "fs";
import { splitEvery, flatten } from "ramda";

import { SitemapMain } from "./types";

async function fetchXML(url) {
  const res = await axios(url);
  return res.data;
}

function* xmlLoader(urls: string[][]) {
  for (const urlPack of urls) {
    yield urlPack.map((url) => axios(url).then((res) => res.data));
  }
}

function isURLXML(url) {
  const ext = path.extname(url);
  return ext.toLocaleLowerCase() === ".xml";
}

function extractUrls(xml) {
  const urls: string[] = [];
  const $ = cheerio.load(xml, { xmlMode: true });

  $("loc").each(function (_, v) {
    const url = $(v).text();

    if (!urls.includes(url)) {
      urls.push(url);
    }
  });

  return urls;
}

async function saveOutput(urlsArray: string[], filename) {
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

export const isValidSitemap = async (url: string): Promise<boolean> => {
  const xmlContent = await fetchXML(url);
  return extractUrls(xmlContent).length > 0;
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

async function main({
  baseURL,
  sitemapContent,
  basicAuth,
  filename,
  isDuplicate,
  callbackOnEachItemFetched,
}: SitemapMain): Promise<string[]> {
  let output: string[] = [];
  let urls = [];
  let xml = null;

  if (baseURL) {
    xml = await fetchXML(baseURL);
  } else {
    xml = sitemapContent;
  }

  urls = extractUrls(xml);

  console.log(`Doing Recursive... total url in root=${urls.length}`);
  const XMLURL = urls.filter((url) => isURLXML(url));
  const notXMLURL = urls.filter((url) => !isURLXML(url));

  const splited: string[][] = splitEvery(1, XMLURL);

  callbackOnEachItemFetched({
    index: 0,
    total: splited.length,
    urls: [...XMLURL, ...notXMLURL],
    done: false,
  });

  let splitedIndex = 1;
  let tmp = [];
  for (const result of xmlLoader(splited)) {
    const feed = await Promise.all(result);
    const newURLs = feed.map((i) => extractUrls(i));
    tmp.push(newURLs);

    callbackOnEachItemFetched({
      index: splitedIndex,
      total: splited.length,
      urls: flatten(newURLs),
      done: splitedIndex >= splited.length,
    });

    splitedIndex++;
  }
  output = flatten(tmp);
  output = [...notXMLURL, ...output];

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

export { main, isURL };
