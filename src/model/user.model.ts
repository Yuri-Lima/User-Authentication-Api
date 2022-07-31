/**
 * We are gonna export our typescript interface and our model.
 */

import { prop, getModelForClass, modelOptions, Severity, pre, DocumentType, index } from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import argo2 from "argon2";
import { logDebug } from "../utils/logger";

/**
 * Hide the private fields from the user.
 */
export const privateFields = [
    "password",// This is the password field.
    "verificationCode",// This is the verification code that is sent to the user.
    "passwordResetCode",// This is the code that is sent to the user to reset his password.
    "__v",// This is to make sure that the version is not shown in the response.
    "verified"// This is to make sure that the user is verified.
];

@pre<User>("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await argo2.hash(this.password);
    return;
})
@index({ email: 1 }) //Index the email field. This will make sure that the email is unique.
@modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: "Auth_Users"
    },
    options: {
        allowMixed: Severity.ALLOW, //This is to allow the use of the Severity enum in the model.
        customName: "Users" //This is to change the name of the model.
    }
})
export class User {
    @prop({ lowercase: true, required: true, unique: true })
    email: string;

    @prop({ required: true })
    fisrtName: string;

    @prop({ required: true })
    lastName: string;

    @prop({ required: false })
    middleName: string;

    @prop({ required: false })
    nickName: string;

    @prop({ required: true })
    password: string;

    @prop({ required: true, default: () => nanoid() })
    verificationCode: string;

    @prop()
    passwordResetCode: string | null;

    /**
     * @verified is a boolean that indicates if the user has verified his email address.
     */
    @prop({ default: false })
    verified: boolean;

    async validatePassword(this: DocumentType<User>, candidatePassword: string) {
        try {
            return await argo2.verify(this.password, candidatePassword); //Compare the password with the hash returning true or false.
        } catch (error: any) {
            logDebug.warn(error, "count not validate password");
            return false;
        }
    }
}
/**
 * getModelForClass came from typegoose.
 */
const UserModel = getModelForClass(User);

export default UserModel;