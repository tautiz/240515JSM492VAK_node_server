// Importuojame reikalingus modulius
'use strict';

const Todo = require('../models/todo'); // Importuojame Todo modelį, kuris leidžia sąveikauti su duomenų baze
const mongoose = require('mongoose'); // Importuojame mongoose, kuris padeda valdyti MongoDB duomenų bazę

/**
 * Gauti visas užduotis
 * Ši funkcija grąžina visas užduotis, kurias vartotojas turi teisę matyti
 */
exports.getAllTodos = async (req, res) => {
    try {
        // Pradinė užklausa, kuri grąžins tik tas užduotis, kurios priklauso prisijungusiam vartotojui
        let query = { userId: req.user._id };
        
        // Jei vartotojas yra manager, pridedame team todos
        if (req.user.role === 'manager') {
            query = {
                $or: [
                    { userId: req.user._id }, // Vartotojo užduotys
                    { teamId: req.user.teamId } // Komandos užduotys
                ]
            };
        }
        
        // Jei vartotojas yra admin, grąžiname visus todos
        if (req.user.role === 'admin') {
            query = {}; // Tuščia užklausa grąžina visas užduotis
        }
        
        const todos = await Todo.find(query); // Vykdome užklausą į duomenų bazę
        res.json(todos); // Grąžiname užduotis kaip JSON atsakymą
    } catch (error) {
        res.status(500).json({ error: error.message }); // Klaidos atveju grąžiname klaidos pranešimą
    }
};

/**
 * Gauti užduotį pagal ID
 * Ši funkcija grąžina konkrečią užduotį, jei vartotojas turi teisę ją matyti
 */
exports.getTodoById = async (req, res) => {
    const id = req.params.id; // Gauname užduoties ID iš užklausos parametrų
    try {
        // Tikriname ar ID yra tinkamo tipo
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Netinkamas ID tipas" });
        }
        const todo = await Todo.findById(id); // Ieškome užduoties pagal ID
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        // ACL patikrinimas
        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių peržiūrėti šią užduotį" });
        }

        res.json(todo); // Grąžiname užduotį kaip JSON atsakymą
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        res.status(500).json({ error: "Klaida skaitant duomenis" });
    }
};

/**
 * Sukurti naują užduotį
 * Ši funkcija leidžia vartotojui sukurti naują užduotį
 */
exports.createTodo = async (req, res) => {
    try {
        const { title, status } = req.body; // Gauname užduoties pavadinimą ir būseną iš užklausos kūno
        const vartotojoId = req.user._id; // Gauname prisijungusio vartotojo ID
        if (!title || !status) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }
        const todo = new Todo({ title, status, userId: vartotojoId }); // Sukuriame naują užduotį
        await todo.save(); // Išsaugome užduotį į duomenų bazę
        res.status(201).json(todo); // Grąžiname sukurtą užduotį kaip JSON atsakymą
    } catch (err) {
        res.status(500).json({ error: "Klaida išsaugant duomenis: " + err.toString() });
    }

};

/**
 * Pakeisti užduoties būseną
 * Ši funkcija leidžia vartotojui pakeisti užduoties būseną
 */
exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id; // Gauname užduoties ID iš užklausos parametrų

        if (!req.body.status) {
            return res.status(400).json({ error: "Trūksta statuso lauko" });
        }

        const todo = await Todo.findById(id); // Ieškome užduoties pagal ID
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        // ACL patikrinimas
        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių keisti šios užduoties būseną" });
        }

        const { status } = req.body; // Gauname naują būseną iš užklausos kūno
        await Todo.findByIdAndUpdate(id, { status }); // Atnaujiname užduoties būseną duomenų bazėje
        res.json({ message: "Statusas pakeistas" }); // Grąžiname atsakymą, kad būsena pakeista
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas" });
        }
        return res.status(500).json({ error: "Klaida atnaujinant duomenis" });
    }
};

/**
 * Atnaujinti užduotį
 * Ši funkcija leidžia vartotojui atnaujinti užduoties informaciją
 */
