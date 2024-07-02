import z from 'zod'

export const userSchema = z.object({
    name: z.string({
      invalid_type_error: 'Name title must be a string',
      required_error: 'Name is required.'
    }),
    email: z.string().email({
        required_error: "Email is required",
        message: 'Invalid email'
    }),
    password: z.string({
        required_error: "Password is required"
    })
    
  })
  
  