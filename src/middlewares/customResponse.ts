import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Response {
      fail: (message: string, code?: number, args?: any) => void;
      ok: (message: string, code?: number, args?: any) => void;
    }
  }
}

export const failResponseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  res.fail = (message: string, code = 500, args?: any) =>
    res.status(code).json({
      ...{
        message,
        successful: false,
      },
      ...args,
    });

  next();
};

export const successResponseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  res.ok = (message: string, code = 200, args) =>
    res.status(code).json({
      ...{
        message,
        successful: true,
      },
      ...args,
    });

  next();
};
