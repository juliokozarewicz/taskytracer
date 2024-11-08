import { z } from 'zod'
import { Request } from 'express'

export const ListProfileValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),
        id: z.string()
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .regex(
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                req.t("not_valid")
            )

    })
}

export type ListProfileValidationType = z.infer<ReturnType<typeof ListProfileValidation>> 
