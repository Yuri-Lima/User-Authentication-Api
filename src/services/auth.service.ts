import { omit } from "lodash";
import { Document } from "mongoose";
import SessionModel from "../model/session.model";
import { privateFields, User } from "../model/user.model";
import { signJwt } from "../utils/jwt";

/**
 * If the access token is expired, we will refresh it.
 */
//=====================================================================================================================


/**
 * Given a user, this function will create a JWT token and return it.
 * @param user - user to be encoded
 * @returns - encoded user
 */
export function signAccessToken(user: Document<User>) {
    const payload = user.toJSON();// toJSON is a method that converts the user to a plain object.
    const omitedFiels = omit(payload, privateFields);//Omit the private fields from the user.
    const options = { 
        expiresIn: "15m",//This is the expiration time of the access token.
     };
    const accessToken = signJwt(omitedFiels, "accessTokenPrivateKey", options);//Create the access token.
    return accessToken;
}
/**
 * Signs a refresh token if the user is logged in is valid.
 * @param param0 - user to be encoded
 * @returns - encoded user
 */
export async function signRefreshToken({userID}: {userID: string}) {
    const session = await createSession({
        userID: userID
    })
    /**
     * We want to sign the refresh token with the userID.
     * So we need to add the userID to the payload.
     * And make sure that token is valid.
     */
    const options = {
        expiresIn: "31d",//This is the expiration time of the refresh token.
    };
    const refreshToken = signJwt({ sessionId: session._id }, "refreshTokenPrivateKey", options);//Create the refresh token.
    return refreshToken;
}
/**
 * Creates a session for a user.
 * Receives a userID and creates a session for that user.
 * returns the session with the userID as well.
 */
export async function createSession({userID}: {userID: string}) {
    return SessionModel.create({ user: userID });
}
/**
 * Given a refresh token, this function will return a new access token.
 * @param sessionID - sessionID to be verified
 * @returns - true if the session is valid, false otherwise.
 */
export async function findSessionById(sessionID: string) {
    return SessionModel.findById(sessionID);
}