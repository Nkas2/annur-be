import { prismaClient } from "../application/database.js";
import {
  getUserValidation,
  loginUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { ResponseError } from "../error/response-error.js";
import { v4 as uuid } from "uuid";

const login = async (request) => {
  const login = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: login.username,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Wrong username or password");
  }

  const userCompare = await bcrypt.compare(login.password, user.password);

  if (!userCompare) {
    throw new ResponseError(401, "Wrong username or password");
  }

  const token = uuid().toString();
  return prismaClient.user.update({
    data: {
      token,
    },
    where: {
      username: login.username,
    },
    select: {
      token: true,
      role: true,
    },
    include: {
      roles: true,
    },
  });
};

const get = async (username) => {
  username = await validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return user;
};

export default { login, get };
