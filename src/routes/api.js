import express from "express";
import eventController from "../controllers/event-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { upload } from "../application/multer.js";
import prayerControler from "../controllers/prayer-controler.js";
import accountController from "../controllers/account-controller.js";
import transactionControllers from "../controllers/transaction-controllers.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// event
userRouter.post(
  "/api/events",
  upload.array("images", 5),
  eventController.create,
);
userRouter.put(
  "/api/events/:id",
  upload.array("images", 5),
  eventController.edit,
);
userRouter.delete("/api/events/:id", eventController.remove);
userRouter.get("/api/events", eventController.get);
userRouter.post("/api/event/type", eventController.createEventType);
userRouter.get("/api/events/type", eventController.getEventType);

// prayer
userRouter.get("/api/prayer", prayerControler.get);
userRouter.post("/api/prayer", prayerControler.create);
userRouter.put("/api/prayer/:id", prayerControler.edit);
userRouter.delete("/api/prayer/:id", prayerControler.remove);

// account
userRouter.get("/api/accounts", accountController.get);
userRouter.post("/api/accounts", accountController.create);
userRouter.put("/api/accounts/:id", accountController.edit);
userRouter.delete("/api/accounts/:id", accountController.remove);

// transactions
userRouter.get("/api/transactions", transactionControllers.get);
userRouter.post("/api/transactions", transactionControllers.create);
userRouter.put("/api/transactions/:id", transactionControllers.edit);
userRouter.delete("/api/transactions/:id", transactionControllers.remove);

export { userRouter };
