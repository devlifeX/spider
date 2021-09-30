import {
  main,
  fixNakedURL,
  isValidSitemap,
  getSitemap,
  sitemapTimerHandler,
  getSitemapFromRobotstxt,
} from "./index";

jest.setTimeout(30000);

const domain = "devlife.ir";
const noBasicAuthURL = "https://devlife.ir/site.xml";
const BasicAuthURL = "https://devlife.ir/sitemap/site.xml";
const NakedURL = "devlife.ir/site.xml";
const fakeURL = "test";
const username = "dariush";
const password = "dariush";

test("fixNakedURL", () => {
  const result = "https://devlife.ir";
  const fullURL = "https://devlife.ir/sitemap.xml";
  const fullURLHTTP = "http://devlife.ir/sitemap.xml";

  expect(fixNakedURL(22)).toBe(undefined);
  expect(fixNakedURL("https://devlife.ir")).toBe(result);
  expect(fixNakedURL("https://devlife.ir//")).toBe(result);
  expect(fixNakedURL("https://devlife.ir///")).toBe(result);
  expect(fixNakedURL("https://devlife.ir/sitemap_index.xml")).toBe(
    "https://devlife.ir/sitemap_index.xml"
  );
  expect(fixNakedURL("https://devlife.ir/sitemap.xml")).toBe(fullURL);
  expect(fixNakedURL("devlife.ir/sitemap.xml")).toBe(fullURL);
  expect(fixNakedURL("Devlife.ir/sitemap.xml")).toBe(fullURL);
  expect(fixNakedURL("DEVLIFE.IR/SITEMAP.XML")).toBe(fullURL);
  expect(fixNakedURL(" Devlife.Ir ")).toBe(result);

  expect(fixNakedURL("http://devlife.ir/sitemap.xml")).toBe(fullURLHTTP);

  expect(fixNakedURL("")).toBe(undefined);
  expect(fixNakedURL("22")).toBe(undefined);
});

test("Get sitemap from robots and naked url", async () => {
  const suncces1 = await getSitemap("letsgouni.com");
  const sucess2 = await getSitemap("devlife.ir");
  expect(suncces1.hasError).toBe(false);
  expect(sucess2.hasError).toBe(false);
});

test("Get sitemap from robots.txt", async () => {
  const success = await getSitemapFromRobotstxt("letsgouni.com");
  // const re = await getSitemapFromRobotstxt("rade.ir");
  // const failed = await getSitemapFromRobotstxt("vizzzzz.com");
  const failed = await getSitemapFromRobotstxt(domain);

  expect(success.hasError).toBe(false);
  expect(failed.hasError).toBe(true);
});

test("Add moment to lastmod", async () => {
  const results = await main({
    baseURL: noBasicAuthURL,
  });

  expect(results[0].relativeTime.length).toBeGreaterThan(3);
});

test("Main with basic Auth and regular url", async () => {
  const results = await main({
    baseURL: BasicAuthURL,
    basicAuth: {
      hasBasicAuth: true,
      basicAuthPassword: password,
      basicAuthUsername: username,
    },
  });

  expect(results.length).toBe(2);
});

test("It should throw error", async () => {
  try {
    const result = await getSitemap(fakeURL);
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});

test("Is valid sitemap url", async () => {
  const result = await isValidSitemap(noBasicAuthURL);
  expect(result.fetchError).toBe(false);
  expect(result.isValidXML).toBe(true);
});

test("It should get sitemap url from naked and non-xml url", async () => {
  const result = await getSitemap(domain);
  expect([
    `https://${domain}/sitemap_index.xml`,
    `https://${domain}/sitemap.xml`,
  ]).toContain(result.url);
});

test("Get sitemap from naked url", async () => {
  const result = await getSitemap(NakedURL);
  expect(result.url).toBe(noBasicAuthURL);
});

test("Main with NO basic Auth and regular url", async () => {
  const results = await main({
    baseURL: noBasicAuthURL,
  });
  expect(results.length).toBe(2);
});

test("Get sitemap from fake url", async () => {
  const result = await isValidSitemap(fakeURL);
  expect(result.fetchError).toBe(true);
  expect(result.isValidXML).toBe(false);
});
