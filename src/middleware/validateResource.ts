import {Request, Response} from 'express';
import { AnyZodObject } from 'zod';
import { log, logfile } from '../utils/logger';

const validateResource = (schema:AnyZodObject) => (req: Request, res: Response, next: Function) => {
    /**
     * Validates if the request body matches the schema.
     */
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error:any) {
        /**
         * if the shema is not valid, we send a 400 error.
         */
        log.error(`Error validating request: ${error.message}\nvalidateResource.ts`);
        return res.status(400).json({
            error: error.errors,
            message: error.message
        });
    }       
}

export default validateResource;