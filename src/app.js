/**
 * Pagrindinių bibliotekų importavimas
 * Express - web serverio framework'as
 * Mongoose - MongoDB duomenų bazės valdymo įrankis
 */
const express = require('express');
const mongoose = require('mongoose');

/**
 * Aplikacijos maršrutų (routes) importavimas
 * todoRoutes - užduočių valdymo maršrutai
 * authRoutes - autentifikacijos maršrutai
 */
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

/**
 * Papildomų įrankių importavimas
 * corsHandler - leidžia priėjimą prie API iš skirtingų domenų
 * dotenv - aplinkos kintamųjų valdymui
 */
const corsHandler = require('./middlewares/corsHandler');
require('dotenv').config();

// Express aplikacijos sukūrimas
const app = express();
const port = process.env.PORT || 3000;

/**
 * Pagrindinių middleware nustatymai
 * express.json() - leidžia apdoroti JSON formato duomenis
 * corsHandler - nustato CORS politiką
 */
app.use(express.json());
app.use(corsHandler);

/**
 * Duomenų bazės prisijungimo nustatymai
 * Importuojame ir iškviečiame prisijungimo funkciją
 */
const connectToDatabase = require('./services/database');
connectToDatabase();

/**
 * Užklausų registravimo middleware
 * Registruoja visas gaunamas užklausas į konsolę
 * Naudinga derinimo (debugging) tikslais
 */
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

/**
 * Aplikacijos maršrutų prijungimas
 * /auth - autentifikacijos maršrutai (prisijungimas, registracija)
 * /todo - užduočių valdymo maršrutai
 */
app.use('/auth', authRoutes);
app.use('/todo', todoRoutes);

/**
 * Sistemos būsenos tikrinimo maršrutas
 * Naudojamas patikrinti ar serveris veikia
 */
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Sistema veikia' });
});

/**
 * Klaidų valdymas
 * 404 klaidos tvarkymas - kai užklausa neatitinka jokio apibrėžto maršruto
 */
app.use((req, res) => {
    res.status(404).json({ error: "Puslapis nerastas" });
});

/**
 * Serverio paleidimas
 * Serveris paleidžiamas tik po sėkmingo prisijungimo prie duomenų bazės
 */
mongoose.connection.once('open', () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Serveris veikia ant ${port} porto`);
    });
});