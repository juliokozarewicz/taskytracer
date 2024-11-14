import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { EmailActivate } from '../a_entities/EmailActivate'
import { ChangePasswordValidationType } from '../b_validations/ChangePasswordValidation'
import { createCustomError } from '../e_middlewares/ErrorHandler'
import bcrypt from 'bcrypt'
import { RefreshTokenEntity } from "../a_entities/RefreshTokenEntity"

export class ChangePasswordService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: ChangePasswordValidationType,
    ): Promise<StandardResponse> {

        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const emailCodeRepository = AppDataSource.getRepository(EmailActivate)
        const refreshTokenRepository = AppDataSource.getRepository(RefreshTokenEntity)

        // search for code and email
        const existingCodeStored = await emailCodeRepository.findOne({
            where: {
                email: validatedData.email.toLowerCase(),
                code: validatedData.code + "_change-password"
            }
        })

        // existing user
        const existingUser = await userRepository.findOne({
            where: { email: validatedData.email.toLowerCase() }
        })

        // change password
        if (
            existingCodeStored &&
            existingUser
        ) {

            // commit database
            if (existingUser) {
                existingUser.isActive = true
                existingUser.isEmailConfirmed = true
                existingUser.password = await this.hashPassword(validatedData.password)
                await userRepository.save(existingUser)
            }

        }

        // don't existing code stored
        if (!existingCodeStored) {

            throw createCustomError({
                "message": `${this.t('change_password_error')}`,
                "code": 404,
                "next": "/accounts/change-password-link",
                "prev": "/accounts/login",
            })

        }

        // delete all codes
        await emailCodeRepository.delete(
            { email: validatedData.email.toLowerCase() }
        )

        // delete all refresh tokens
        await refreshTokenRepository.delete(
            { email: validatedData.email.toLowerCase() }
        )

        return {
            status: 'success',
            code: 200,
            message: this.t('change_password_ok'),
            links: {
                self: '/accounts/change-password',
                next: '/accounts/login',
                prev: '/accounts/change-password-link',
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

}