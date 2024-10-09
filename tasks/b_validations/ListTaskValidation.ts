import { z } from 'zod';

export const ListTaskValidation = z.object({

    taskname: z.string()
        .min(1, "is required")
        .max(255, "contains too many characters")
        .regex(
            /^[^<>&'"/]+$/,
            "contains disallowed characters"
        )
        .optional(),

    category: z.string()
        .min(1, "is required")
        .max(255, "contains too many characters")
        .regex(
            /^[^<>&'"/]+$/,
            "contains disallowed characters"
        )
        .optional(),

    description: z.string()
        .min(1, "is required")
        .max(500, "contains too many characters")
        .regex(
            /^[^<>&'"/]+$/,
            "contains disallowed characters"
        )
        .optional(),

    initduedate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "must be in the format YYYY-MM-DD")
        .refine(date => !isNaN(Date.parse(date)), {
            message: "must be a valid date",
        })
        .optional(),
    
    endduedate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "must be in the format YYYY-MM-DD")
        .refine(date => !isNaN(Date.parse(date)), {
            message: "must be a valid date",
        })
        .optional(),

    status: z.string()
        .min(1, "is required")
        .max(500, "contains too many characters")
        .regex(
            /^[^<>&'"/]+$/,
            "contains disallowed characters"
        )
        .optional(),

});

// types
export type ListTaskValidationType = z.infer<typeof ListTaskValidation>;
