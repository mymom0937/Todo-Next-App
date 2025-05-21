import { z } from "zod";

const AuthSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email." })
    .refine(
      (email) => {
        // More strict email validation
        // Rejects standalone .co, .io, etc. unless they're part of valid country codes
        const validTLDRegex = /^[^\s@]+@[^\s@]+\.(?:com|net|org|edu|gov|mil|int|info|biz|name|pro|museum|coop|aero|[a-z]{2,4}\.[a-z]{2})$/i;
        return validTLDRegex.test(email);
      },
      { message: "Invalid email domain. Please use a valid email address." }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
  name: z.string().min(1, { message: "Name is required." }).optional(),
});

export default AuthSchema;
