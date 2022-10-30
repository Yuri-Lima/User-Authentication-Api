import { Router } from "express";
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler, verifyUserHandlerGet } from "../controller/user.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema, verifyUserSchemaGet } from "../schema/user.schema";

const router = Router();

/**
 * Create a new user
 */
/**
 * @openapi
 * /api/users/register:
 *   post:
 *     tags: [Register - Verify - Forgot/Reset Password - GetCurrentUser]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUserSchemaInput'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createUserSchemaResponse'
 *       400:
 *         description: Bad request
 *       409:
 *        description: User already exists [Conflict]
 *       500:
 *         description: Internal server error
 *      
 */
router.post("/api/users/register", validateResource(createUserSchema), createUserHandler);
/**
 * Verify user by id and check if machs with the own verification code
 */
router.post("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler); // POST + params
/**
 * @openapi
 * /api/users/verify/{id}/{verificationCode}:
 *   get:
 *     tags: [Register - Verify - Forgot/Reset Password - GetCurrentUser]
 *     summary: Verify user by id and check if machs with the own verification code
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the user
 *         schema:
 *           type: string
 *       - in: path
 *         name: verificationCode
 *         required: true
 *         description: The verification code of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/verifyUserSchemaResponse'
 *       201:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/verifyUserSchemaResponse'
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *        description: Internal server error
 */
router.get("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler); // Using GET + params

router.get("/api/users/verify", validateResource(verifyUserSchemaGet), verifyUserHandlerGet); // Using GET + query
/**
 * Step 1 of forgot password. Send a verification code to the user's email address.
 * Forgot password
 * Request the code to reset the password
 */
/**
 * @openapi
 * /api/users/forgot-password:
 *   post:
 *     tags: [Register - Verify - Forgot/Reset Password - GetCurrentUser]
 *     summary: Request the code to reset the password
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/forgotPasswordSchema'
 *     responses:
 *       201:
 *         description: Verification code sent to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/forgotPasswordSchemaResponse'
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/api/users/forgot-password", validateResource(forgotPasswordSchema), forgotPasswordHandler);
/**
 * Step 2 of forgot password. Reset the password.
 * Reset password
 * User the reset password code to reset the password
 */
/**
 * @openapi
 * /api/users/reset-password/{id}/{resetPasswordCode}:
 *   post:
 *     tags: [Register - Verify - Forgot/Reset Password - GetCurrentUser]
 *     summary: User the reset password code and id to reset the password
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The id of the user
 *         schema:
 *           type: string
 *       - in: path
 *         name: resetPasswordCode
 *         required: true
 *         description: The reset password code
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/resetPasswordSchema'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/resetPasswordSchemaResponse'
 *       201:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/resetPasswordSchemaResponse'
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found - User does not exist or reset password code is invalid
 *       500:
 *         description: Internal server error
 */ 
router.post("/api/users/reset-password/:id/:resetPasswordCode", validateResource(resetPasswordSchema), resetPasswordHandler);
/**
 * Get the deserialized user from the request.
 * We dont want to expose the user object to the client.
 * We must protect the user object from the client.
 * We need to check if the user is authenticated. Before we can access the user object.
 */
/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Register - Verify - Forgot/Reset Password - GetCurrentUser]
 *     summary: Get the deserialized user from the request should be authenticated
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createUserSchemaResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */ 
router.get("/api/users/me", requireUser, getCurrentUserHandler);

export default router;