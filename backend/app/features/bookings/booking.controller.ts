import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export async function userBooking(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {

}