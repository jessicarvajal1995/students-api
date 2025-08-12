import { prisma } from "../infrastructure/db/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

export const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
  password: z.string().min(8).max(128),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function register(input: z.infer<typeof RegisterSchema>) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new Error("Email ya registrado");
  const hashed = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: { email: input.email, name: input.name, password: hashed },
  });
  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "1d" });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function login(input: z.infer<typeof LoginSchema>) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("Credenciales inválidas");
  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) throw new Error("Credenciales inválidas");
  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "1d" });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}
