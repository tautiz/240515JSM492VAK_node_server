'use strict';

const Todo = require('../models/todo');
const mongoose = require('mongoose');

exports.getAllTodos = async (req, res) => {
    try {
        let query = { userId: req.user._id };
        
        // Jei vartotojas yra manager, pridedame team todos
        if (req.user.role === 'manager') {
            query = {
                $or: [
                    { userId: req.user._id },
                    { teamId: req.user.teamId }
                ]
            };
        }
        
        // Jei vartotojas yra admin, grąžiname visus todos
        if (req.user.role === 'admin') {
            query = {};
        }
        
        const todos = await Todo.find(query);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTodoById = async (req, res) => {
    const id = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Netinkamas ID tipas" });
        }
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }
        res.json(todo);
    } catch (err) {
        // Patikrinkite, ar klaida dėl netinkamo ObjectId
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        res.status(500).json({ error: "Klaida skaitant duomenis" });
    }
};

exports.createTodo = async (req, res) => {
    try {
        const { title, status } = req.body;
        const vartotojoId = req.user._id;
        if (!title || !status) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }
        const todo = new Todo({ title, status, userId: vartotojoId });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ error: "Klaida išsaugant duomenis: " + err.toString() });
    }

};

exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.body.status) {
            return res.status(400).json({ error: "Trūksta statuso lauko" });
        }

        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }
        const { status } = req.body;
        await Todo.findByIdAndUpdate(id, { status });
        res.json({ message: "Statusas pakeistas" });
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas" });
        }
        return res.status(500).json({ error: "Klaida atnaujinant duomenis" });
    }
};

exports.updateTodo = async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        const { title, author, status } = req.body;
        if (!title || !author || !status) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }

        todo.title = title;
        todo.author = author; 
        todo.status = status;

        await todo.save();
        res.json({ message: "Elementas atnaujintas", data: todo });
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
    }
};

exports.partialUpdateTodo = async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        const { title, author, status } = req.body;
        
        if (title) todo.title = title;
        if (author) todo.author = author;
        if (status) todo.status = status;

        await todo.save();
        res.json({ message: "Elementas dalinai atnaujintas", data: todo });
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
    }
};

exports.deleteTodo = async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }
        res.json({ message: "Elementas ištrintas", data: todo });
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida trinant duomenis: " + err.toString() });
    }
};

exports.markTodoAsDone = async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findByIdAndUpdate(
            id,
            { status: 'done' },
            { new: true }
        );
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }
        res.json({ message: "Užduotis pažymėta kaip atlikta", data: todo });
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida atnaujinant statusą: " + err.toString() });
    }
};

exports.cancelTodo = async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        );
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }
        res.json({ message: "Užduotis atšaukta", data: todo });
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida atšaukiant užduotį: " + err.toString() });
    }
};
