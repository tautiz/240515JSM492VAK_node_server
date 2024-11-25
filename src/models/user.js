// Vartotojo modelis
// Šis modulis apibrėžia vartotojo schemą MongoDB duomenų bazei naudojant Mongoose.
// Schema apima vartotojo el. paštą, slaptažodį, prieigos raktą, rolę ir leidimus.

'use strict';
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        email: {type: 'string', required: true, unique: true}, // Unikalus vartotojo el. pašto adresas
        password: {type: 'string', required: true}, // Vartotojo slaptažodis
        token: {type: 'string', required: true}, // Prieigos raktas autentifikacijai
        role: {
            type: String,
            enum: ['user', 'admin', 'manager'],
            default: 'user'
        }, // Vartotojo rolė su numatytąja reikšme 'user'
        permissions: [{
            type: String
        }] // Papildomi vartotojo leidimai
    },
    {
        timestamps: true, // Automatiškai prideda sukūrimo ir atnaujinimo laiką
        versionKey: false
    }
);
module.exports = mongoose.model('User', userSchema, 'users'); // Eksportuoja vartotojo modelį MongoDB kolekcijai 'users'