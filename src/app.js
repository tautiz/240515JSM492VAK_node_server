'use strict';

const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const corsHandler = require('./middlewares/corsHandler');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware JSON kūnų analizavimui
app.use(express.json());
app.use(corsHandler);

// Prisijungimas prie MongoDB
const connectToDatabase = require('./services/database');
connectToDatabase();

// HTTP užklausų registravimas ir konsolėje atvaizdavimas. 
// Su tikslu ištirti kokios užklausos atliko vartotojas
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/todo', todoRoutes);

// Sveikatos patikrinimo maršrutas
app.get('/health', (req, res) => {res.json({ status: 'OK', message: 'Sistema veikia' });});

// 404 klaidos tvarkymas neapibrėžtiems maršrutams
app.use((req, res) => {
    res.status(404).json({ error: "Puslapis nerastas" });
});

app.use(corsHandler);

// Paleiskite serverį po sėkmingo prisijungimo prie duomenų bazės
mongoose.connection.once('open', () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Serveris veikia ant ${port} porto`);
    });
});