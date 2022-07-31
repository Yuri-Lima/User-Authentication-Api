//https://sematext.com/blog/node-js-error-handling/
import { Request, Response, NextFunction } from "express"
import httpErrorHandler from "http-errors";
import { logDebug } from "../utils/logger";

/**
 * Error Request Handler.
 */
export const createHttpErrorHandler = (req:Request, res:Response, next:NextFunction) => {
    next(new httpErrorHandler.NotFound());  // create a new NotFound error
}