import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';

const requireUser = (req:Request, res:Response, next:NextFunction) => {
    const user = res.locals.user;
    if (!user) {
        log.error(`requireUser: User not found`);
        return res.sendStatus(403);// Forbidden (403) - The server understood the request but refuses to authorize it.
    }
    return next();
}

export default requireUser;