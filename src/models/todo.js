'use strict';

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {type: 'string', required: true},
    status: {type: 'string', required: true},
    description: {type: 'string', required: false},
    author: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    // ,
    // teamId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Team',
    //     default: null
    // }
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Todo', todoSchema, 'todo');