import express from "express";
import routerHealthCheck from "@/routes/healtCheck";
import authRouter from "@/routes/auth.router";
import userRouter from "@/routes/user.router";
import { requestLogger } from "@/middlewares/requestLogger";
import { logger } from "@/lib/logger";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173", // URL de tu frontend de Vite
    credentials: true
}));

app.use(express.json());
app.use(requestLogger);

app.use("/api", routerHealthCheck);
app.use("/api", authRouter);
app.use("/api", userRouter);

app.listen(port, () => {
    logger.server(`Listening on http://localhost:${port}`);
    logger.info("Routes mounted: /api/health · /api/auth · /api/user");
});