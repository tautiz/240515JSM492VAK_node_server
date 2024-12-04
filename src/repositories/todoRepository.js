'use strict';

const BaseRepository = require('./baseRepository');
const Todo = require('../models/todo');

class TodoRepository extends BaseRepository {
    constructor() {
        super(Todo);
    }

    async findByUserId(userId) {
        return this.model.find({ userId });
    }

    async findByTeam(teamId) {
        return this.model.find({ teamId });
    }

    async findTodoWithOwner(todoId) {
        return this.model.findById(todoId).populate('userId', 'email role');
    }

    async createTodo(todoData) {
        return this.create({
            ...todoData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async updateTodo(todoId, todoData) {
        return this.update(todoId, {
            ...todoData,
            updatedAt: new Date()
        });
    }

    async findUserTodos(userId, filter = {}) {
        const query = { userId, ...filter };
        return this.model.find(query).sort({ createdAt: -1 });
    }

    async findTeamTodos(teamId, filter = {}) {
        const query = { teamId, ...filter };
        return this.model.find(query).sort({ createdAt: -1 });
    }

    async findAllTodos(filter = {}) {
        return this.model.find(filter).sort({ createdAt: -1 });
    }
}

module.exports = new TodoRepository();
