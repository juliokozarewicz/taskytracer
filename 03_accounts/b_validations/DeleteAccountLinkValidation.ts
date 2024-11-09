import { z } from 'zod'
import { Request } from 'express'

export const DeleteAccountLinkValidation = (req: Request) => {
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

        link: z.string()
            .min(1, req.t("is_required"))
            .url(req.t("must_be_a_valid_link"))
            .max(255, req.t("contains_too_many_characters")),

    })
}

export type DeleteAccountLinkValidationType = z.infer<ReturnType<typeof DeleteAccountLinkValidation>>