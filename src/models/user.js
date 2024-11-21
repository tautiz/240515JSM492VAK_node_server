'use strict';
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        email: {type: 'string', required: true, unique: true},
        password: {type: 'string', required: true},
        token: {type: 'string', required: true}
    },
    {
        timestamps: true,
        versionKey: false
    }
);
module.exports = mongoose.model('User', userSchema, 'users');