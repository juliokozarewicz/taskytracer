import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { EmailActivate } from '../a_entities/EmailActivate'
import { DeleteAccountValidationType } from '../b_validations/DeleteAccountValidation'
import bcrypt from 'bcrypt'
import { createCustomError } from "../e_middlewares/ErrorHandler"
import { RefreshTokenEntity } from "../a_entities/RefreshTokenEntity"

export class DeleteAccountService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: DeleteAccountValidationType,
    ): Promise<StandardResponse> {

        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const emailCodeRepository = AppDataSource.getRepository(EmailActivate)
        const refreshTokenRepository = AppDataSource.getRepository(RefreshTokenEntity)

        // get user
        const existingUser = await userRepository.findOne({
            where: {
                email: validatedData.email.toLowerCase()
            }
        })

        // get code
        const existingCode = await emailCodeRepository.findOne({
            where: {
                email: validatedData.email.toLowerCase(),
                code: validatedData.code + "_delete-account",
            }
        })

        // invalid credentials
        if (
            !existingUser ||
            !existingUser.isActive ||
            !existingCode ||
            !await bcrypt.compare(
                validatedData.password, existingUser.password
            )
        ) {
            throw createCustomError({
                "message": `${this.t('login_credentials_failed')}`,
                "code": 401,
                "next": "/accounts/login",
                "prev": "/accounts/login",
            })
        }

        // all correct
        if (
            existingUser &&
            existingCode &&
            await bcrypt.compare(
                validatedData.password, existingUser.password
            )
        ) {
            // deactive acc
            existingUser.isActive = false
            await userRepository.save(existingUser)
        }

        // delete all old tokens
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
            message: this.t('delete_account_commit'),
            links: {
                self: '/accounts/delete-account',
                next: '/accounts/login',
                prev: '/accounts/delete-account-link',
            }
        }

    }

}