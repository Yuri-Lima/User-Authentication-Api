import {Request, Response, RequestHandler} from "express";
import { Jwt, JwtPayload } from "jsonwebtoken";
import { get } from "lodash";
import { Document } from "mongoose";
import { isValid } from "zod";
import SessionModel from "../model/session.model";
import { User } from "../model/user.model";
import { createSessionInput } from "../schema/auth.schema";
import { findSessionById, signAccessToken, signRefreshToken } from "../services/auth.service";
import { findUserByEmail, findUserById } from "../services/user.service";
import { verifyJwt } from "../utils/jwt";
import { log, logfile } from "../utils/logger";


/**
 * Login a user
 * Step 1: Create a new session for the user.
 * @param req {email: string, password: string}
 * @param res 
 * @returns {accessToken and refreshToken}
 */
export async function createSessionHandler (req:Request<{},{},createSessionInput,{}> , res:Response) {
    const { email, password } = req.body;
    try {
        /**
         * We dont want to say to the client side that the user is registered or not.
         */
        const message = "Invalid email or password";
        /**
         * Find the user by email.
         */
        const user = await findUserByEmail(email);
        if(!user) {
            return res.status(404).json({
                message: message
            });
        }
        if(!user.verified) {
            return res.status(401).json({
                message: "Please verify your account first"
            });
        }
        /**
         * Check if the user password matches the password provided.
         * If it is not valid, return a 401.
         */
        const isValid:boolean = await user.validatePassword(password);
         if(!isValid) {
            return res.status(401).json({
                message: message
            });
        }
        /**
         * Sign a access token.
         */
        const accessToken = signAccessToken(user);
        log.debug(`createSessionHandler: Email: ${email}\nPassword: ${password}\nUser: ${user}\nValid: ${isValid}\nAccessToken: ${accessToken}`);

        /**
         * Sign a refresh token.
         */
        const refreshToken = await signRefreshToken({ userID: user._id });``

        /**
         * Send the access token and refresh token to the client.
         */
        res.status(200).json({
            message: "Session created successfully",
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error:any) {
        return res.status(500).json({
            error: JSON.stringify(error),
            message: "Session creation failed"
        });
    }
}

export async function refreshAccessTokenHandler (req:Request, res:Response){
    try {
        const refreshToken = get(req, "headers.x-refresh-token");
        const decoded = verifyJwt<{sessionId:string}>(refreshToken, "refreshTokenPublicKey");
        /**
         * If could not decode the token, return a 401.
         * If the token is not valid, return a 401.  
         */        
        if(!decoded) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }
        const session = await findSessionById(decoded.sessionId);
        /**
         * Find the session by the sessionId.
         * If the session is not found, return a 401.
         */
        if(!session || !session.valid) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }
        const user = await findUserById(String(session.user));
        /**
         * Find the user by the userId from the sessionId.
         */
        if(!user) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const accessToken = signAccessToken(user);
        
        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken: accessToken
        });
    } catch (error) {
        
    }
}