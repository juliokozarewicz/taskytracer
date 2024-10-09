import { z } from 'zod'

export const CreateCategoryValidation = z.object({
    categoryName: z.string()
        .min(1, "is required")
        .max(255, "contains too many characters")
        .regex(
            /^[^<>&'"/]+$/,
            "contains disallowed characters"
        ),
});

// types
export type CreateCategoryValidationType = z.infer<typeof CreateCategoryValidation>