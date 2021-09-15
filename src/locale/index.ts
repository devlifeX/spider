import { LocaleType } from "../types";
import { fa } from "./fa";

const sprintf =
  (arr: string[]) =>
  (str: string): string =>
    arr.reduce((acc, item) => acc.replace(/%s/, item), str);

const translate = (lang: LocaleType) => ({
  _l: (text: string, ...args: string[]) => {
    try {
      return args.length === 0
        ? text || "No Translation!"
        : sprintf(args)(text) || "No Translation!";
    } catch (error) {
      return "No Translation!";
    }
  },
  l: lang,
});

export default translate(fa);
