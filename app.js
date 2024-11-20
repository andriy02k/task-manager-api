import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "./db.js";

import tasksRouter from "./routes/tasksRouter.js";
import authRouter from "./routes/usersRouter.js";
import { auth } from "./middleware/auth.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/tasks", auth, tasksRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(8080, () => {
  console.log("Server is running. Use our API on port: 8080");
});

export default app;
