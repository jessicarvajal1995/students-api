import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  listStudents, getStudent, createStudent, updateStudent, deleteStudent,
  StudentCreateSchema, StudentUpdateSchema
} from "../../../application/studentService.js";

export const studentsRouter = Router();

studentsRouter.use(authMiddleware);

studentsRouter.get("/", async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const data = await listStudents(page, limit);
  res.json(data);
});

studentsRouter.get("/:id", async (req, res) => {
  const s = await getStudent(req.params.id);
  if (!s) return res.status(404).json({ error: "No encontrado" });
  res.json(s);
});

studentsRouter.post("/", async (req, res) => {
  try {
    const input = StudentCreateSchema.parse(req.body);
    const s = await createStudent(input);
    res.status(201).json(s);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Datos inválidos" });
  }
});

studentsRouter.put("/:id", async (req, res) => {
  try {
    const input = StudentUpdateSchema.parse(req.body);
    const s = await updateStudent(req.params.id, input);
    res.json(s);
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? "Error al actualizar" });
  }
});

studentsRouter.delete("/:id", async (req, res) => {
  try {
    await deleteStudent(req.params.id);
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "No encontrado" });
  }
});
