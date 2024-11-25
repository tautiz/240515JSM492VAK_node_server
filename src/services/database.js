// Duomenų bazės paslauga
// Šis modulis nustato ryšį su MongoDB duomenų baze naudojant Mongoose.
// Jis naudoja aplinkos kintamuosius prisijungimo informacijai gauti ir bando prisijungti prie duomenų bazės.
// Jei prisijungimas sėkmingas, išvedamas atitinkamas pranešimas. Jei nepavyksta prisijungti, išvedama klaida ir procesas nutraukiamas.

'use strict';

const mongoose = require('mongoose');

const connectToDatabase = async () => {
    const username = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const cluster = process.env.MONGODB_CLUSTER;
    const dbName = process.env.MONGODB_DB;
    const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

    try {
        await mongoose.connect(uri, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log("Prisijungta prie MongoDB sėkmingai!");
    } catch (error) {
        console.error("Klaida jungiantis prie MongoDB:", error);
        process.exit(1);
    }
};

module.exports = connectToDatabase;