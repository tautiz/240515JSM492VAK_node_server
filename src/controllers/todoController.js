// Importuojame reikalingus modulius
'use strict';

const todoRepository = require('../repositories/todoRepository');
const mongoose = require('mongoose');

/**
 * Gauti visas užduotis
 * Ši funkcija grąžina visas užduotis, kurias vartotojas turi teisę matyti
 */
exports.getAllTodos = async (req, res, next) => {
    try {
        let todos;
        const user = req.user;
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            filter: req.query.filter || {}
        };

        switch (user.role) {
            case 'admin':
                todos = await todoRepository.findAllTodos(options);
                break;
            case 'manager':
                todos = await todoRepository.findByTeam(user.teamId, options);
                break;
            default:
                todos = await todoRepository.findByUserId(user._id, options);
        }

        res.json(todos);
    } catch (error) {
        next(error);
    }
};

/**
 * Gauti užduotį pagal ID
 * Ši funkcija grąžina konkrečią užduotį, jei vartotojas turi teisę ją matyti
 */
exports.getTodoById = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Netinkamas ID tipas" });
        }

        const todo = await todoRepository.findTodoWithOwner(id);
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        if (req.user.role !== 'admin' && todo.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių peržiūrėti šią užduotį" });
        }

        res.json(todo);
    } catch (err) {
        next(err);
    }
};

/**
 * Sukurti naują užduotį
 * Ši funkcija leidžia vartotojui sukurti naują užduotį
 */
exports.createTodo = async (req, res, next) => {
    try {
        const { title, status } = req.body;
        if (!title || !status) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }

        const todoData = {
            title,
            status,
            userId: req.user._id,
            teamId: req.user.teamId
        };

        const todo = await todoRepository.createTodo(todoData);
        res.status(201).json(todo);
    } catch (err) {
        next(err);
    }
};

/**
 * Pakeisti užduoties būseną
 * Ši funkcija leidžia vartotojui pakeisti užduoties būseną
 */
exports.changeStatus = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!req.body.status) {
            return res.status(400).json({ error: "Trūksta statuso lauko" });
        }

        const todo = await todoRepository.findById(id);
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių keisti šios užduoties" });
        }

        const updatedTodo = await todoRepository.updateTodo(id, { status: req.body.status });
        res.json(updatedTodo);
    } catch (err) {
        next(err);
    }
};

/**
 * Atnaujinti užduotį
 * Ši funkcija leidžia vartotojui atnaujinti užduoties informaciją
 */
exports.updateTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const todo = await todoRepository.findById(id);
        
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių atnaujinti šią užduotį" });
        }

        const updatedTodo = await todoRepository.updateTodo(id, req.body);
        res.json(updatedTodo);
    } catch (err) {
        next(err);
    }
};

/**
 * Ištrinti užduotį
 * Ši funkcija leidžia vartotojui ištrinti užduotį
 */
exports.deleteTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const todo = await todoRepository.findById(id);

        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių ištrinti šią užduotį" });
        }

        await todoRepository.delete(id);
        res.status(204).send();
    } catch (err) {
        next(err); // Perduodame klaidą į error handling middleware
    }
};

/**
 * Pažymėti užduotį kaip atliktą
 * Ši funkcija leidžia vartotojui pažymėti užduotį kaip atliktą
 */
exports.markTodoAsDone = async (req, res, next) => {
    try {
        const id = req.params.id;
        const todo = await todoRepository.findById(id);

        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių keisti šios užduoties" });
        }

        const updatedTodo = await todoRepository.updateTodo(id, { status: 'done' });
        res.json(updatedTodo);
    } catch (err) {
        next(err);
    }
};

/**
 * Atšaukti užduotį
 * Ši funkcija leidžia vartotojui atšaukti užduotį
 */
exports.cancelTodo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const todo = await todoRepository.findById(id);

        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių keisti šios užduoties" });
        }

        const updatedTodo = await todoRepository.updateTodo(id, { status: 'cancelled' });
        res.json(updatedTodo);
    } catch (err) {
        next(err);
    }
};
