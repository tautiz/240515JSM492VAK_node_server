'use strict';

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {type: 'string', required: true},
    status: {type: 'string', required: true},
    author: String
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Todo', todoSchema, 'todo');