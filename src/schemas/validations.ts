import { TaskStatus } from "@/types/task";
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter número"),
});

export const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  status: z
    .enum(["PENDING", "COMPLETED"] as [TaskStatus, TaskStatus])
    .default("PENDING"),
});

export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof LoginSchema>;
export type TaskData = z.infer<typeof TaskSchema>;
