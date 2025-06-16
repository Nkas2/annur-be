import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  } else {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
      include: {
        roles: true
      }
    });

    if (!user) {
      res.status(401).json({
        errors: "Unauthorized",
      });
    } else {
      req.user = user;
      next();
    }
  }
};
