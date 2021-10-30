const Joi = require("joi");

exports.signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.updateStatrusUserSchema = Joi.object(
  {
    subscription: Joi.string().valid("starter", "pro", "business").required(),
  },
  { stripUnknown: true }
);
