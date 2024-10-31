'use strict';

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Todo = require('./models/todo'); // Užtikrinkite, kad kelias ir failo pavadinimas yra teisingi
require('dotenv').config(); // Įkelkite aplinkos kintamuosius iš .env failo

// Middleware JSON kūnų analizavimui
app.use(express.json());

// MongoDB prisijungimo duomenys iš .env failo
const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DB;
const port = process.env.PORT || 3000;

// Sukurkite MongoDB prisijungimo URI
const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

// Funkcija prisijungti prie MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Prisijungta prie MongoDB sėkmingai!");
    } catch (error) {
        console.error("Klaida jungiantis prie MongoDB:", error);
        process.exit(1); // Išeiti iš programos jei prisijungimas nepavyksta
    }
}

// Iškvieskite funkciją prisijungti prie duomenų bazės
connectToDatabase();

// Paleiskite serverį po sėkmingo prisijungimo prie duomenų bazės
mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Serveris veikia ant ${port} porto`);
    });
});

// Maršrutas gauti visus užduotis
app.get('/todo', async (req, res) => {
    try {
        const todos = await Todo.find({});
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: "Klaida skaitant duomenis" });
    }
});

// Maršrutas gauti konkrečią užduotį pagal ID
app.get('/todo/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findById(id);

        if (!todo) {
            res.status(404).json({ error: "Elementas nerastas" });
            return; // Sustabdyti tolesnį vykdymą
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
});

// Maršrutas sukurti naują užduotį
app.post('/todo', async (req, res) => {
    try {
        const { title, author, status } = req.body;

        // Patikrinkite, ar visi reikalingi laukeliai yra pateikti
        if (!title || !author || !status) {
            res.status(400).json({ error: "Trūksta laukų užklausoje" });
            return; // Sustabdyti tolesnį vykdymą
        }

        const todo = new Todo({ title, author, status });
        await todo.save(); // Palaukite, kol įrašymas bus baigtas
        res.status(201).json(todo); // 201 Sukurtas
    } catch (err) {
        res.status(500).json({ error: "Klaida išsaugant duomenis: " + err.toString() });
    }
});

// Maršrutas visiškai atnaujinti užduotį
app.put('/todo/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }

        const { title, author, status } = req.body;

        // Patikrinkite, ar visi reikalingi laukeliai yra pateikti
        if (!title || !author || !status) {
            res.status(400).json({ error: "Trūksta laukų užklausoje" });
            return;
        }

        // Atnaujinkite užduoties laukus
        todo.title = title;
        todo.author = author;
        todo.status = status;

        await todo.save(); // Palaukite, kol įrašymas bus baigtas
        res.json({ message: "Elementas atnaujintas", data: todo });
    } catch (err) {
        res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
    }
});

// Maršrutas dalinio užduoties atnaujinimui
app.patch('/todo/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }

        const { title, author, status } = req.body;

        // Atnaujinkite tik tuos laukus, kurie pateikti
        if (title !== undefined) todo.title = title;
        if (author !== undefined) todo.author = author;
        if (status !== undefined) todo.status = status;

        await todo.save(); // Palaukite, kol įrašymas bus baigtas
        res.json({ message: "Elementas iš dalies atnaujintas", data: todo });
    } catch (err) {
        // Patikrinkite, ar klaida dėl netinkamo ObjectId
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
    }
});

// Maršrutas ištrinti užduotį
app.delete('/todo/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        res.json({ message: "Elementas ištrintas" });
    } catch (err) {
        // Patikrinkite, ar klaida dėl netinkamo ObjectId
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        res.status(500).json({ error: "Klaida trinant duomenis: " + err.toString() });
    }
});

// Maršrutas pažymėti užduotį kaip atliktą
app.post('/todo/:id/done', async (req, res) => {
    const id = req.params.id;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }

        todo.status = "done";
        await todo.save(); // Palaukite, kol įrašymas bus baigtas
        res.json({ message: "Darbas atliktas", data: todo });
    } catch (err) {
        // Patikrinkite, ar klaida dėl netinkamo ObjectId
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            res.status(404).json({ error: "Elementas nerastas" });
            return;
        }
        res.status(500).json({ error: "Klaida atnaujinant duomenis: " + err.toString() });
    }
});

// 404 klaidos tvarkymas neapibrėžtiems maršrutams
app.use((req, res) => {
    res.status(404).json({ error: "Puslapis nerastas" });
});
