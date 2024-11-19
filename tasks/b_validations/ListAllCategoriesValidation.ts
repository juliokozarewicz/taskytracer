import { z } from 'zod'
import { Request } from 'express'

export const ListAllCategoriesValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),

        id: z.string()
            .regex(
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                req.t("not_valid")
            ),

    })
}

// types
export type ListAllCategoriesValidationType = z.infer<ReturnType<typeof ListAllCategoriesValidation>>