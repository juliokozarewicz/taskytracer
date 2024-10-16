const packageJson = require('../package.json')
import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { CreateAccountValidationType } from "../b_validations/CreateAccountValidation"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import bcrypt from 'bcrypt'
import { AccountProfileEntity } from "../a_entities/AccountProfileEntity"
import { EmailService } from "../f_utils/EmailSend"
import { createHash } from 'crypto'
import { EmailActivate } from "../a_entities/EmailActivate"

export class CreateAccountService {

    async execute(
        validatedData: CreateAccountValidationType
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

        // account banned
        if (
            existingUser &&
            existingUser.isBanned
        ) {

            // send email banned account
            await this.sendEmailText(
                validatedData.email,
                `Your account has been deactivated, please contact support. ` +
                `If you haven't made any changes to your account, please change your password.`
            )

            return {
                status: 'success',
                code: 201,
                message: 
                    `account created successfully, please activate your ` +
                    `account through the link sent to your email`,
                links: {
                    self: '/accounts/signup',
                    next: '/accounts/signup',
                    prev: '/accounts/login',
                }
            }
        }

        // existing account | password ok | acc ok | email ok | not banned
        if (
            existingUser &&
            await bcrypt.compare(validatedData.password, existingUser.password) &&
            existingUser.isActive &&
            existingUser.isEmailConfirmed &&
            !existingUser.isBanned
        ) {

            await this.sendEmailText(
                validatedData.email,
                `You already have an active account with us, now you just need to log in. ` +
                `If you haven't made any changes to your account, please change your password.`
            )

            return {
                status: 'success',
                code: 201,
                message:
                    `account created successfully, please activate your ` +
                    `account through the link sent to your email`,
                links: {
                    self: '/accounts/signup',
                    next: '/accounts/login',
                    prev: '/accounts/login',
                }
            }
        }

        // existing account with problems
        if (
            existingUser
        ) {

            // commit code in db transaction
            // ------------------------------------------------------------------------------
            await emailCodeRepository.manager.transaction(async emailCodeTransaction => {

                // send email with code
                const codeAccount = await this.sendEmailCode(
                    validatedData.email,
                    `Click the link below to activate your account. ` +
                    `If you haven't made any changes to your account, please change your password.`,
                    validatedData.link
                )

                // delete all old tokens
                await emailCodeRepository.delete({ email: existingUser.email.toLowerCase() })

                // code commit db
                const newEmailActivate = new EmailActivate()
                newEmailActivate.createdAt = new Date()
                newEmailActivate.code = codeAccount
                newEmailActivate.email = existingUser.email.toLowerCase()
                newEmailActivate.user = existingUser

                await emailCodeTransaction.save(newEmailActivate)
            })
            // ------------------------------------------------------------------------------

            return {
                status: 'success',
                code: 201,
                message:
                    `account created successfully, please activate your ` +
                    `account through the link sent to your email`,
                links: {
                    self: '/accounts/signup',
                    next: '/accounts/login',
                    prev: '/accounts/login',
                }
            }
        }

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
                `Click the link below to activate your account:`,
                validatedData.link
            )

            // delete all old tokens
            await emailCodeRepository.delete({ email: savedUser.email.toLowerCase() })

            // code commit db
            const newEmailActivate = new EmailActivate()
            newEmailActivate.createdAt = new Date()
            newEmailActivate.code = codeAccount
            newEmailActivate.email = savedUser.email.toLowerCase()
            newEmailActivate.user = savedUser
            await commitUserTransaction.save(newEmailActivate)
        })
        // ------------------------------------------------------------------------------

        return {
            status: 'success',
            code: 201,
            message:
                `account created successfully, please activate your ` +
                `account through the link sent to your email`,
            links: {
                self: '/accounts/signup',
                next: '/accounts/login',
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
            const subject = `[${packageJson.application_name.toUpperCase()}] - Account Service`

            const hashString = `${Date.now()*135}${email}${process.env.SECURITY_CODE}`
            const codeAccount = createHash('sha256').update(hashString).digest('hex')

            const activationLink = (
                `${link}?` +
                `email=${email}&` +
                `code=${encodeURIComponent(codeAccount)}`
            )

            const message = `Hello, how are you? \n\n${textSend} \n\n${activationLink} \n\nBest regards, \n${packageJson.application_name.toUpperCase()}`

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
            const subject = `[${packageJson.application_name.toUpperCase()}] - Account Service`
            const message = `Hello, how are you? \n\n${textSend} \n\nBest regards, \n${packageJson.application_name.toUpperCase()}`

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