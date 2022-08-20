import express, { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserByEmail, findUserById } from '../services/user.service';
import { log, logfile } from '../utils/logger';
import sendEmail from '../utils/mailer';

/**
 * Create a new user
 */
export async function createUserHandler(req: Request<{},{},CreateUserInput,{}>, res: Response) {
    const body = req.body;
    try {
        const user = await createUser(body);
        log.debug(`createUserHandler: ${user}`);
        // await sendEmail({
        //     from: 'y.m.lima19@gmail.com',
        //     to: user.email,
        //     subject: 'Welcome to the app',
        //     text: `You have successfully created an account\nVerification code: ${user.verificationCode}. Id: ${user._id}`,
        //     html: `<h1>You have successfully created an account</h1><br><p>Verification code: ${user.verificationCode}. Id: ${user._id}</p>`,
        //     messageId: `${nanoid()}`,
        //     priority: 'normal',
        // })

        return res.status(201).json({
            message: "User created successfully",
            user: user
        }).on('finish', () => {
            log.debug(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
        });
    } catch (error:any) {
        if(error.code === 11000) {
            return res.status(409).json({
                message: "User already exists",
                code: error.code,
            });
        }
        return res.status(500).json({
            error: error,
            message: "User creation failed"
        });
    }
}
/**
 * Verify user by id and verification code.
 */
export async function verifyUserHandler(req: Request<VerifyUserInput,{},{},{}>, res: Response) {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;
    try {
        /**
         * Find the user by id and verify the verification code.
         */
        const user = await findUserById(id);
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        /**
         * Update the user to set the verified field to true.
         * If the email is not verified, the user will not be able to login.
         */
        if(user.verified) {
            return res.status(409).json({
                message: "User is already verified"
            });
        }
        /**
         * If verfication code is correct, update the user to set the verified field to true.
         */
        if(user.verificationCode === verificationCode) {
            user.verified = true;//Update the user to set the verified field to true.
            await user.save();//Save the user.
            return res.status(200).json({
                message: "User verified successfully"
            });
        }
        /**
         * If verification code is incorrect, return a 409.
         */
        return res.status(409).json({
            message: "User Verification code is invalid"
        });
    } catch (error) {
        return res.status(500).json({
            error: error,
            message: "User verification failed"
        });
    }
}
/**
 * Forgot password handler using email to send a reset password link.
 */
export async function forgotPasswordHandler(req: Request<{},{},ForgotPasswordInput,{}>, res: Response) {
    /**
     * I make sure to avoid spamming the user with emails.
     * If the user has already requested a password reset, I will not send him another email.
     */
    const message = "If a user with this email exists, we have sent you an email with a link to reset your password.";

    const email = req.body.email;
    try {
        const user = await findUserByEmail(email);
        if(!user) {
            log.warn(`User with email ${email} not found`);//Log the warning.
            logfile.warn(`User with email ${email} not found`);//Write the warning to the log file. 
            return res.status(201).json({
                message: message
            });
        }
        /**
         * If the user is not verified, I will not send him another email.
         */
        if(!user.verified) {
            return res.status(201).json({
                code:201,
                message: "User is not verified"
            });
        }
        /**
         * Set user password reset code with a random string provided by nanoid.
         */
        const passwordReseCode = nanoid();
        user.passwordResetCode = passwordReseCode;

        await user.save();//Save the user.

        /**
         * Send the email with the reset password link.
         */
        await sendEmail({
            from: 'learns@uatiz.app',
            to: user.email,
            subject: 'Reset Password from Learns Yuri',
            text: `Password reset code: ${passwordReseCode} Id: ${user._id}`,
            html: `<h1>You have requested to reset your password</h1><br><p>Reset Code: ${user.passwordResetCode} Id: ${user._id}</p>`,
            messageId: `${nanoid()}`,
            priority: 'high',
        });
        log.info(`User with email ${email} has requested to reset his password`);//Log the info.
        return res.status(200).json({
            message: message
        });
    }
    catch (error:any) {
        logfile.error(`Error while resetting password for user with email ${email}`);//Write the error to the log file.
        return res.status(500).json({
            error: error,
            message: "Something went wrong could be the [ Email sending failed or the user email does not exist ]"
        });
    }
}
/**
 * Reset password handler using reset password code.
 */
export async function resetPasswordHandler(req: Request<ResetPasswordInput["params"],{},ResetPasswordInput["body"],{}>, res: Response) {
    const { id, resetPasswordCode } = req.params;//Get the user id and reset password code.
    const { password } = req.body;//Get the password from the request body.
    try {
        const user = await findUserById(id);
        if(!user || !user.passwordResetCode || user.passwordResetCode !== resetPasswordCode) {//If the user does not exist, return a 404.
            return res.status(400).json({
                message: "Somehow we could not reset your password",
                checks: "User does not exist or reset password code is invalid"
            });
        }
        user.passwordResetCode = null;//Set the password reset code to null.
        user.password = password;//Set the new password.
        await user.save();//Save the user.
        
        return res.status(200).json({
            message: "Password reset successfully"
        });
    } catch (error:any) {
        return res.status(500).json({
            error: error,
            message: "Password reset failed"
        });
    }
}

export async function getCurrentUserHandler(req: Request, res: Response) {
    log.info(`User has requested to get his profile`);//Log the info.
    return res.status(200).json({
        user_deserialized: res.locals.user
    }).on('finish', () => {
        log.info(`User has received his profile`);//Log the info.
        log.info(`${req.method} ${req.url} ${res.statusCode}`);
    });
}