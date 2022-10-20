/**
 * We are gonna export our typescript interface and our model.
 */

import { prop, getModelForClass, modelOptions, Severity, pre, DocumentType, index } from "@typegoose/typegoose";
import { nanoid } from "nanoid";
/**
 * This library is used to hash the password. However, we are not gonna use it in this project. Because we are gonna use the library bcryptjs instead.
 * Problems with ARGON2: to has the passsword. It is not supported somehow. 
 * */
// import * as argon2 from "argon2";
import bcrypt from "bcrypt"; // We are gonna use this library instead of argon2
import { log, logfile } from "../utils/logger";

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
/**
 * Pre save hook.
 * This is a hook that is gonna run before the user is saved.
 * We are gonna hash the password before the user is saved.
 * We are gonna use the bcryptjs library to hash the password.
 * The User Class is gonna be the target which is gonna provide THIS.VARIABLE.
 */
@pre<User>("save", function () {
    try {
        const saltRounds = 12; // This is the number of rounds that the password is gonna be hashed.
        if (!this.isModified("password")) return; // If the password is not modified, then we dont need to hash it.
        const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt
        const hash = bcrypt.hashSync(this.password, salt); // Hash the password
        // const hash = await argon2.hash(this.password, {type: argon2.argon2id});
        this.password = hash; // Set the password to the hash
        log.debug(`User pre save hook: ${JSON.stringify(this.password)}`);
        return;
    } catch (error: any) {
        log.error(`User pre save hook error: ${error}`);
        throw error;
    }
})
@index({ email: 1 },{unique: true}) //Index the email field. This will make sure that the email is unique.
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
    firstName: string;

    @prop({ required: true })
    lastName: string;

    @prop({ required: false })
    middleName: string;

    @prop({ required: false })
    nickName: string;

    @prop({ required: false })
    bio: string;

    @prop({ required: false })
    otherNames: string;

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
            log.debug(`validatePassword: ${candidatePassword}`);
            return bcrypt.compareSync(candidatePassword, this.password);// Compare the password with the hash returning true or false.
            // return await argon2.verify(this.password, candidatePassword); 
        } catch (error: any) {
            log.warn(error, "count not validate password");
            return false;
        }
    }
}
/**
 * getModelForClass came from typegoose.
 */
const UserModel = getModelForClass(User);

export default UserModel;