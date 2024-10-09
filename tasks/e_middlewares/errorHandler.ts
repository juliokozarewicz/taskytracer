import { Request, Response, NextFunction } from 'express';
import { logsGenerator } from '../f_utils/logsGenerator';
import { z } from 'zod';

// create error function
//------------------------------------------------------------------------
export interface CustomErrorOptions {
  message: string;
  code: number;
  next?: string;
  prev?: string;
}

export function createCustomError({
  message,
  code,
  next,
  prev,
}: CustomErrorOptions): Error & { code?: number; next?: string; prev?: string } {
  const error = new Error(message) as Error & { code?: number; next?: string; prev?: string };
  error.code = code;
  error.name = 'CustomErrorHandler';
  error.next = next;
  error.prev = prev;
  return error;
}
//------------------------------------------------------------------------

// middleware error
//------------------------------------------------------------------------
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  // create custom error
  //------------------------------------------------------------------------
  if (err.name === 'CustomErrorHandler') {
    res.status(err.code).json({
      status: "error",
      statusCode: err.code,
      message: err.message,
      links: {
        self: req.originalUrl,
        next: err.next,
        prev: err.prev,
      }
    });
    return;
  }
  //------------------------------------------------------------------------

  // create syntax error
  //------------------------------------------------------------------------
  if (err instanceof SyntaxError) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "bad request, please check the data sent",
      links: {
        self: req.originalUrl,
      }
    });
    return;
  }
  //------------------------------------------------------------------------

  // create ZOD error
  //------------------------------------------------------------------------
  if (err instanceof z.ZodError) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: `(${err.errors[0].path}) ${err.errors[0].message}`,
      links: {
        self: req.originalUrl,
      }
    });
    return;
  }
  //------------------------------------------------------------------------

  // server error
  //------------------------------------------------------------------------
  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "An error has occurred, please try again later",
    links: {
      self: req.originalUrl,
      next: '/',
      prev: '/',
    }
  });

  logsGenerator(
    `${req.ip}`,
    'CRITICAL',
    500,
    `${req.method}`,
    `${req.url}`,
    `${req.headers['user-agent']}`,
    `${err.message}`
  )
  //------------------------------------------------------------------------
};

export default errorHandler;
//------------------------------------------------------------------------