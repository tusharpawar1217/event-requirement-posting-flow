const { z } = require('zod');

// Password must be at least 8 chars with letter + number
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: passwordSchema,
  role: z.enum(['client', 'planner', 'performer', 'crew'], {
    errorMap: () => ({ message: 'Role must be client, planner, performer, or crew' })
  })
}).strict();

const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required')
}).strict();

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema
}).strict();

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema
};
