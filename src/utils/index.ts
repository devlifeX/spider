import translate from "../locale";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
export * from "ramda";

export const hashPassword = (password: string): string => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const checkHashPassword = (
  plaintextPassword: string,
  hash: string
): boolean => bcrypt.compareSync(plaintextPassword, hash);

export const isValidMobileNumber = (mobile: string): boolean => {
  return /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/.test(mobile);
};

export const { l, _l } = translate;

export const mergeObjectToClass = (
  object: any | unknown,
  cls: any | unknown
): any => {
  for (const item in object) {
    cls[item] = object[item];
  }
  return cls;
};

export const sitemapFullPath = (url) => {
  process.env.SITEMAP_SAVE_DIR ||
    console.error("set SITEMAP_SAVE_DIR to env file");
  const dir = path.resolve(process.env.SITEMAP_SAVE_DIR);
  const _url = new URL(url);
  const fullPath = `${dir}/${_url.hostname}/`;
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
  return fullPath;
};
