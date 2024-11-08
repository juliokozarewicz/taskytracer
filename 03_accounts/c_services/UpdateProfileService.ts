import { StandardResponse } from "../f_utils/StandardResponse"
import { AppDataSource } from "../server"
import bcrypt from 'bcrypt'
import { UpdateProfileValidationType } from "../b_validations/UpdateProfileValidation"
import { AccountProfileEntity } from "../a_entities/AccountProfileEntity"

export class UpdateProfileService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: UpdateProfileValidationType,
    ): Promise<StandardResponse> {

        const profileRepository = AppDataSource.getRepository(AccountProfileEntity)

        // get profile
        const existingProfile = await profileRepository.findOne({
            where: {
                user: {
                    id: validatedData.id,
                },
            },
            select: [
                'id',
                'biography',
                'phone',
                'cpf'
            ],
        })

        // exist profile
        if (existingProfile) {
            if (validatedData.biography !== undefined) {
                existingProfile.biography = validatedData.biography
            }
            if (validatedData.cpf !== undefined) {
                existingProfile.cpf = validatedData.cpf
            }
            if (validatedData.phone !== undefined) {
                existingProfile.phone = validatedData.phone
            }

            await profileRepository.save(existingProfile)
        }

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