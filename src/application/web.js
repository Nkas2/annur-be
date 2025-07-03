import express from "express";
import { publicRoutes } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import { userRouter } from "../routes/api.js";
import transactionControllers from "../controllers/transaction-controllers.js";

export const web = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
web.use(express.json());

web.get("/", (req, res, next) => {
  res.send("work");
});

web.use("/upload", express.static(path.join(__dirname, "../../uploads")));

web.post("/generate-report", transactionControllers.generateReportManual);
web.get("/download-report/:year/:month", transactionControllers.downloadReport);
web.use(publicRoutes);
web.use(userRouter);

web.use(errorMiddleware);
