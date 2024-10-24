import { createHash } from 'crypto'
const packageJson = require('../package.json')
import { AccountUserEntity } from "../a_entities/AccountUserEntity";
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server";
import { EmailService } from "../f_utils/EmailSend";
import { EmailActivate } from '../a_entities/EmailActivate';
import { ActivateEmailValidationType } from '../b_validations/ActivateEmailValidation';

export class ActivateEmailService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: ActivateEmailValidationType,
    ): Promise<StandardResponse> {

        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const emailCodeRepository = AppDataSource.getRepository(EmailActivate)

        return {
            status: 'success',
            code: 200,
            message: this.t('email_activate'),
            links: {
                self: '/accounts/resend-code',
                next: '/accounts/activate-email',
                prev: '/accounts/login',
            }
        }

    }

    // send email with code
    private async sendEmailCode(
        email: string, textSend: string, link: string
    ): Promise<string> {

        try {

            const emailService = new EmailService()
            const subject = `[ ${packageJson.application_name.toUpperCase()} ] - Account Service`

            const hashString = `${Date.now()*135}${email}${process.env.SECURITY_CODE}`
            const codeAccount = createHash('sha256').update(hashString).digest('hex')

            const activationLink = (
                `${link}?` +
                `email=${email}&` +
                `code=${encodeURIComponent(codeAccount)}`
            )

            const message = `${this.t('email_greeting')} \n\n${textSend} \n\n${activationLink} \n\n${this.t('email_closing')}, \n${packageJson.application_name.toUpperCase()}`

            await emailService.sendTextEmail(
                email,
                subject,
                message
            )

            return codeAccount

        } catch (error) {

            throw new Error(
                `[./c_services/CreateAccountService.ts] ` +
                `[CreateAccountService.sendEmailCode()] ` +
                `${error}`
            )

        }

    }

    // send email text
    private async sendEmailText(
        email: string, textSend: string
    ): Promise<void> {

        try {

            const emailService = new EmailService()
            const subject = `[ ${packageJson.application_name.toUpperCase()} ] - Account Service`
            const message = `${this.t('email_greeting')} \n\n${textSend} \n\n${this.t('email_closing')}, \n${packageJson.application_name.toUpperCase()}`

            await emailService.sendTextEmail(
                email,
                subject,
                message
            )

        } catch (error) {

            throw new Error(
                `[./c_services/CreateAccountService.ts] ` +
                `[CreateAccountService.sendEmailText()] ` +
                `${error}`
            )

        }

    }

}