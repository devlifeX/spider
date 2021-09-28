import {
  main,
  fixNakedURL,
  isValidSitemap,
  getSitemap,
  fetchXML,
} from "./index";

jest.setTimeout(30000);

const domain = "devlife.ir";
const noBasicAuthURL = "https://devlife.ir/site.xml";
const BasicAuthURL = "https://devlife.ir/sitemap/site.xml";
const NakedURL = "devlife.ir/site.xml";
const fakeURL = "test";
const username = "dariush";
const password = "dariush";

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

test("Fix naked url", () => {
  const result = fixNakedURL(NakedURL);
  expect(result).toBe(noBasicAuthURL);

  const resultDomain = fixNakedURL(domain);
  expect(resultDomain).toBe(`https://${domain}`);
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
