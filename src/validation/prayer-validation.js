import Joi from "joi";

const getPrayerValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
});

const createPrayerValidation = Joi.object({
  name: Joi.string().required(),
  schedule: Joi.date().iso().required(),
})

const editPrayerValidation = Joi.object({
  id: Joi.number().positive().required(),
  name: Joi.string().required(),
  schedule: Joi.date().iso().required(),
})

const removePrayerValidation = Joi.object({
  id: Joi.number().positive().required(),
})

export { getPrayerValidation, createPrayerValidation, editPrayerValidation, removePrayerValidation };
