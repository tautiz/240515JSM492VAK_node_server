const AppError = require('../utils/errors/AppError');
// Base repository klasė, kuri suteikia pagrindinius CRUD metodus
'use strict';

class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findOne(conditions) {
        return this.model.findOne(conditions);
    }

    async findById(id) {
        const result = await this.model.findById(id);
        if (!result) {
            throw new AppError('Todo elementas nerastas', 404);
        }
        return result;
    }

    async create(data) {
        return this.model.create(data);
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        const result = await this.model.findByIdAndDelete(id);
        if (!result) {
            throw new AppError('Todo elementas nerastas', 404);
        }
        return result;
    }
}

module.exports = BaseRepository;
