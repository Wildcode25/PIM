import z from "zod";

export const registerSchema = z
  .object({
    name: z.string({
      invalid_type_error: "Name title must be a string",
      required_error: "Name is required.",
    }),
    email: z.string().email({
      required_error: "Email is required",
      message: "Invalid email",
    }),
    password: z
      .string({
        required_error: "Password is required"
      })
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, {
        message: "Password must be no more than 100 characters long",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string({
      required_error: "field required"
    })
  
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});
