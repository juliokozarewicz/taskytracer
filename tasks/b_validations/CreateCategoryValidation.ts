import { z } from 'zod'
import { Request } from 'express'

export const CreateCategoryValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),

        id: z.string()
            .regex(
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                req.t("not_valid")
            ),

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