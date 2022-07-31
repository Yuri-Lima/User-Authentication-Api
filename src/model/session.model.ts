import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./user.model";

export class Session{
    /**
     * @user is a reference to the user that is logged in.
     * Ref is gonna make sure that the user is a reference to the User model.
     */
    @prop({ref: () => User})
    user: Ref<User>;

    /**
     * If it set to false, the session will be deleted and we wont be able to refresh the token anymore.
     */
    @prop({default: true})
    valid: boolean;// This is to make sure that the session is valid.
}
const SessionModel = getModelForClass(Session, {
    /**
     * This is the same as declaring @modelOptions({...}) which we used in the User model.
     */
    schemaOptions: {
        timestamps: true,
        collection: "User_Sessions"
    },
    options: {
        customName: "Sessions",//This is to change the name of the model.
    }
});
export default SessionModel;