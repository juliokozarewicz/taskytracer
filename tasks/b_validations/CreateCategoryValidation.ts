import { z } from 'zod'
import { Request } from 'express'

export const CreateCategoryValidation = (req: Request) => {
    return z.object({

        categoryName: z.string()
            .min(1, req.t("is_required"))
            .max(255, req.t("too_many_characters"))
            .regex(
                /^[^<>&'"/]+$/,
                req.t("disallowed_characters")
            ),

    })
}

// types
export type CreateCategoryValidationType = z.infer<ReturnType<typeof CreateCategoryValidation>>