import express from "express";
import userController from "../controllers/user-controller.js";
import eventController from "../controllers/event-controller.js";

const publicRoutes = new express.Router();
publicRoutes.post("/api/users/login", userController.login);

export { publicRoutes };
