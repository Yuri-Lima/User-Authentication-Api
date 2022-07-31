import { object, string, TypeOf } from "zod"

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
