import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  owner: Joi.string(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string(),
  body: Joi.string(),
});
