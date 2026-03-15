import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import simulationsRouter from "./routes/simulations";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/simulations", simulationsRouter);

export default app;
