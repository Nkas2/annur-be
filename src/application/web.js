import express from "express";
import { publicRoutes } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import { userRouter } from "../routes/api.js";

export const web = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
web.use(express.json());

web.get("/", (req, res, next) => {
  res.send("work");
});

web.use("/upload", express.static(path.join(__dirname, "../../uploads")));

web.use(publicRoutes);
web.use(userRouter);

web.use(errorMiddleware);
