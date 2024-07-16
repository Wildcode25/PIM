import z from "zod";

export const productSchema = z.object({
    name: z.string({
        required_error: "name is required",
        invalid_type_error: "name must be string"
    }).max(20),
    description: z.string(),
    price: z.number().positive({message: "debe ser un numero positivo"})
    .refine(value=>Number.isInteger(value*100), {
        message: "No more than two decimals"
    }),
    stock: z.number({
        required_error: "stock is required",
    }).int(),
    categories: z.array(z.enum(["appliances", "kitchen", "cleaning","cooking", "laundry", "cooling", "home"], {
        message: "Invalid categorie",
        required_error: "Categories is required"
    }))
})