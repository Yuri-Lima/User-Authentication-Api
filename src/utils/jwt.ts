import jwt from 'jsonwebtoken';
import { log, logfile } from './logger';

/**
 * Encodes a JWT token with the given payload and secret.
 * @param object - object to be encoded
 * @param keyName - key name to be used in the encoded object
 * @param options - options to be used in the encoding
 * @returns - encoded object
 */
export function signJwt(object: Object, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options ? : jwt.SignOptions | undefined) {
    let key_env;
    if (keyName === "accessTokenPrivateKey") {
        log.info("Signing access token");
        key_env = process.env.DEV_ACCESSTOKENPRIVATEKEY;
    } else if (keyName === "refreshTokenPrivateKey") {
        log.info("Signing refresh token");
        key_env = process.env.DEV_REFRESHTOKENPRIVATEKEY;
    }
    const refreshKey = Buffer.from(String(key_env), 'base64').toString("ascii");
    return jwt.sign(object, refreshKey, {
        ...(options && options),
        algorithm: 'HS256' //This is the algorithm that is used to sign the token for private key and public key.HS256
    });
    // If the key name is not valid, throw an error.
    throw new Error(`Configuration Sign key ${keyName} not found.`);
}
/**
 * Verifies a JWT token with the given payload and secret.
 * @param token - token to be verified 
 * @param keyName - key name to be used in the encoded object
 * @param options - options to be used in the decoding
 * @returns - decoded object
 */
export function verifyJwt < T > (token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey", options ? : jwt.VerifyOptions | undefined): T | null {
    try {
        let key_env;
        if (keyName === "accessTokenPublicKey") {
            log.info("Verifying access token");
            key_env = process.env.DEV_ACCESSTOKENPUBLICKEY;
        } else if (keyName === "refreshTokenPublicKey") {
            log.info("Verifying refresh token");
            key_env = process.env.DEV_REFRESHTOKENPUBLICKEY;
        }
        const verifyKey = Buffer.from(String(key_env), 'base64').toString("ascii");
        const decoded = jwt.verify(token, verifyKey) as T;
        return decoded;
    } catch (error: any) {
        log.error(error, "Error in verifying token");
        return null;
    }
    // if no key is found, throw an error.
    throw new Error(`Configuration Verify key ${keyName} not found.`);
}