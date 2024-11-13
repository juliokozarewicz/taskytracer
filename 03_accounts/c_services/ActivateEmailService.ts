import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { EmailActivate } from '../a_entities/EmailActivate'
import { ActivateEmailValidationType } from '../b_validations/ActivateEmailValidation'
import { createCustomError } from '../e_middlewares/ErrorHandler'

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
        })

        // active email
        if (
            existingCodeStored &&
            existingUser &&
            !existingUser.isEmailConfirmed
        ) {

            // get user
            const existingUser = await userRepository.findOne({
                where: { email: validatedData.email.toLowerCase() }
            })
            
            // commit database
            if (existingUser) {
                existingUser.isEmailConfirmed = true
                await userRepository.save(existingUser)
            }

        }

        // don't existing code stored
        if (!existingCodeStored) {

            throw createCustomError({
                "message": `${this.t('activate_email_error')}`,
                "code": 404,
                "next": "/accounts/activate-email-link",
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
                self: '/accounts/activate-email',
                next: '/accounts/login',
                prev: '/accounts/activate-email-link',
            }
        }

    }

}