const express = require('express');

const app = express();

app.listen(3000);
app.set('view engine', 'ejs');

app.get('/', (req, res) => { res.render('index', {vardas: "Tautvydai", title: "Pradzia"} )});
app.get('/about', (req, res) => {  res.render('about', {title: "About us"})});
app.get('/apie-mane', (req, res) => {  res.redirect('about')});
app.use((req, res) => { res.status(404).render('404', {title: "404"})});
