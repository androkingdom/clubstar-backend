import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import SendError from "../utils/SendError";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    const formatted = err.flatten();

    res.status(400).json({
      message: "Validation Failed",
      code: "BAD_REQUEST",
      errors: formatted.fieldErrors,
      statusCode: 400,
      success: false,
    });

    return;
  }

  if (err instanceof SendError) {
    res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      success: false,
    });

    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
    success: false,
  });
};

export default errorHandler;
