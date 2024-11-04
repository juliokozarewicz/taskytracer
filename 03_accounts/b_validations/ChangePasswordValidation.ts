import { z } from 'zod'
import { Request } from 'express'

export const ChangePasswordValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),
        password: z.string()
            .min(8, req.t("must_be_at_least_8_characters_long"))
            .max(255, req.t("contains_too_many_characters"))
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, req.t("must_contain_at_least_one_uppercase_letter")),
        code: z.string()
            .min(1, req.t("is_required"))
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .max(255, req.t("contains_too_many_characters")),

    })
}

export type ChangePasswordValidationType = z.infer<ReturnType<typeof ChangePasswordValidation>>