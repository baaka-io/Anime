import { NextFunction, Request, Response } from "express"

export const arrayQueryParams = (params: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Object.keys(req.query).forEach(key => {
    if (params.includes(key)) {
      req.query[key] = req.query[key]
        .split(",")
        .map((x: any) => (isNaN(x) ? x : +x))
    } else if (!isNaN(req.query[key])) req.query[key] = +req.query[key]
  })
  next()
}
