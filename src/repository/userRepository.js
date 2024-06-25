const Users = require("../dao/users.dao.js");
const GenericRepository = require("./GenericRepository.js");

class UserRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    getUserByEmail(email) {
        return this.getBy({ email });
    }

    getUserById(id) {
        return this.getBy({ _id: id });
    }
}

module.exports = UserRepository;
