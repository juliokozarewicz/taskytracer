import { z } from 'zod'
import { Request } from 'express'

// Function to create a validation schema with translations
export const RefreshLoginValidation = (req: Request) => {
    return z.object({

        hash: z.string()
            .length(128, req.t("hash_length_invalid"))
            .regex(/^[0-9a-f]+$/, req.t("must_be_a_valid_hash")),

    })
}

// types
export type RefreshLoginValidationType = z.infer<ReturnType<typeof RefreshLoginValidation>> 
