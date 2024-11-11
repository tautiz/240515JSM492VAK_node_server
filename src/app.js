'use strict';

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const todoRouter = require('./routes/todoRoutes');
const Todo = require('./models/todo'); // Užtikrinkite, kad kelias ir failo pavadinimas yra teisingi
require('dotenv').config(); // Įkelkite aplinkos kintamuosius iš .env failo
const corsHandler = require('./middlewares/corsHandler');
const connectToDatabase = require('./services/database');

connectToDatabase();
app.use(corsHandler);
app.use('/todo', todoRouter);
// Sveikatos patikrinimo maršrutas
app.get('/health', (req, res) => {res.json({ status: 'OK', message: 'Sistema veikia' });});

// 404 klaidos tvarkymas neapibrėžtiems maršrutams
app.use((req, res) => {
    res.status(404).json({ error: "Puslapis nerastas" });
});

const port = process.env.PORT || 3000;
// Paleiskite serverį po sėkmingo prisijungimo prie duomenų bazės
mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Serveris veikia ant ${port} porto`);
    });
});