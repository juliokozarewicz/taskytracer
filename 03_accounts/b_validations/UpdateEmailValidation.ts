import { z } from 'zod'
import { Request } from 'express'

export const UpdateEmailValidation = (req: Request) => {
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

        newEmail: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),

        code: z.string()
            .min(1, req.t("is_required"))
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .max(255, req.t("contains_too_many_characters")),

        password: z.string()
            .min(8, req.t("must_be_at_least_8_characters_long"))
            .max(255, req.t("contains_too_many_characters"))
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters"))
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, req.t("must_contain_at_least_one_uppercase_letter")),

    })
}

export type UpdateEmailValidationType = z.infer<ReturnType<typeof UpdateEmailValidation>>