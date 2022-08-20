/**
 * This schema is to valitate the request when you want to create a new user.
 */

import { object, string, TypeOf } from "zod"

export const createUserSchema = object({
    /**
     * Body of the request
     */
    body: object({
        fisrtName: string({
            required_error: "firstName is required",
        }),
        middleName: string().optional(),
        lastName: string({
            required_error: "lastName is required",
        }),
        nickName: string().optional(),
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
/**
 * Step 1: Forgot password handler using email to send a reset code.
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