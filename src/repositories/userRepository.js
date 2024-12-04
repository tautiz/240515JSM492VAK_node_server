'use strict';

const BaseRepository = require('./baseRepository');
const User = require('../models/user');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByToken(token) {
        return this.findOne({ token });
    }

    async findByEmail(email) {
        return this.findOne({ email });
    }

    async updateToken(userId, token) {
        return this.update(userId, { token });
    }
}

module.exports = new UserRepository();
