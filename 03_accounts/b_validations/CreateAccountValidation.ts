import { z } from 'zod';

export const CreateAccountValidation = z.object({
    name: z.string()
        .min(1, "is required")
        .max(255, "contains too many characters")
        .regex(/^[^<>&'"/]+$/, "contains disallowed characters"),
    email: z.string()
        .email("must be a valid email")
        .max(255, "contains too many characters"),
    password: z.string()
        .min(8, "must be at least 8 characters long")
        .max(255, "contains too many characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, "must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    link: z.string()
        .url("must be a valid link")
        .max(255, "contains too many characters"),
});

// types
export type CreateAccountValidationType = z.infer<typeof CreateAccountValidation>;