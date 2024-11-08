import { z } from 'zod'
import { Request } from 'express'

export const UpdateProfileValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),

        id: z.string()
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .regex(
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                req.t("not_valid")
            ),

        biography: z.string()
            .max(500, req.t("contains_too_many_characters"))
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .optional(),

        phone: z.string()
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .max(25, req.t("contains_too_many_characters"))
            .optional(),

        cpf: z.string()
            .length(11, req.t("not_valid"))
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .regex(/^\d{11}$/, req.t("not_valid"))
            .optional(),

    })
}

export type UpdateProfileValidationType = z.infer<ReturnType<typeof UpdateProfileValidation>> 
