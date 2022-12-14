import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { log, logfile } from "../utils/logger";

/**
 * Headers accept x-access-token, authorization, x-authorization.
 * @param req - Request object.
 * @param res - Response object.
 * @param next - Next function.
 * @returns - Next function.
 */
export const deserializeUser = async (req: Request, res:Response, next:NextFunction)=>{
    const accessToken = (req.headers["x-access-token"] || req.headers["authorization"] || req.headers["x-authorization"] || "").toString().split(" ")[1];// split to get the Bearer token.
    if (!accessToken) {
        // if (!Boolean(process.env.TS_NODE_DEV)) {// if not in development mode, return 401.
        //     return res
        //         .status(401)
        //         .json({
        //             message: "Unauthorized"
        //         })
        //         .on("finish", () => {
        //             log.debug(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
        //         });   
        // }
        log.debug(`DeserializeUser: No access token provided.`);
        return next();
    }
    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");
    if(decoded){
        log.debug(`\nDeserialize User\naccessToken: ${accessToken}\ndecoded: ${JSON.stringify(decoded)}`);
        res.locals.user = decoded;
    }
    return next();
}