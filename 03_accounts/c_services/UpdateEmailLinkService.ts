import { createHash } from 'crypto'
const packageJson = require('../package.json')
import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { EmailService } from "../f_utils/EmailSend"
import { EmailActivate } from '../a_entities/EmailActivate'
import crypto from 'crypto'
import { UpdateEmailLinkValidationType } from '../b_validations/UpdateEmailLinkValidation'

export class UpdateEmailLinkService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: UpdateEmailLinkValidationType,
    ): Promise<StandardResponse> {

        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const emailCodeRepository = AppDataSource.getRepository(EmailActivate)

        // existing user
        const existingUser = await userRepository.findOne({
            where: {
                email: validatedData.email.toLowerCase(),
                id: validatedData.id,
            }
        })

        if (existingUser) {

            // commit code in db transaction
            // ------------------------------------------------------------------------------
            await emailCodeRepository.manager.transaction(async emailCodeTransaction => {

                // send email with code
                const codeAccount = await this.sendEmailCode(
                    validatedData.newemail.toLocaleLowerCase(),
                    this.t('update_email'),
                    validatedData.link
                )

                // delete all old tokens
                await emailCodeRepository.delete(
                    { email: existingUser.email.toLowerCase() }
                )

                // code commit db
                const newEmailActivate = new EmailActivate()
                newEmailActivate.createdAt = new Date()
                newEmailActivate.code = codeAccount + "_update-email"
                newEmailActivate.email = validatedData.newemail.toLowerCase()
                newEmailActivate.user = existingUser

                await emailCodeTransaction.save(newEmailActivate)
            })
            // ------------------------------------------------------------------------------

        }

        return {
            status: 'success',
            code: 200,
            message: this.t('update_email_sent_ok'),
            links: {
                self: '/accounts/update-email-link',
                next: '/accounts/update-email',
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

            const randomKey = crypto.randomBytes(16).toString('hex')
            const hashString = `${Date.now()*135}${email}${randomKey}${process.env.SECURITY_CODE}`
            const codeAccount = createHash('sha256').update(hashString).digest('hex')

            const activationLink = (
                `${link}?` +
                `newemail=${email}&` +
                `code=${encodeURIComponent(codeAccount)}`
            )

            const message = `${this.t('email_greeting')} \n\n${textSend} ` +
                `\n\n${activationLink} \n\n${this.t('email_closing')}, ` +
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