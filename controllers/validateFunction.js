export function validateInput (schema,input) {
    return schema.safeParse(input)
  }