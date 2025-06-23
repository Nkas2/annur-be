import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import {
  createAccountValidation,
  deleteAccountValidation,
  editAccountValidation,
} from "../validation/account-validation.js";
import bcrypt from "bcrypt";

const get = async (request, user) => {
  if (user?.roles?.name !== "admin") {
    throw new ResponseError(400, "Access denied");
  }
  return prismaClient.user.findMany({
    where: {
      id: {
        not: user.id,
      },
    },
    include: {
      roles: {
        select: {
          name: true,
        },
      },
    },
  });
};

const create = async (request, user) => {
  if (user?.roles?.name !== "admin") {
    throw new ResponseError(400, "Access denied");
  }

  request = validate(createAccountValidation, request);

  const createUser = await prismaClient.user.create({
    data: {
      name: request.name,
      roles: {
        connect: {
          id: request.role,
        },
      },
      email: request.email,
      password: await bcrypt.hash(request.password, 10),
      username: request.username,
    },
    include: {
      roles: {
        select: {
          name: true,
        },
      },
    },
  });

  return createUser;
};

const edit = async (request, user) => {
  if (user?.roles?.name !== "admin") {
    throw new ResponseError(400, "Access denied");
  }

  request = validate(editAccountValidation, request);

  const count = await prismaClient.user.count({
    where: {
      id: request.id,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "User not found");
  }

  return prismaClient.user.update({
    where: {
      id: request.id,
    },
    data: {
      name: request.name,
      roles: {
        connect: {
          id: request.role,
        },
      },
      email: request.email,
      password: await bcrypt.hash(request.password, 10),
    },
    include: {
      roles: {
        select: {
          name: true,
        },
      },
    },
  });
};

const remove = async (request, user) => {
  if (user?.roles?.name !== "admin") {
    throw new ResponseError(400, "Access denied");
  }

  request = validate(deleteAccountValidation, request);

  const count = await prismaClient.user.count({
    where: {
      id: request.id,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "User not found");
  }

  return prismaClient.user.delete({
    where: {
      id: request.id,
    },
  });
};

const getRole = async () => {
  return prismaClient.role.findMany({});
};

export default {
  get,
  create,
  edit,
  remove,
  getRole,
};
