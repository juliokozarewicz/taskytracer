import { z } from 'zod'
import { Request } from 'express'

// Function to create a validation schema with translations
export const ActivateEmailLinkValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),
        link: z.string()
            .min(1, req.t("is_required"))
            .url(req.t("must_be_a_valid_link"))
            .max(255, req.t("contains_too_many_characters")),

    })
}

// types
export type ActivateEmailLinkValidationType = z.infer<ReturnType<typeof ActivateEmailLinkValidation>> 
