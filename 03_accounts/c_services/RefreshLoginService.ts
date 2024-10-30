const packageJson = require('../package.json')
import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { createCustomError } from '../e_middlewares/ErrorHandler'
import bcrypt from 'bcrypt'
import { EmailService } from "../f_utils/EmailSend"
import { RefreshTokenEntity } from "../a_entities/RefreshTokenEntity"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { RefreshLoginValidationType } from "../b_validations/RefreshLoginValidation"

export class RefreshLoginService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: RefreshLoginValidationType,
    ): Promise<StandardResponse> {

        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const refreshTokenRepository = AppDataSource.getRepository(RefreshTokenEntity)


        // #####
        const tokenData = {
            "email": "email@email.com"
        }

        // existing user
        const existingUser = await userRepository.findOne({
            where: { email: tokenData.email.toLowerCase() }
        })

        // account banned
        if (
            existingUser &&
            existingUser.isBanned
        ) {

            // send email with code
            await this.sendEmailText(
                tokenData.email,
                this.t('account_banned')
            )

            throw createCustomError({
                "message": `${this.t('login_acc_error')}`,
                "code": 401,
                "next": "/accounts/login",
                "prev": "/accounts/login",
            })

        }

        // account not activated (deleted)
        if (
            existingUser &&
            !existingUser.isActive
        ) {

            // send email with code
            await this.sendEmailText(
                tokenData.email,
                this.t('account_user_deactivated')
            )

            throw createCustomError({
                "message": `${this.t('login_acc_error')}`,
                "code": 401,
                "next": "/accounts/login",
                "prev": "/accounts/login",
            })

        }

        // email not confirmed
        if (
            existingUser &&
            !existingUser.isEmailConfirmed
        ) {

            // send email with code
            await this.sendEmailText(
                tokenData.email,
                this.t('account_email_deactivated')
            )

            throw createCustomError({
                "message": `${this.t('login_acc_error')}`,
                "code": 401,
                "next": "/accounts/login",
                "prev": "/accounts/login",
            })

        }

        // #####

        return {
            status: 'success',
            code: 200,
            message: this.t('login_ok'),
            data: [
                {
                    "access": 'encryptedJWT',
                    "refresh": 'encryptedRefresh',
                }
            ],
            links: {
                self: '/accounts/login'
            }
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