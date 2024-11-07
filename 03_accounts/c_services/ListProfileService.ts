import { StandardResponse } from '../f_utils/StandardResponse'
import { AppDataSource } from '../server'
import { AccountProfileEntity } from '../a_entities/AccountProfileEntity'
import { ListProfileValidationType } from '../b_validations/ListProfileValidation'

export class ListProfileService {

    private t: (key: string) => string
    constructor(t: (key: string) => string) {
        this.t = t
    }

    async execute(
        validatedData: ListProfileValidationType
    ): Promise<StandardResponse> {

        // database operations
        //-------------------------------------------------------------------------
        const profileRepository = AppDataSource.getRepository(AccountProfileEntity)

        const existingProfile = await profileRepository.find({
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

        // remove id
        existingProfile.forEach(profile => {
            delete (profile as any).id
        })
        //-------------------------------------------------------------------------

        return {
            "status": 'success',
            "code": 200,
            "message": this.t("data_received_successfully"),
            "data": existingProfile,
            "meta": {
                "total": existingProfile.length,
            },
            "links": {
                "self": '/accounts/profile',
                "next": '/accounts/profile-update',
                "prev": '/accounts/login',
            }
        }

    }

}
