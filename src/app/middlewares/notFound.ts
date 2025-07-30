import { Request, Response } from "express";
import httpStatus from "http-status-codes";
const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    messate: "Route Not Found",
  });
};

export default notFound;
