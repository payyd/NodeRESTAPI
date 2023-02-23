const Joi = require('joi');

class UserDto {
    id;
    first_name;
    last_name;
    email;
    password;
    DOB; 
    rating;
}

module.exports = UserDto;
