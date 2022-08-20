import express from "express";
import { Request, Response } from "express";
import { createSessionHandler, refreshAccessTokenHandler } from "../controller/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();
/**
 * Create a new session for the user.
 */
router.post("/api/sessions", validateResource(createSessionSchema), createSessionHandler);

/**
 * Refresh an access token.
 * @param req {refreshToken: string}
 */
router.post("/api/sessions/refresh", refreshAccessTokenHandler);

router.get("/", (req: Request, res: Response) => {
    res.send("The server is up and running\n");
});


export default router;