exports.updateTodo = async (req, res) => {
    const id = req.params.id; // Gauname užduoties ID iš užklausos parametrų
    try {
        const todo = await Todo.findById(id); // Ieškome užduoties pagal ID
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        // ACL patikrinimas
        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių redaguoti šią užduotį" });
        }

        const { title, status } = req.body; // Gauname naują pavadinimą ir būseną iš užklausos kūno
        if (!title || !status) {
            return res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }

        todo.title = title; // Atnaujiname užduoties pavadinimą
        todo.status = status; // Atnaujiname užduoties būseną

        await todo.save(); // Išsaugome pakeitimus į duomenų bazę
        res.json({ message: "Elementas atnaujintas", data: todo }); // Grąžiname atnaujintą užduotį kaip JSON atsakymą
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
    }
};

/**
 * Dalinai atnaujinti užduotį
 * Ši funkcija leidžia vartotojui dalinai atnaujinti užduoties informaciją
 */
exports.partialUpdateTodo = async (req, res) => {
    const id = req.params.id; // Gauname užduoties ID iš užklausos parametrų
    try {
        const todo = await Todo.findById(id); // Ieškome užduoties pagal ID
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        // ACL patikrinimas
        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių redaguoti šią užduotį" });
        }

        const { title, status } = req.body; // Gauname naują pavadinimą ir būseną iš užklausos kūno
        
        if (title) todo.title = title; // Atnaujiname užduoties pavadinimą, jei pateiktas
        if (status) todo.status = status; // Atnaujiname užduoties būseną, jei pateikta

        await todo.save(); // Išsaugome pakeitimus į duomenų bazę
        res.json({ message: "Elementas dalinai atnaujintas", data: todo }); // Grąžiname atnaujintą užduotį kaip JSON atsakymą
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
    }
};

/**
 * Ištrinti užduotį
 * Ši funkcija leidžia vartotojui ištrinti užduotį
 */
exports.deleteTodo = async (req, res) => {
    const id = req.params.id; // Gauname užduoties ID iš užklausos parametrų
    try {
        const todo = await Todo.findById(id); // Ieškome užduoties pagal ID
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        // ACL patikrinimas
        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių ištrinti šią užduotį" });
        }

        await Todo.findByIdAndDelete(id); // Ištriname užduotį iš duomenų bazės
        res.json({ message: "Elementas ištrintas", data: todo }); // Grąžiname atsakymą, kad užduotis ištrinta
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida trinant duomenis: " + err.toString() });
    }
};

/**
 * Pažymėti užduotį kaip atliktą
 * Ši funkcija leidžia vartotojui pažymėti užduotį kaip atliktą
 */
exports.markTodoAsDone = async (req, res) => {
    const id = req.params.id; // Gauname užduoties ID iš užklausos parametrų
    try {
        const todo = await Todo.findById(id); // Ieškome užduoties pagal ID
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        // ACL patikrinimas
        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių keisti šios užduoties būseną" });
        }

        todo.status = 'done'; // Atnaujiname užduoties būseną į 'done'
        await todo.save(); // Išsaugome pakeitimus į duomenų bazę
        
        res.json({ message: "Užduotis pažymėta kaip atlikta", data: todo }); // Grąžiname atnaujintą užduotį kaip JSON atsakymą
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida atnaujinant statusą: " + err.toString() });
    }
};

/**
 * Atšaukti užduotį
 * Ši funkcija leidžia vartotojui atšaukti užduotį
 */
exports.cancelTodo = async (req, res) => {
    const id = req.params.id; // Gauname užduoties ID iš užklausos parametrų
    try {
        const todo = await Todo.findById(id); // Ieškome užduoties pagal ID
        if (!todo) {
            return res.status(404).json({ error: "Elementas nerastas" });
        }

        // ACL patikrinimas
        if (req.user.role !== 'admin' && todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Nėra teisių atšaukti šios užduoties" });
        }

        todo.status = 'cancelled'; // Atnaujiname užduoties būseną į 'cancelled'
        await todo.save(); // Išsaugome pakeitimus į duomenų bazę
        
        res.json({ message: "Užduotis atšaukta", data: todo }); // Grąžiname atnaujintą užduotį kaip JSON atsakymą
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(404).json({ error: "Elementas nerastas"});
        }
        res.status(500).json({ error: "Klaida atšaukiant užduotį: " + err.toString() });
    }
};
