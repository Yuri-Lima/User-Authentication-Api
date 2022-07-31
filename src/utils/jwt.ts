import jwt from 'jsonwebtoken';
import config from "config";
import {
    logDebug
} from './logger';

/**
 * Encodes a JWT token with the given payload and secret.
 * @param object - object to be encoded
 * @param keyName - key name to be used in the encoded object
 * @param options - options to be used in the encoding
 * @returns - encoded object
 */
export function signJwt(object: Object, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options ? : jwt.SignOptions | undefined) {
    const signingKey = Buffer.from(String(process.env.ACCESS_TOKEN_PRIVATE_KEY), 'base64').toString("ascii");
    return jwt.sign(object, signingKey, {
        ...(options && options),
        algorithm: 'RS256' //This is the algorithm that is used to sign the token for private key and public key.
    });
}
/**
 * Verifies a JWT token with the given payload and secret.
 * @param token - token to be verified
 * @param keyName - key name to be used in the encoded object
 * @param options - options to be used in the decoding
 * @returns - decoded object
 */

export function verifyJwt < T > (token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey", options ? : jwt.VerifyOptions | undefined): T | null {
    const publicKey = Buffer.from(String(process.env.ACCESS_TOKEN_PUBLIC_KEY), 'base64').toString("ascii");
    try {
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    } catch (error: any) {
        return null;

    }
}