import Joi from "joi";

const getTransactionsValidation = Joi.object({
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().min(2000).required(),
    type: Joi.string().valid("expenses", "income").required()
})

const createTransactionValidation = Joi.object({
    amount: Joi.number().min(1).required(),
    date: Joi.date().iso().required(),
    remark: Joi.string().min(1).required(),
    transaction_type: Joi.string().valid("expenses", "income").required(),
    user_id: Joi.number().min(1).required(),
})

const editTransactionValidation = Joi.object({
    id: Joi.number().positive().required(),
    amount: Joi.number().min(1).required(),
    date: Joi.date().iso().required(),
    remark: Joi.string().min(1).required(),
    transaction_type: Joi.string().valid("expenses", "income").required(),
})

const deleteTransactionValidation = Joi.object({
    id: Joi.number().positive().required(),
});

export {
    getTransactionsValidation,
    createTransactionValidation,
    editTransactionValidation,
    deleteTransactionValidation
}