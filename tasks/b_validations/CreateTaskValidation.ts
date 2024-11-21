import { z } from 'zod'
import { Request } from 'express'

export const CreateTaskValidation = (req: Request) => {
    return z.object({

        email: z.string()
            .email(req.t("must_be_a_valid_email"))
            .max(255, req.t("contains_too_many_characters")),

        id: z.string()
            .regex(
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                req.t("not_valid")
            ),

        taskName: z.string()
            .min(1, req.t("is_required"))
            .max(255, req.t("too_many_characters"))
            .regex(
                /^[^<>&'"/]+$/,
                req.t("disallowed_characters")
            ),

        category: z.string()
            .min(1, req.t("is_required"))
            .max(255, req.t("too_many_characters"))
            .regex(
                /^[^<>&'"/]+$/,
                req.t("disallowed_characters")
            ),

        description: z.string()
            .min(1, req.t("is_required"))
            .max(500, req.t("too_many_characters"))
            .regex(
                /^[^<>&'"/]+$/,
                req.t("disallowed_characters")
            ),

        dueDate: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "must be in the format YYYY-MM-DD")
            .refine(date => !isNaN(Date.parse(date)), {
                message: "must be a valid date",
            })
            .transform(date => new Date(date)),

        statusName: z.string()
            .min(1, req.t("is_required"))
            .max(500, req.t("too_many_characters"))
            .regex(
                /^[^<>&'"/]+$/,
                req.t("disallowed_characters")
            ),

    })
}

// types
export type CreateTaskValidationType = z.infer<ReturnType<typeof CreateTaskValidation>>
