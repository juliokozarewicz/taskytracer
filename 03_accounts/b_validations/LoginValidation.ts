import { z } from 'zod'
import { Request } from 'express'

// Function to create a validation schema with translations
export const LoginValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),
        password: z.string()
            .min(8, req.t("is_required"))
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .max(255, req.t("contains_too_many_characters")),

    })
}

// types
export type LoginValidationType = z.infer<ReturnType<typeof LoginValidation>> 
