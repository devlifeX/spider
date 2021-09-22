import cheerio from "cheerio";
import path from "path";
import axios from "axios";
import fs from "fs";
import { SitemapMain } from "./types";

async function fetchXML(url) {
  const res = await axios(url);
  return res.data;
}

function isURLXML(url) {
  const ext = path.extname(url);
  return ext.toLocaleLowerCase() === ".xml";
}

function extractUrls(xml) {
  const urls = [];
  const $ = cheerio.load(xml, { xmlMode: true });

  $("loc").each(function (_, v) {
    const url = $(v).text();

    if (!urls.includes(url)) {
      urls.push(url);
    }
  });

  return urls;
}

function saveOutput(urlsArray, filename) {
  process.env.SITEMAP_SAVE_DIR ||
    console.error("set SITEMAP_SAVE_DIR to env file");
  const dir = path.resolve(process.env.SITEMAP_SAVE_DIR || __dirname);
  const file = fs.createWriteStream(`${dir}/${filename}`);
  file.on("error", function (err) {
    console.log(`Error: ${err}`);
  });
  urlsArray.forEach(function (v) {
    file.write(v + "\n");
  });
  file.end();
}

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
  isRecursive,
  filename,
  isDuplicate,
}: SitemapMain) {
  let output = [];
  let urls = [];
  let xml = null;

  if (baseURL) {
    xml = await fetchXML(baseURL);
  } else {
    xml = sitemapContent;
  }

  urls = extractUrls(xml);

  if (isRecursive) {
    console.log("Doing Recursive... Please wait...");
    const pendingURLArray = urls.map((url) => isURLXML(url) && fetchXML(url));
    const newUrls = await axios.all(pendingURLArray).then((responseArr) => {
      return responseArr.map((xml) => extractUrls(xml));
    });
    output = newUrls.reduce((acc, url) => {
      acc.push(...url);
      return acc;
    }, urls);
  } else {
    output = urls;
  }

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
    console.log(`${output.length}, items saved at ${path.resolve(filename)}`);
  }

  return output;
}

export { main, isURL };