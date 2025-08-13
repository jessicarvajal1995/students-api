import { prisma } from "../infrastructure/db/prisma";
import { z } from "zod";

export const StudentCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  birthDate: z.string().datetime().optional().nullable(), // ISO string
  grade: z.string().optional().nullable(),
});

export const StudentUpdateSchema = StudentCreateSchema.partial();

export async function listStudents(page = 1, limit = 10) {
  const [items, total] = await Promise.all([
    prisma.student.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.student.count(),
  ]);
  return { items, total, page, limit };
}

export function getStudent(id: string) {
  return prisma.student.findUnique({ where: { id } });
}

export function createStudent(input: z.infer<typeof StudentCreateSchema>) {
  const data = { ...input, birthDate: input.birthDate ? new Date(input.birthDate) : null };
  return prisma.student.create({ data });
}

export function updateStudent(id: string, input: z.infer<typeof StudentUpdateSchema>) {
  const data = { ...input, birthDate: input.birthDate ? new Date(input.birthDate) : undefined };
  return prisma.student.update({ where: { id }, data });
}

export function deleteStudent(id: string) {
  return prisma.student.delete({ where: { id } });
}
