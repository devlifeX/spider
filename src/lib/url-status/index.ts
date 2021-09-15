import axios from "axios";
import * as t from "exectimer";
import { splitEvery, flatten } from "ramda";

const makeHttpCall = async (url: string) => {
  const id = Buffer.from(url).toString("base64");
  const tick = new t.Tick(`makeHttpCall-${id}`);
  tick.start();
  return await axios.get(url).then((res) => {
    const { status, statusText } = res;

    const { _currentUrl, _redirectCount, _redirects } =
      res.request._redirectable;

    tick.stop();
    const results = t.timers[`makeHttpCall-${id}`];

    return {
      time: results.parse(results.duration()),
      url: _currentUrl,
      redirectCount: _redirectCount,
      redirects: _redirects,
      status,
      statusText,
      bodySize: res.data.length,
    };
  });
};

export const run = async (urls, chunk = 10) => {
  const splited: string[][] = splitEvery(chunk, urls);

  const result = splited.map((urlChunk) =>
    urlChunk.map(async (url) => await makeHttpCall(url))
  );

  return Promise.all(flatten(result)).then((res) => {
    return res;
  });
};
