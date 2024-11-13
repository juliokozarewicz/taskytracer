import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { EmailActivate } from '../a_entities/EmailActivate'
import bcrypt from 'bcrypt'
import { createCustomError } from "../e_middlewares/ErrorHandler"
import { RefreshTokenEntity } from "../a_entities/RefreshTokenEntity"
import { UpdateEmailValidationType } from "../b_validations/UpdateEmailValidation"

export class UpdateEmailService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: UpdateEmailValidationType,
    ): Promise<StandardResponse> {

        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const emailCodeRepository = AppDataSource.getRepository(EmailActivate)
        const refreshTokenRepository = AppDataSource.getRepository(RefreshTokenEntity)

        // get user
        const existingUser = await userRepository.findOne({
            where: {
                email: validatedData.email.toLowerCase(),
                id: validatedData.id,
            }
        })

        // get code
        const existingCode = await emailCodeRepository.findOne({
            where: {
                email: validatedData.email.toLowerCase(),
                user: {
                    id: validatedData.id,
                },
                code: validatedData.code + "_update-email",
            }
        })

        // invalid credentials
        if (
            !existingUser ||
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

        // ##### all correct
        if (
            existingUser &&
            existingCode &&
            await bcrypt.compare(
                validatedData.password, existingUser.password
            )
        ) {
            console.log('*** UPDATED EMAIL ***')
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
            message: this.t('email_updated_ok'),
            links: {
                self: '/accounts/update-email',
                next: '/accounts/activate-email',
                prev: '/accounts/login',
            }
        }

    }

}