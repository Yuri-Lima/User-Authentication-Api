import { object, string, TypeOf } from "zod"


/**
 * @openapi
 * components:
 *   schemas:
 *     createSessionSchema:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           default: y.m.lima19@gmail.com
 *           description: The email of the user. 
 *         password:
 *           type: string
 *           default: stringPassword123
 *           description: Password of the user.
 *     createSessionSchemaResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     refreshAccessTokenSchemaResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string 
 */
export const createSessionSchema = object({
    body: object({
        email: string({
            required_error: "Email is required"
        }).email("Email is not valid"),
        password: string({
            required_error: "Password is required"
        }).min(8, "Password must be at least 8 characters long"),
    }).required()
})
export type createSessionInput = TypeOf<typeof createSessionSchema>["body"]
