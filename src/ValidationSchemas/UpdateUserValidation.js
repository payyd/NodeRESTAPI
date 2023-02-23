const Joi = require('joi');

const UpdateUserValidation = Joi.object({
            first_name: Joi.string().min(2).max(25).required(),
            last_name: Joi.string().min(2).max(25).required(),
            email: Joi.string().email().min(2).max(25).required(),
            password: Joi.string().min(2).max(25).required(),
            DOB: Joi.date().required(),
            rating: Joi.number().min(0).max(10).required()
});

module.exports = UpdateUserValidation;