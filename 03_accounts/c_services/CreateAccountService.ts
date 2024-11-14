const packageJson = require('../package.json')
import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { CreateAccountValidationType } from "../b_validations/CreateAccountValidation"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import bcrypt from 'bcrypt'
import { AccountProfileEntity } from "../a_entities/AccountProfileEntity"
import { EmailService } from "../f_utils/EmailSend"
import { EmailActivate } from "../a_entities/EmailActivate"
import crypto from 'crypto'
import { createHash } from 'crypto'

export class CreateAccountService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: CreateAccountValidationType,
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const emailCodeRepository = AppDataSource.getRepository(EmailActivate)

        // existing user
        const existingUser = await userRepository.findOne({
            where: {
                email: validatedData.email.toLowerCase()
            }
        })

        // existing user
        if (existingUser) {

            // commit code in db transaction
            // ------------------------------------------------------------------------------
            await emailCodeRepository.manager.transaction(async emailCodeTransaction => {

                // send email with code
                const codeAccount = await this.sendEmailCode(
                    validatedData.email.toLowerCase(),
                    this.t('activation_email'),
                    validatedData.link
                )

                // delete all old tokens
                await emailCodeRepository.delete({ email: existingUser.email.toLowerCase() })

                // code commit db
                const newEmailActivate = new EmailActivate()
                newEmailActivate.createdAt = new Date()
                newEmailActivate.code = codeAccount + "_activate-email"
                newEmailActivate.email = existingUser.email.toLowerCase()
                newEmailActivate.user = existingUser

                await emailCodeTransaction.save(newEmailActivate)
            })
            // ------------------------------------------------------------------------------
        }

        // not existing user
        if (!existingUser) {

            // create user object to commit db
            const newUser = new AccountUserEntity()
            newUser.isActive = true
            newUser.level = false
            newUser.isBanned = false
            newUser.name = validatedData.name
            newUser.email = validatedData.email.toLowerCase()
            newUser.isEmailConfirmed = false
            newUser.password = await this.hashPassword(validatedData.password)

            // transaction commit db, profile and email code
            // ------------------------------------------------------------------------------
            await userRepository.manager.transaction(async commitUserTransaction => {
                
                // user
                const savedUser = await commitUserTransaction.save(newUser)

                // profile
                const newProfile = new AccountProfileEntity()
                newProfile.user = savedUser
                await commitUserTransaction.save(newProfile)

                // send email with code
                const codeAccount = await this.sendEmailCode(
                    validatedData.email,
                    this.t('activation_email'),
                    validatedData.link
                )

                // delete all old tokens
                await emailCodeRepository.delete({ email: savedUser.email.toLowerCase() })

                // code commit db
                const newEmailActivate = new EmailActivate()
                newEmailActivate.createdAt = new Date()
                newEmailActivate.code = codeAccount + "_activate-email"
                newEmailActivate.email = savedUser.email.toLowerCase()
                newEmailActivate.user = savedUser
                await commitUserTransaction.save(newEmailActivate)
            })
            // ------------------------------------------------------------------------------
        }

        return {
            status: 'success',
            code: 201,
            message: this.t('account_created_successfully'),
            links: {
                self: '/accounts/signup',
                next: '/accounts/activate-email',
                prev: '/accounts/login',
            }
        }

    }

    // password hash
    private async hashPassword(password: string): Promise<string> {

        try {

            const saltRounds = 12
            return bcrypt.hash(password, saltRounds)

        } catch (error) {

            throw new Error(
                `[./c_services/CreateAccountService.ts] ` +
                `[CreateAccountService.hashPassword()] ` +
                `${error}`
            )

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
                `email=${email}&` +
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