import transactionService from "../service/transaction-service.js";

const get = async (req, res, next) => {
  try {
    const result = await transactionService.get(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    req.body.user_id = req.user.id;
    const result = await transactionService.create(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const edit = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    const result = await transactionService.edit(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await transactionService.remove({
      id: req.params.id,
    });
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getListTransactions = async (req, res, next) => {
  try {
    const result = await transactionService.getListTransactions();
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getIncomeAndExpense = async (req, res, next) => {
  try {
    const result = await transactionService.getIncomeAndExpense();
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  get,
  create,
  edit,
  remove,
  getListTransactions,
  getIncomeAndExpense,
};
