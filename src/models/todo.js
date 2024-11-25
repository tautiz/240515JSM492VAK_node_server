// Užduoties modelis
// Šis modulis apibrėžia užduoties schemą MongoDB duomenų bazei naudojant Mongoose.
// Schema apima užduoties pavadinimą, būseną, aprašymą, autorių ir susijusį vartotojo ID.

'use strict';

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {type: 'string', required: true}, // Užduoties pavadinimas
    status: {type: 'string', required: true}, // Užduoties būsena
    description: {type: 'string', required: false}, // Užduoties aprašymas
    author: String, // Užduoties autorius
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    } // Susijęs vartotojo ID
    // ,
    // teamId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Team',
    //     default: null
    // }
},{
    timestamps: true, // Automatiškai prideda sukūrimo ir atnaujinimo laiką
    versionKey: false
});

module.exports = mongoose.model('Todo', todoSchema, 'todo'); // Eksportuoja užduoties modelį MongoDB kolekcijai 'todo'