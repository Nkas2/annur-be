import Joi from "joi";

const getEventValidation = Joi.object({
  page: Joi.number().min(1).positive().default(1),
  size: Joi.number().min(1).positive().max(100).default(10),
});

const createEventValidation = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(10_000).required(),
  event_start: Joi.date().iso().required(),
  event_end: Joi.date().iso().greater(Joi.ref("event_start")).required(),
  type_id: Joi.number().integer().required(),
});

const editEventValidation = Joi.object({
  id: Joi.number().positive().required(),
  title: Joi.string().max(100).required(),
  description: Joi.string().max(10_000).required(),
  event_start: Joi.date().iso().required(),
  event_end: Joi.date().iso().greater(Joi.ref("event_start")).required(),
  type_id: Joi.number().integer().required(),
});

const deleteEventValidation = Joi.object({
  id: Joi.number().positive().required(),
});

export {
  getEventValidation,
  createEventValidation,
  editEventValidation,
  deleteEventValidation,
};
