import { Router } from "express";
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler } from "../controller/user.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schema/user.schema";

const router = Router();

/**
 * Create a new user
 */
router.post("/api/users", validateResource(createUserSchema), createUserHandler);
/**
 * Verify user by id and check if machs with the own verification code
 */
router.post("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);
/**
 * Step 1 of forgot password. Send a verification code to the user's email address.
 * Forgot password
 * Request the code to reset the password
 */
router.post("/api/users/forgot-password", validateResource(forgotPasswordSchema), forgotPasswordHandler);
/**
 * Step 2 of forgot password. Reset the password.
 * Reset password
 * User the reset password code to reset the password
 */
router.post("/api/users/reset-password/:id/:resetPasswordCode", validateResource(resetPasswordSchema), resetPasswordHandler);
/**
 * Get the deserialized user from the request.
 * We dont want to expose the user object to the client.
 * We must protect the user object from the client.
 * We need to check if the user is authenticated. Before we can access the user object.
 */
router.get("/api/users/me", requireUser, getCurrentUserHandler);

export default router;