/**
 * Griežto režimo įjungimas
 * Padeda išvengti dažnų programavimo klaidų ir neleidžia naudoti nedeklaruotų kintamųjų
 */
'use strict';

/**
 * Reikalingų modulių importavimas:
 * - authController: tvarko autentifikacijos logiką (prisijungimas, registracija)
 * - express: web aplikacijų kūrimo framework'as
 * - corsHandler: tvarko Cross-Origin Resource Sharing (CORS) - leidžia priėjimą iš kitų domenų
 */
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const corsHandler = require('../middlewares/corsHandler');

/**
 * POST /login maršrutas - vartotojo prisijungimui
 * 
 * Kai vartotojas bando prisijungti:
 * 1. Pirma suveikia corsHandler - patikrina ar užklausa gali būti priimta
 * 2. Tada authController.login funkcija apdoroja prisijungimo logiką
 * 
 * Pavyzdys naudojimo:
 * POST /auth/login
 * Body: {
 *   "email": "vardas@pastas.lt",
 *   "password": "slaptazodis123"
 * }
 */
router.post('/login', corsHandler, authController.login);

/**
 * Eksportuojame maršrutų objektą, kad galėtume jį naudoti pagrindiniame app.js faile
 * Tai leidžia mums turėti tvarkingą ir modulinę kodo struktūrą
 */
module.exports = router;