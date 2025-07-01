import express from "express";
import userController from "../controllers/user-controller.js";
import eventController from "../controllers/event-controller.js";
import transactionControllers from "../controllers/transaction-controllers.js";
import accountController from "../controllers/account-controller.js";

const publicRoutes = new express.Router();
publicRoutes.post("/api/users/login", userController.login);

publicRoutes.get(
  "/api/list/transactions",
  transactionControllers.getListTransactions,
);

publicRoutes.get(
  "/api/ince/transactions",
  transactionControllers.getIncomeAndExpense,
);

publicRoutes.get("/api/list/events", eventController.getEventList);
publicRoutes.get("/api/event/details/:id", eventController.getEventDetail);

publicRoutes.get("/api/list/account", accountController.getUserList);
publicRoutes.get("/api/details/account/:id", accountController.getUserDetail);

export { publicRoutes };
