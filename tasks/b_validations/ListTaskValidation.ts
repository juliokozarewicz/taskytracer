import { z } from 'zod'
import { Request } from 'express'

export const ListTaskValidation = (req: Request) => {
    return z.object({

    email: z.string()
        .email(req.t("must_be_a_valid_email"))
        .max(255, req.t("contains_too_many_characters")),

    id: z.string()
        .regex(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
            req.t("not_valid")
        ),

    taskname: z.string()
        .min(1, req.t("is_required"))
        .max(255, req.t("too_many_characters"))
        .regex(
            /^[^<>&'"/]+$/,
            req.t("disallowed_characters")
        )
        .optional(),

    category: z.string()
        .min(1, req.t("is_required"))
        .max(255, req.t("too_many_characters"))
        .regex(
            /^[^<>&'"/]+$/,
            req.t("disallowed_characters")
        )
        .optional(),

    description: z.string()
        .min(1, req.t("is_required"))
        .max(500, req.t("too_many_characters"))
        .regex(
            /^[^<>&'"/]+$/,
            req.t("disallowed_characters")
        )
        .optional(),

    initduedate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, req.t("date_format"))
        .refine(date => !isNaN(Date.parse(date)), {
            message: req.t("valid_date"),
        })
        .optional(),
    
    endduedate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, req.t("date_format"))
        .refine(date => !isNaN(Date.parse(date)), {
            message: req.t("valid_date"),
        })
        .optional(),

    status: z.string()
        .min(1, req.t("is_required"))
        .max(500, req.t("too_many_characters"))
        .regex(
            /^[^<>&'"/]+$/,
            req.t("disallowed_characters")
        )
        .optional(),

    })
}

// types
export type ListTaskValidationType = z.infer<ReturnType<typeof ListTaskValidation>>
