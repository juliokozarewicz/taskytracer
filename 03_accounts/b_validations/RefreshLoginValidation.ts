import { z } from 'zod'
import { Request } from 'express'

// Function to create a validation schema with translations
export const RefreshLoginValidation = (req: Request) => {
    return z.object({

        refresh: z.string()
            .min(1, req.t("is_required"))
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .regex(/^[0-9a-f]+$/, req.t("not_valid")),

    })
}

// types
export type RefreshLoginValidationType = z.infer<ReturnType<typeof RefreshLoginValidation>> 
