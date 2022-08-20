import { Request, Response, NextFunction } from "express"
import { log, logfile } from "../utils/logger";

/**
 * Rules of the application [Access-Control-Allow].
 */
export const rules= (req:Request, res:Response, next:NextFunction) => {
    log.debug("Access-Control-Allow");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({}).on("finish", () => {
            log.debug(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
        });
    }
    return next();
};