'use strict';

const mongoose = require('mongoose');

const uri = "mongodb+srv://cslektorius:Y7kqtWXebwuwa4YM@cluster0.yhjhj.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0";
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    year: Number
});

const Movie = mongoose.model('Movie', movieSchema, 'movies');

async function run() {
    try {
        // Prisijungimas prie MongoDB per Mongoose
        await mongoose.connect(uri);
        console.log("Prisijungta prie MongoDB per Mongoose!");

        // Gauti visus filmus iš kolekcijos ir atspausdinti jų pavadinimus
        const movies = await Movie.find({}).limit(5);
        movies.forEach(movie => console.log(movie.title));

    } catch (error) {
        console.error("Klaida prisijungiant prie MongoDB:", error);
    } finally {
        // Atsijungimas nuo MongoDB
        await mongoose.disconnect();
    }
}

run().catch(console.dir);
