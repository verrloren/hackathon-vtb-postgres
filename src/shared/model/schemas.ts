import * as z from 'zod';

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Enter valid email'
	}),
	password: z.string().min(1, { message: 'Password is required' }),
});


export const RegisterSchema = z.object({
	email: z.string().email({
		message: 'Enter valid email'
	}),
	password: z.string().min(6, { message: 'Minimum 6 characters required' }),
	name: z.string().min(1, { message: 'Name is required' }),
});

export const createProjectSchema = z.object({
	projectName: z.string().min(1, "Project name is required"),
});


export type CreateProjectFormData = z.infer<typeof createProjectSchema>;