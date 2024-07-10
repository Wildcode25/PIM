import z from 'zod'

export const loginSchema = z.object({
  
    email: z.string().email({
        required_error: "Email is required",
        message: 'Invalid email'
    }),
    password: z.string({
        required_error: "Password is required"
    })
    
  })
  
  