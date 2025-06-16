import Joi from "joi";

const createAccountValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    role: Joi.number().positive().required(),
})

const editAccountValidation = Joi.object({
    id: Joi.number().positive().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.number().positive().required(),
})

const deleteAccountValidation = Joi.object({
    id: Joi.number().positive().required(),
});
export {
    createAccountValidation,
    editAccountValidation,
    deleteAccountValidation
}