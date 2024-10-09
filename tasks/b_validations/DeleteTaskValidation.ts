import { z } from 'zod'

export const DeleteTaskValidation = z.object({
    deleteId: z.string()
    .uuid(),
});

// types
export type DeleteTaskValidationType = z.infer<typeof DeleteTaskValidation>