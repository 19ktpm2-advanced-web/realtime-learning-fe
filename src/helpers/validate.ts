import { object, string } from "yup";

let registerSchema = object({
  fullName: string().required("Full name is required"),
  email: string().email("Email must be a valid email"),
  password: string()
    .min(8, "password must have at least 8 characters")
    .required("password is required")
});
let loginSchema = object({
  email: string().email("Email must be a valid email"),
  password: string()
    .min(8, "password must have at least 8 characters")
    .required("password is required")
});
export { registerSchema, loginSchema };
