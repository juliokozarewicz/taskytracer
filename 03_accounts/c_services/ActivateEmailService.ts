import { createHash } from 'crypto'
const packageJson = require('../package.json')
import { AccountUserEntity } from "../a_entities/AccountUserEntity";
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server";
import { EmailService } from "../f_utils/EmailSend";
import { EmailActivate } from '../a_entities/EmailActivate';
import { ActivateEmailValidationType } from '../b_validations/ActivateEmailValidation';
import { createCustomError } from '../e_middlewares/ErrorHandler';

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

        // search for code and email
        const existingCodeStored = await emailCodeRepository.findOne({
            where: {
                email: validatedData.email.toLowerCase(),
                code: validatedData.code + "_activate-email"
            }
        })

        // existing user
        const existingUser = await userRepository.findOne({
            where: { email: validatedData.email.toLowerCase() }
        });

        // active email
        if (
            existingCodeStored &&
            existingCodeStored.code.split('_').pop() === "activate-email" &&
            existingUser &&
            !existingUser.isEmailConfirmed
        ) {

            // get user
            const existingUser = await userRepository.findOne({
                where: { email: validatedData.email.toLowerCase() }
            });
            
            // commit database
            if (existingUser) {
                existingUser.isEmailConfirmed = true;
                await userRepository.save(existingUser);
            }

        }

        // existing code stored
        if (!existingCodeStored) {

            throw createCustomError({
                "message": `${this.t('activate_email_error')}`,
                "code": 404,
                "next": "/accounts/activate-email",
                "prev": "/accounts/login",
            })

        }

        // delete all codes
        await emailCodeRepository.delete(
            { email: validatedData.email.toLowerCase() }
        )

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

            const message = `${this.t('email_greeting')} ` +
                `\n\n${textSend} \n\n${activationLink} ` +
                `\n\n${this.t('email_closing')}, ` +
                `\n${packageJson.application_name.toUpperCase()}`

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

}