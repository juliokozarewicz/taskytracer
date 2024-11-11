import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { EmailActivate } from '../a_entities/EmailActivate'
import { DeleteAccountValidationType } from '../b_validations/DeleteAccountValidation'
import bcrypt from 'bcrypt'
import { createCustomError } from "../e_middlewares/ErrorHandler"

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
                user: {
                    id: validatedData.id,
                },
                code: validatedData.code + "_delete-account",
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

        // all correct
        // ##### existing user, existing code (delete all), password ok
        if (
            existingUser &&
            existingCode &&
            await bcrypt.compare(
                validatedData.password, existingUser.password
            )
        ) {
            console.log("delete ok")
        }

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