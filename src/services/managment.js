const Users = require("../dao/users.dao.js");
const UserRepository = require("../repository/userRepository.js");


const usersService = new UserRepository(new Users());

module.exports = {
    usersService
};