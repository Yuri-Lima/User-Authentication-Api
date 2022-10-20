/**
 * It is going to be a fake SMTP server.
 * Be aware that this is a fake server.
 * It is not going to send real emails.
 * In order to send real emails, you need to install a real SMTP server.
 * You can do that by installing nodemailer.
 * Or you can use a fake SMTP server.
 * In this case, you can use nodemailer-smtp-transport.
 * Or Push Notifications.
 */
import nodemailer, { SendMailOptions } from 'nodemailer';
import { log, logfile } from './logger';
/**
 * This is a fake SMTP server.
 * Only to get settings for the SMTP server.
 */
async function creaTestCreds(){
    const creds = await nodemailer.createTestAccount();
    log.debug(JSON.stringify(creds),"creds");
}
// creaTestCreds();

interface smtp {
    host: string,
    port: number,
    secure: boolean,
    user: string,
    pass: string,
}
const SMTP:smtp = {
    host:   String(process.env.DEV_SMTP_HOST),
    port:   Number(process.env.DEV_SMTP_PORT),
    secure: Boolean(process.env.DEV_SMTP_SECURE),
    user:   String(process.env.DEV_SMTP_AUTH_USER),
    pass:   String(process.env.DEV_SMTP_AUTH_PASS),
}
const transport = nodemailer.createTransport({
    ...SMTP,
    service: 'gmail',
    auth: { user: SMTP.user, pass: SMTP.pass }
})
/**
 * Send an email.
 * @param payload Payload to send
 */
async function sendEmail(payload:SendMailOptions){
    transport.sendMail(payload, (error, info) => {
        if(error) {
            log.error(error, "Error sending email");
            return;
        }
        log.debug(info, "\ninfo sending email");
        log.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        log.debug(`Message sent: ${payload.html}`);
        return true;
    })

}

export default sendEmail;