import express from "express";
import { Request, Response } from "express";
import { createSessionHandler, refreshAccessTokenHandler } from "../controller/auth.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();
/**
 * LOGIN
 * Create a new session for the user.
 */
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [User Session]
 *     summary: Create a new session for the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createSessionSchema'
 *     responses:
 *       200:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createSessionSchemaResponse'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Invalid email or password
 *       401:
 *         description: Please verify your account first
 *       500:
 *         description: Internal server error
 */
router.post("/api/auth/login", validateResource(createSessionSchema), createSessionHandler);
router.post("/api/sessions", validateResource(createSessionSchema), createSessionHandler);

/**
 * Refresh an access token.
 * @param req {refreshToken: string}
 */
/**
 * @openapi
 * /api/auth/refreshtoken:
 *   post:
 *     tags: [User Session]
 *     summary: Refresh an access token.
 *     parameters:
 *       - in: header
 *         name: x-refresh-token
 *         required: true
 *         description: The refresh token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/refreshAccessTokenSchemaResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
router.post("/api/auth/refreshtoken", refreshAccessTokenHandler);
router.post("/api/sessions/refresh", refreshAccessTokenHandler);

export default router;