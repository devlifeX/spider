import { isValidURL } from "../src/utils";

test("isValidURL", () => {
  expect(isValidURL("https://devlife.ir")).toBe(true);
  expect(isValidURL("devlife.ir")).toBe(true);
  expect(isValidURL("devlife.ir/sitemap.xml")).toBe(true);

  expect(isValidURL("")).toBe(false);
  expect(isValidURL(22)).toBe(false);
  expect(isValidURL("22")).toBe(false);
  expect(isValidURL("fhsdjhfjk")).toBe(false);
  expect(isValidURL([])).toBe(false);
  expect(isValidURL({})).toBe(false);
  expect(isValidURL(null)).toBe(false);
  expect(isValidURL(undefined)).toBe(false);
});
