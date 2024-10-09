import { z } from 'zod'

export const DeleteCategoryValidation = z.object({
    categoryId: z.string()
    .uuid(),
});

// types
export type DeleteCategoryValidationType = z.infer<typeof DeleteCategoryValidation>