const packageJson = require('../package.json')
import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { createCustomError } from '../e_middlewares/ErrorHandler'
import bcrypt from 'bcrypt'
import { LoginValidationType } from "../b_validations/LoginValidation"
import { EmailService } from "../f_utils/EmailSend"
import { RefreshTokenEntity } from "../a_entities/RefreshTokenEntity"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export class LoginService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: LoginValidationType,
    ): Promise<StandardResponse> {

        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const refreshTokenRepository = AppDataSource.getRepository(RefreshTokenEntity)

        // existing user
        const existingUser = await userRepository.findOne({
            where: { email: validatedData.email.toLowerCase() }
        })

        // invalid credentials
        if (
            !existingUser ||
            !await bcrypt.compare(validatedData.password, existingUser.password)
        ) {

            throw createCustomError({
                "message": `${this.t('login_credentials_failed')}`,
                "code": 401,
                "next": "/accounts/login",
                "prev": "/accounts/login",
            })

        }

        // account banned
        if (
            existingUser &&
            existingUser.isBanned
        ) {

            // send email with code
            await this.sendEmailText(
                validatedData.email,
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
                validatedData.email,
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
                validatedData.email,
                this.t('account_email_deactivated')
            )

            throw createCustomError({
                "message": `${this.t('login_acc_error')}`,
                "code": 401,
                "next": "/accounts/login",
                "prev": "/accounts/login",
            })

        }

        // JWT and refresh token
        // -----------------------------------------------------------------------------

        // empty vars
        let encryptedJWT = ''
        let encryptedRefresh = ''

        await refreshTokenRepository.manager.transaction(async tokensGenerate => {
            
            // crypto keys #####
            const keyCrypto = crypto.createHash('sha256')
                .update(process.env.SECURITY_CODE as string)
                .digest('hex')
                .substring(0, 32)
            const ivCrypto = crypto.createHash('sha256')
                .update(process.env.SECURITY_CODE as string)
                .digest('hex')
                .substring(0, 16)

            // JWT generator
            // ----------------------------------------------------------------------
            const payload = {
                email: validatedData.email.toLocaleLowerCase(),
                sub: existingUser.id
            }
            const jwtTokenRaw = jwt.sign(
                payload,
                process.env.SECURITY_CODE as string,
                { expiresIn: '2m' }
            )
            const cipherJWT = crypto.createCipheriv(
                'aes-256-cbc',
                keyCrypto,
                ivCrypto
            )
            encryptedJWT = cipherJWT.update(jwtTokenRaw, 'utf8', 'hex') + cipherJWT.final('hex')
            // ----------------------------------------------------------------------

            // REFRESH TOKEN generator
            // ----------------------------------------------------------------------

            // delete all tokens < 15 days
            const expiredTokens = await refreshTokenRepository.find({
                where: {
                    email: validatedData.email,
                },
            })

            const fifteenDaysAgo = new Date()
            fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

            for (const token of expiredTokens) {
                if (token.createdAt <= fifteenDaysAgo) {
                    await refreshTokenRepository.remove(token);
                }
            }

            // Keep only the last 5 valid tokens
            const validTokens = expiredTokens.filter(token => token.createdAt > fifteenDaysAgo);
            if (validTokens.length > 4) {
                const tokensToRemove = validTokens.slice(0, validTokens.length - 4);
                for (const token of tokensToRemove) {
                    await refreshTokenRepository.remove(token);
                }
            }

            // refresh logic
            const randomKey = crypto.randomBytes(128).toString('hex')
            const timestamp = new Date().toISOString();
            const email = existingUser.email
            const refreshTokenRaw = `${randomKey}${timestamp}${email}`

            // crypto
            const cipherRefresh = crypto.createCipheriv(
                'aes-256-cbc',
                keyCrypto,
                ivCrypto
            )
            encryptedRefresh = cipherRefresh.update(
                refreshTokenRaw, 'utf8', 'hex'
            ) + cipherRefresh.final('hex')

            // store refresh token
            const RefreshStore = new RefreshTokenEntity()
            RefreshStore.token = String(encryptedRefresh)
            RefreshStore.email = validatedData.email
            RefreshStore.user = existingUser
            await tokensGenerate.save(RefreshStore)

            // ----------------------------------------------------------------------


        })
        // -----------------------------------------------------------------------------

        return {
            status: 'success',
            code: 200,
            message: this.t('login_ok'),
            data: [
                {
                    "access": encryptedJWT,
                    "refresh": encryptedRefresh,
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