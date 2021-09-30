import { isValidateURL } from "../src/utils";

test("isValidateURL", () => {
  expect(isValidateURL("https://devlife.ir")).toBe(true);
  expect(isValidateURL("devlife.ir")).toBe(true);
  expect(isValidateURL("devlife.ir/sitemap.xml")).toBe(true);

  expect(isValidateURL("")).toBe(false);
  expect(isValidateURL(22)).toBe(false);
  expect(isValidateURL("22")).toBe(false);
  expect(isValidateURL("fhsdjhfjk")).toBe(false);
  expect(isValidateURL([])).toBe(false);
  expect(isValidateURL({})).toBe(false);
  expect(isValidateURL(null)).toBe(false);
  expect(isValidateURL(undefined)).toBe(false);
});
