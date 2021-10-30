const Joi = require("joi");

exports.createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

exports.updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

exports.updateStatrusContactSchema = Joi.object(
  {
    favorite: Joi.boolean(),
  },
  { stripUnknown: true }
);
