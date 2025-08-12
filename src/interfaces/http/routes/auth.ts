import { Router } from "express";
import { RegisterSchema, LoginSchema, register, login } from "../../../application/authService.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const input = RegisterSchema.parse(req.body);
    const result = await register(input);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Error de registro" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const input = LoginSchema.parse(req.body);
    const result = await login(input);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message ?? "Credenciales inválidas" });
  }
});
