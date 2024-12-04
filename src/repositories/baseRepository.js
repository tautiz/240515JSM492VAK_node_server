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
        return this.model.findById(id);
    }

    async create(data) {
        return this.model.create(data);
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

module.exports = BaseRepository;
