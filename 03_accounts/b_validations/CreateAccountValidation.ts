import { z } from 'zod'
import { Request } from 'express' // Import Request from express

// Function to create a validation schema with translations
export const CreateAccountValidation = (req: Request) => {
    return z.object({

        name: z.string()
            .min(1, req.t("is_required")) // Minimum length is 1 character
            .max(255, req.t("contains_too_many_characters")) // Maximum length is 255 characters
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters")), // Regex to disallow certain characters
        email: z.string()
            .email(req.t("must_be_a_valid_email")) // Must be a valid email format
            .max(255, req.t("contains_too_many_characters")), // Maximum length is 255 characters
        password: z.string()
            .min(8, req.t("must_be_at_least_8_characters_long")) // Minimum length is 8 characters
            .max(255, req.t("contains_too_many_characters")) // Maximum length is 255 characters
            .regex(/^[^<>&'"/]+$/, req.t("contains_disallowed_characters")) // disallowed characters
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, req.t("must_contain_at_least_one_uppercase_letter")), // Must include at least one uppercase letter, one lowercase letter, one number, and one special character
        link: z.string()
            .min(1, req.t("is_required"))
            .url(req.t("must_be_a_valid_link"))
            .max(255, req.t("contains_too_many_characters")),

    })
}

// types
export type CreateAccountValidationType = z.infer<ReturnType<typeof CreateAccountValidation>> // Infer type from the validation schema
