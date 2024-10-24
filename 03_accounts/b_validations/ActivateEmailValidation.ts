import { z } from 'zod'
import { Request } from 'express'

export const ActivateEmailValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),
        code: z.string()
            .length(200, req.t("contains_too_many_characters")),
        urlRedirect: z.string()
            .url(req.t("must_be_a_valid_link"))
            .max(255, req.t("contains_too_many_characters")),

    })
}

export type ActivateEmailValidationType = z.infer<ReturnType<typeof ActivateEmailValidation>> 
