import { z } from 'zod'
import { Request } from 'express'

// Function to create a validation schema with translations
export const ResendEmailCodeValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),
        link: z.string()
            .url(req.t("must_be_a_valid_link"))
            .max(255, req.t("contains_too_many_characters")),

    })
}

// types
export type ResendEmailCodeValidationType = z.infer<ReturnType<typeof ResendEmailCodeValidation>> 
