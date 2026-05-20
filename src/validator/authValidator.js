import z from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  lastname: z.string().trim().min(1, "Lastname must be at least 1 characters"),
  username: z.string().trim().min(2, "Username must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email required")
    .email("Please provide a valid email")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().min(2, "Name must be at least 2 characters"),
  password: z.string().min(1, "Password is required"),
});

export { registerSchema, loginSchema };
