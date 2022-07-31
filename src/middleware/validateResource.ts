import {Request, Response} from 'express';
import { AnyZodObject } from 'zod';

const validateResource = (schema:AnyZodObject) => (req: Request, res: Response, next: Function) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        return next();
    } catch (error:any) {
        /**
         * if the shema is not valid, we send a 400 error.
         */
        return res.status(400).json({
            error: error.errors,
            message: error.message
        });
    }       
}

export default validateResource;