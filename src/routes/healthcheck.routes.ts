import { Router } from "express";
import { healthcheck } from "../controller/healthcheck.controller";

const router = Router();
/**
 * @openapi
 * /api/health-check:
 *   get:
 *     tags: [Healthcheck]
 *     summary: Check if the application is up and running
 *     description: Responds with a 200 status code if the server is up and running
 *     responses:
 *       200:
 *         description: Application is up and running
 */
router.get("/api/health-check", healthcheck);

export default router;