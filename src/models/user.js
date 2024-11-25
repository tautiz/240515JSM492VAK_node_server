'use strict';
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        email: {type: 'string', required: true, unique: true},
        password: {type: 'string', required: true},
        token: {type: 'string', required: true},
        role: {
            type: String,
            enum: ['user', 'admin', 'manager'],
            default: 'user'
        },
        permissions: [{
            type: String
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);
module.exports = mongoose.model('User', userSchema, 'users');