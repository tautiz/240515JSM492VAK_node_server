'use strict';

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const Todo = require('./models/todo');
const mongoose = require("mongoose");

app.listen(3000);
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(express.json());
const dataFilePath = path.join(__dirname, '../db/data.json');
const uri = "mongodb+srv://cslektorius:Y7kqtWXebwuwa4YM@cluster0.yhjhj.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0";

// Prisijungimas prie MongoDB per Mongoose
async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Prisijungta prie MongoDB per Mongoose!");
    } catch (error) {
        console.error("Klaida prisijungiant prie MongoDB:", error);
    }
}
run().catch(console.dir);


app.get('/todo', async (req, res) => {
    try {
        const masyvas = await Todo.find({});

        res.json(masyvas);
    } catch (err) {
        res.status(500).json({ error: "Error reading data" });
    }
});

app.get('/todo/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const elementas = await Todo.findById(id);
        res.json(elementas);
    } catch (err) {
        if (err.statusCode === 404 || err.kind === 'ObjectId') {
            res.status(404).json({ error: "Elementas nerastas" });
        }
        res.status(500).json({ error: "Error reading data" });
    }
});

app.post('/todo', async (req, res) => {
    try {
        const { title, author, status } = req.body;
        if (!title || !author || !status) {
            res.status(400).json({ error: "Trūksta laukų užklausoje" });
        }
        const todo = new Todo({ title, author, status });
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: "Error saving data: " + err.toString() });
    }
});

app.put('/todo/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        const masyvas = JSON.parse(data);
        const index = masyvas.findIndex(elementas => elementas.id === id);
        if (index === -1) {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        const { title, author, status } = req.body;
        if (!title || !author || !status) {
            res.status(400).json({ error: "Trūksta laukų užklausoje" });
            return;
        }
        masyvas[index] = { title, author, status, id };
        await fs.writeFile(dataFilePath, JSON.stringify(masyvas, null, 2));
        res.json({ message: "Elementas atnaujintas", elementas: masyvas[index] });
    } catch (err) {
        res.status(500).json({ error: "Error updating data: " + err.toString() });
    }
});

app.patch('/todo/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        const masyvas = JSON.parse(data);
        const index = masyvas.findIndex(elementas => elementas.id === id);
        if (index === -1) {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        const { title, author, status } = req.body;
        if (title !== undefined) masyvas[index].title = title;
        if (author !== undefined) masyvas[index].author = author;
        if (status !== undefined) masyvas[index].status = status;
        await fs.writeFile(dataFilePath, JSON.stringify(masyvas, null, 2));
        res.json({ message: "Elementas iš dalies atnaujintas", elementas: masyvas[index] });
    } catch (err) {
        res.status(500).json({ error: "Error updating data: " + err.toString() });
    }
});

app.delete('/todo/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        let masyvas = JSON.parse(data);
        const index = masyvas.findIndex(elementas => elementas.id === id);
        if (index === -1) {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        masyvas.splice(index, 1);
        await fs.writeFile(dataFilePath, JSON.stringify(masyvas, null, 2));
        res.json({ message: "Elementas ištrintas" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting data: " + err.toString() });
    }
});

app.post('/todo/:id/done', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        const masyvas = JSON.parse(data);
        const index = masyvas.findIndex(elementas => elementas.id === id);
        if (index === -1) {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        masyvas[index].status = "done";
        await fs.writeFile(dataFilePath, JSON.stringify(masyvas, null, 2));
        res.json({ message: "Elementas pakeistas iš darbą" });
    } catch (err) {
        res.status(500).json({ error: "Error updating data: " + err.toString() });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: "Puslapis nerastas" });
});
