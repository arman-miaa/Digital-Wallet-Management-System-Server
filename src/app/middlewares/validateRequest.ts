import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {


      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      console.log("✅ Validation Passed"); // 👈 Passed
      next();
    } catch (error: any) {
      console.error("❌ Validation Error:", error); // 👈 Error details

      // Optional: Send error response (or let global error handler catch it)
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.errors || error,
      });
    }
  };
