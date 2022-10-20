import UserModel, { User } from "../model/user.model";
import { log, logfile } from "../utils/logger";

/**
 * Partial is because we only want to send the fields that we want to update/create.
 * @param input - The input is the body of the request.
 * @returns
 */
export function createUser(input: Partial<User>) {
    log.debug(`createUser: ${JSON.stringify(input)}`);
    return UserModel.create(input);
}
/**
 * Returns the user by id.
 * @param id - The id of the user.
 * @returns user object - The user with the id. 
 */
export function findUserById(id: string) {
    return UserModel.findById(id);
}
/**
 * Returns the user with the email. 
 * @param email - The email of the user.
 * @returns user object - The user with the email. 
 */
export function findUserByEmail(email: string) {
    return UserModel.findOne({ email });
}