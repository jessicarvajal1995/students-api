import "dotenv/config";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { authRouter } from "./interfaces/http/routes/auth.js";
import { studentsRouter } from "./interfaces/http/routes/students.js";

const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRouter);
app.use("/students", studentsRouter);

// Manejo de errores por default
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Error interno" });
});

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
