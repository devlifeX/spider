import { main } from "./index";

const noBasicAuthURL = "https://devlife.ir/site.xml";
const BasicAuthURL = "https://devlife.ir/sitemap/site.xml";
const RawNoBasicAuthURL = "devlife.ir/sitemap/site.xml";
const username = "dariush";
const password = "dariush";

test("Main with NO basic Auth and regular url", async () => {
  const results = await main({
    baseURL: noBasicAuthURL,
  });
  expect(results.length).toBe(2);
});
