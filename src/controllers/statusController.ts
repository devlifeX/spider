import { Request, Response } from "express";
import { run } from "../lib/url-status";

export const ping = (req: Request, res: Response): any => {
  return res.ok("pong");
};

export const getStatus = (req: Request, res: Response): any => {
  const urls = [
    "https://vizzzzz.com/product/%d8%a7%d8%ad%d8%b3%d8%a7%d8%b3-%d9%87%d8%a7-%d9%88-%d8%b1%d9%81%d8%aa%d8%a7%d8%b1%d9%87%d8%a7%db%8c-%d9%85%d9%86-7-%d8%ae%d8%b1%da%af%d9%88%d8%b4-%da%a9%d9%88%da%86%d9%88%d9%84%d9%88%db%8c-%d8%b9/",
    "https://vizzzzz.com/product/%d8%a7%d8%ad%d8%b3%d8%a7%d8%b3-%d9%87%d8%a7-%d9%88-%d8%b1%d9%81%d8%aa%d8%a7%d8%b1%d9%87%d8%a7%db%8c-%d9%85%d9%86-8-%d8%ae%d8%b1%da%af%d9%88%d8%b4-%da%a9%d9%88%da%86%d9%88%d9%84%d9%88%db%8c-%d8%ae/",
    "https://vizzzzz.com/product/%d8%a7%d8%ad%d8%b3%d8%a7%d8%b3-%d9%87%d8%a7-%d9%88-%d8%b1%d9%81%d8%aa%d8%a7%d8%b1%d9%87%d8%a7%db%8c-%d9%85%d9%86-4-%d8%ae%d8%b1%da%af%d9%88%d8%b4-%da%a9%d9%88%da%86%d9%88%d9%84%d9%88%d8%8c%d8%b9/",
    "https://vizzzzz.com/product/%d8%a7%d8%ad%d8%b3%d8%a7%d8%b3-%d9%87%d8%a7-%d9%88-%d8%b1%d9%81%d8%aa%d8%a7%d8%b1%d9%87%d8%a7%db%8c-%d9%85%d9%86-5-%d8%ae%d8%b1%da%af%d9%88%d8%b4-%da%a9%d9%88%da%86%d9%88%d9%84%d9%88%db%8c-%d8%aa/",
  ];
  run(urls).then((data) => {
    console.log(data);

    return res.ok("pong", 200, { data });
  });
};
