import { AccountUserEntity } from "../a_entities/AccountUserEntity"
import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import { EmailActivate } from '../a_entities/EmailActivate'
import bcrypt from 'bcrypt'
import { UpdateProfileValidationType } from "../b_validations/UpdateProfileValidation"

export class UpdateProfileService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: UpdateProfileValidationType,
    ): Promise<StandardResponse> {

        const userRepository = AppDataSource.getRepository(AccountUserEntity)
        const emailCodeRepository = AppDataSource.getRepository(EmailActivate)

        return {
            status: 'success',
            code: 200,
            message: this.t('update_profile_ok'),
            links: {
                self: '/accounts/profile-update',
                next: '/accounts/profile',
                prev: '/accounts/profile',
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