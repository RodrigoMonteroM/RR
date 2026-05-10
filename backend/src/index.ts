import express from "express";
import routerHealthCheck from "@/routes/healtCheck";
import authRouter from "@/routes/auth.router";
import userRouter from "@/routes/user.router";
import boxRouter from "@/routes/box.router";
import itemRouter from "@/routes/item.router";
import { requestLogger } from "@/middlewares/requestLogger";
import { logger } from "@/lib/logger";
import cors from "cors";
import helmet from "helmet";
import {env} from '@/lib/env';
import {errorHandler} from "@/middlewares/errorHandler";

const app = express();
const port = env.PORT || 3000;

const allowedOrigins = (env.FRONTEND_URL || "http://localhost:5173").split(",");
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.options("*", cors());

app.use(helmet());

app.use(express.json());
app.use(requestLogger);

app.use("/api", routerHealthCheck);
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", boxRouter);
app.use("/api", itemRouter);

app.use(errorHandler);

app.listen(port, () => {
    logger.server(`Listening on http://localhost:${port}`);
    logger.info("Routes mounted: /api/health · /api/auth · /api/user · /api/boxes · /api/items");
});