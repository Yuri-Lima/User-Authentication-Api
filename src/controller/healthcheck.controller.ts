import { RequestHandler } from "express";
import { log, logfile } from "../utils/logger";

/**
 * It’s generally a best practice to provide this name wherever you can to have more readable stack traces.
 * Source https://stackify.com/node-js-error-handling/
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const healthcheck: RequestHandler = async function healthcheck(req, res, next) {
    const message = "Healthcheck is OK";
    return res
        .status(200)
        .json({
            message: message
        })
        .on("finish", () => {
            log.debug(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
        });
};