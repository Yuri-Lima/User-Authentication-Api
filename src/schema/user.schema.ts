/**
 * This schema is to valitate the request when you want to create a new user.
 */
import { object, string, TypeOf } from "zod"
import { log } from "../utils/logger";

/**
 * @openapi
 * components:
 *   schemas:
 *     createUserSchemaInput:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - password
 *         - passwordConfirmation
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           default: y.m.lima19@gmail.com
 *           description: The email of the user.
 *         firstName:
 *           type: string
 *           default: Naira
 *           description: First name of the user.
 *         middleName:
 *           type: string
 *           default: Romeu
 *           description: Middle name of the user.
 *         lastName:
 *           type: string
 *           default: Viana
 *           description: Last name of the user.
 *         nickname:
 *           type: string
 *           default: Vivi
 *           description: Nickname of the user.
 *         bio:
 *           type: string
 *           default: Welcome to my profile
 *           description: Bio of the user.
 *         otherNames:
 *           type: string
 *           default: Free Field
 *           description: Other fields names.
 *         password:
 *           type: string
 *           default: stringPassword123
 *           description: Password of the user.
 *         passwordConfirmation:
 *           type: string
 *           default: stringPassword123
 *           description: Password confirmation of the user.
 *     createUserSchemaResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         middleName:
 *           type: string
 *         lastName:
 *           type: string
 *         nickname:
 *           type: string
 *         bio:
 *           type: string
 *         otherNames:
 *           type: string
 *         _id:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */
export const createUserSchema = object({
    /**
     * Body of the request
     */
    body: object({
        /**
         * The user will be able to login with the email address.
         * 
         * **/
        firstName: string({
            required_error: "firstName is required",
        }),
        middleName: string().optional(),
        lastName: string({
            required_error: "lastName is required",
        }),
        nickName: string().optional(),
        bio: string().optional(),
        otherNames: string().optional(),
        /**
         * Zod is able to validate passwords. If password matches with the passwordConfirmation
         * For to do that we user refine function.
         */
        password: string({
            required_error: "password is required",
        }).min(8, "password must be at least 8 characters"),
        passwordConfirmation: string({
            required_error: "passwordConfirmation is required",
        }).min(8, "password must be at least 8 characters"),
        email: string({
            required_error: "email is required",
        }).email("email must be a valid email"),
    }).refine((data)=> data.password === data.passwordConfirmation , {
        message: "password and passwordConfirmation must match",
        path: ["passwordConfirmation"]
    })
})
/**
 * There is one good thing about Zod. It is able to validate the request body and from that schema export the typeScript interface.
 */

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"] //We dont want to the object inside of the CreateUserInput, so we can just send the body property.
//==========================================================================================================================
/**
 * @openapi
 * components:
 *   schemas:
 *     verifyUserSchema:
 *       type: object
 *       required:
 *         - id
 *         - verificationCode
 *       properties:
 *         id:
 *           type: string
 *           default: 0123456789
 *           description: User's id.
 *         verificationCode:
 *           type: string
 *           default: 0123456789
 *           description: Verification code sent to the user's email.
 *     verifyUserSchemaResponse:
 *       type: object
 *       required:
 *         - id
 *         - verificationCode
 *       properties:
 *         id:
 *           type: string
 *         verificationCode:
 *           type: string
 */
export const verifyUserSchema = object({
    /**
     * Params of the request
     * @param id - The id of the user
     */
    params: object({
        id: string({
            required_error: "id is required",
        }),
        verificationCode: string({
            required_error: "verificationCode is required",
        })
    })
})
/**
 * Params is the query params of the request.
 */
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"]
//==========================================================================================================================
export const verifyUserSchemaGet = object({
    /**
     * Query of the request
     * @query id - The id of the user
     */
     query: object({
        id: string({
            required_error: "id is required",
        }),
        verificationCode: string({
            required_error: "verificationCode is required",
        })
    })
})
/**
 * Params is the query params of the request.
 */
export type VerifyUserInputGet = TypeOf<typeof verifyUserSchemaGet>["query"]
//==========================================================================================================================
/**
 * Step 1: Forgot password handler using email to send a reset code.
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     forgotPasswordSchema:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           default: y.m.lima19@gmail.com
 *           description: The email of the user.
 *     forgotPasswordSchemaResponse:
 *       type: object
 *       required:
 *         - id
 *         - passwordResetCode
 *       properties:
 *         id:
 *           type: string
 *         passwordResetCode:
 *           type: string
 */
export const forgotPasswordSchema = object({
    /**
     * Body of the request
     * @param email - The email of the user
     */
    body: object({
        email: string({
            required_error: "email is required",
        }).email("email must be a valid email"),
    })
})
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"]
//==========================================================================================================================
/**
 * Step 2: Reset password handler using reset code to reset the password.
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     resetPasswordSchema:
 *       type: object
 *       required:
 *         - password
 *         - passwordConfirmation
 *       properties:
 *         password:
 *           type: string
 *           default: stringPassword123
 *           description: The new password of the user.
 *         passwordConfirmation:
 *           type: string
 *           default: stringPassword123
 *           description: The new password confirmation of the user.
 *     resetPasswordSchemaResponse:
 *       type: object
 *       required:
 *         - id
 *         - resetPasswordCode
 *       properties:
 *         id:
 *           type: string
 *         resetPasswordCode:
 *           type: string
 *         password:
 *           type: string
 *           default: stringPassword123
 *           description: Password of the user.
 *         passwordConfirmation:
 *           type: string
 *           default: stringPassword123
 *           description: Password confirmation of the user.
 */
export const resetPasswordSchema = object({
    /**
     * Parameters of the request to verify the reset code provided by the user id.
     */
    params: object({
        id: string({
            required_error: "id is required",
        }),
        resetPasswordCode: string({
            required_error: "resetPasswordCode is required",
        })
    }),
    /**
     * Body of the request to reset the password.
     */
    body: object({
        password: string({
            required_error: "password is required",
        }).min(8, "password must be at least 8 characters"),
        passwordConfirmation: string({
            required_error: "passwordConfirmation is required",
        }).min(8, "password must be at least 8 characters"),
    }).refine((data)=> data.password === data.passwordConfirmation , {
        message: "password and passwordConfirmation must match",
        path: ["passwordConfirmation"]
    })
});
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>