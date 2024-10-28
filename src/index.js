'use strict';

const express = require('express');
const fs = require('fs');

const app = express();

app.listen(3000);
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(express.json());

app.get('/todo', (req, res) => {
    //... skaitom failo turini ir priskiriam kintamajam masyvas
    res.json(masyvas);
});

app.get('/todo/:id', (req, res) => {
    const id = req.params.id;
    //... skaitom failo turini ir priskiriam kintamajam masyvas
    const elementas = masyvas.find(elementas => elementas.id == id);
    if (!elementas) {
        res.json({error: "Elementas nerastas"});
        return;
    }
    res.json(elementas);
});

app.post('/todo', (req, res) => {
    //... skaitom failo turini ir priskiriam kintamajam masyvas
    const title = req.body.title;
    const author = req.body.author;
    const status = req.body.status;
    const id = masyvas.length + 1;
    // masyvas.push({title, author, status, id}); // reikia refaktorinti saugojima i faila
    res.json(masyvas);
});

app.use((req, res) => {
    res.status(404).json({error: "Puslapis nerastas"});
});
