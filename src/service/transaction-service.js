import { validate } from "../validation/validation.js";
import {
  createTransactionValidation,
  deleteTransactionValidation,
  editTransactionValidation,
  getTransactionsValidation,
} from "../validation/transaction-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const get = async (request) => {
  request = validate(getTransactionsValidation, request);

  const startDate = new Date(request.year, request.month - 1, 1); // bulan dimulai dari 0 (Januari = 0)
  const endDate = new Date(request.year, request.month, 0, 23, 59, 59, 999); // hari terakhir bulan ini

  return prismaClient.transactions.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
      transaction_type: request.type,
    },
  });
};

const create = async (request) => {
  request = validate(createTransactionValidation, request);

  return prismaClient.transactions.create({
    data: {
      amount: request.amount,
      date: request.date,
      remark: request.remark,
      transaction_type: request.transaction_type,
      created_by: {
        connect: {
          id: request.user_id,
        },
      },
    },
  });
};

const edit = async (request) => {
  request = validate(editTransactionValidation, request);

  const count = await prismaClient.transactions.count({
    where: {
      id: request.id,
    },
  });

  if (!count) {
    throw new ResponseError(404, "Transaction not found");
  }

  return prismaClient.transactions.update({
    where: {
      id: request.id,
    },
    data: {
      amount: request.amount,
      date: request.date,
      remark: request.remark,
      transaction_type: request.transaction_type,
    },
  });
};

const remove = async (request) => {
  request = validate(deleteTransactionValidation, request);

  const count = await prismaClient.transactions.count({
    where: {
      id: request.id,
    },
  });

  if (!count) {
    throw new ResponseError(404, "Transaction not found");
  }

  return prismaClient.transactions.delete({
    where: {
      id: request.id,
    },
  });
};

const getListTransactions = async (year, month) => {
  const where = {};

  // Filter berdasarkan tahun
  if (year && year !== "all") {
    const parsedYear = parseInt(year);
    if (!isNaN(parsedYear)) {
      where.date = {
        ...where.date,
        gte: new Date(parsedYear, 0, 1),
        lte: new Date(parsedYear, 11, 31, 23, 59, 59, 999),
      };
    }
  }

  // Filter berdasarkan bulan (jika bukan 0)
  if (month && month !== 0) {
    const parsedMonth = month - 1; // karena bulan di Date dimulai dari 0 (Januari = 0)
    const from = new Date(
      year && year !== "all" ? parseInt(year) : new Date().getFullYear(),
      parsedMonth,
      1,
    );
    const to = new Date(
      from.getFullYear(),
      from.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    where.date = {
      gte: from,
      lte: to,
    };
  }

  return prismaClient.transactions.findMany({
    where,
    orderBy: {
      date: "desc",
    },
  });
};

const getIncomeAndExpense = async () => {
  const result = await prismaClient.transactions.groupBy({
    by: ["transaction_type"],
    _sum: {
      amount: true,
    },
  });

  const income =
    result.find((r) => r.transaction_type === "income")?._sum.amount ?? 0;
  const expenses =
    result.find((r) => r.transaction_type === "expenses")?._sum.amount ?? 0;

  let total = income - expenses;
  total = total.toString();

  return { income, expenses, total };
};

const getTransactionDetails = async (id) => {
  const trans = await prismaClient.transactions.findFirst({
    where: {
      id: id,
    },
  });

  return trans;
};

export default {
  get,
  create,
  edit,
  remove,
  getListTransactions,
  getIncomeAndExpense,
  getTransactionDetails,
};
