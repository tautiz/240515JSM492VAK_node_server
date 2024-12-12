'use strict';

const BaseRepository = require('./baseRepository');
const Todo = require('../models/todo');
const AppError = require('../utils/errors/AppError');

const ERROR_MESSAGES = {
    USER_NOT_FOUND: (userId) => `Vartotojas su ID: ${userId} nerastas`,
    TEAM_NOT_FOUND: (teamId) => `Komanda su ID: ${teamId} nerasta`,
    TODO_NOT_FOUND: (todoId) => `Todo elementas su ID: ${todoId} nerastas`,
    DATABASE_ERROR: 'Klaida duomenų bazėje'
};

const DEFAULT_SORT = { createdAt: -1 };

class TodoRepository extends BaseRepository {
    constructor() {
        super(Todo);
    }

    async findByUserId(userId, options = {}) {
        try {
            const { page = 1, limit = 10, filter = {} } = options;
            const skip = (page - 1) * limit;

            const query = { userId, ...filter };
            const [items, total] = await Promise.all([
                this.model.find(query)
                    .sort(DEFAULT_SORT)
                    .skip(skip)
                    .limit(limit),
                this.model.countDocuments(query)
            ]);

            return {
                items,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND(userId), 404);
        }
    }

    async findByTeam(teamId, options = {}) {
        try {
            const { page = 1, limit = 10, filter = {} } = options;
            const skip = (page - 1) * limit;

            const query = { teamId, ...filter };
            const [items, total] = await Promise.all([
                this.model.find(query)
                    .sort(DEFAULT_SORT)
                    .skip(skip)
                    .limit(limit),
                this.model.countDocuments(query)
            ]);

            return {
                items,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new AppError(ERROR_MESSAGES.TEAM_NOT_FOUND(teamId), 404);
        }
    }

    async findTodoWithOwner(todoId) {
        try {
            const todo = await this.model.findById(todoId)
                .populate('userId', 'email role');
            
            if (!todo) {
                throw new AppError(ERROR_MESSAGES.TODO_NOT_FOUND(todoId), 404);
            }
            
            return todo;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ERROR_MESSAGES.DATABASE_ERROR, 500);
        }
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

    async findUserTodos(userId, options = {}) {
        return this.findByUserId(userId, options);
    }

    async findTeamTodos(teamId, options = {}) {
        return this.findByTeam(teamId, options);
    }

    async findAllTodos(options = {}) {
        const { page = 1, limit = 10, filter = {} } = options;
        return this.findAll({ page, limit, filter, sort: DEFAULT_SORT });
    }
}

module.exports = new TodoRepository();
