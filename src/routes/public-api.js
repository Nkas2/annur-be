import express from "express";
import userController from "../controllers/user-controller.js";
import eventController from "../controllers/event-controller.js";
import transactionControllers from "../controllers/transaction-controllers.js";

const publicRoutes = new express.Router();
publicRoutes.post("/api/users/login", userController.login);

publicRoutes.get(
  "/api/list/transactions",
  transactionControllers.getListTransactions,
);

export { publicRoutes };
